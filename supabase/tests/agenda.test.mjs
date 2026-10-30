import { PGlite } from '@electric-sql/pglite'
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist'
import { readFileSync } from 'node:fs'

const db = new PGlite({ extensions: { btree_gist } })
await db.exec(`
  create role anon; create role authenticated; create role service_role;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  set timezone = 'UTC';
`)
// Prueba la base de datos de reservas en un Postgres en memoria: npm run test:db
await db.exec(readFileSync(new URL('../migrations/20261030000000_reservas.sql', import.meta.url), 'utf8'))

const q = async (sql, p) => (await db.query(sql, p)).rows
let fails = 0
const ok = (cond, msg) => { console.log(cond ? '✔' : '✘', msg); if (!cond) fails++ }
const err = async (sql, p, code, msg) => {
  try { await db.query(sql, p); ok(false, msg + ' (no dio error)') }
  catch (e) { ok(e.message.includes(code), `${msg} → ${e.message}`) }
}

// Próximo lunes (hora de París)
const [{ mon }] = await q(`select (date_trunc('week', (now() at time zone 'Europe/Paris')::date + 7))::date::text as mon`)
const wed = (await q(`select ($1::date + 2)::text d`, [mon]))[0].d
console.log('lunes:', mon, 'miércoles:', wed)

const fmt = (rows) => rows.map((r) => new Date(r.starts_at).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }))

const monSlots = fmt(await q(`select starts_at from available_slots('tarot', $1, $1)`, [mon]))
ok(monSlots[0] === '09:00' && monSlots.at(-1) === '16:30', `lunes tarot 30': ${monSlots[0]}…${monSlots.at(-1)} (${monSlots.length} turnos)`)
const wedSlots = fmt(await q(`select starts_at from available_slots('tarot', $1, $1)`, [wed]))
ok(!wedSlots.some((t) => t > '10:15' && t < '12:15'), `miércoles sin turnos que pisen 11–12 + margen: ${wedSlots.filter(t => t >= '10:00' && t <= '12:30').join(' ')}`)
const sat = (await q(`select ($1::date + 5)::text d`, [mon]))[0].d
ok((await q(`select * from available_slots('tarot', $1, $1)`, [sat])).length === 0, 'sábado sin turnos')
ok((await q(`select * from available_slots('noexiste', $1, $1)`, [mon])).length === 0, 'servicio inexistente sin turnos')

// Reserva
const slot = `${mon} 10:00 Europe/Paris`
const [b1] = await q(`select * from create_booking('tarot', $1::timestamptz, 'Ana', 'ANA@mail.com ', '', 'es', 'hola')`, [slot])
ok(b1.status === 'pending_payment' && b1.client_email === 'ana@mail.com' && Number(b1.price) === 40, `reserva tarot pendiente de pago, 40 €`)
await err(`select * from create_booking('tarot', $1::timestamptz, 'Bea', 'b@mail.com', '', 'fr', '')`, [slot], 'slot_unavailable', 'mismo turno rechazado')
await err(`select * from create_booking('tarot', $1::timestamptz, 'Bea', 'b@mail.com', '', 'fr', '')`, [`${mon} 10:40 Europe/Paris`], 'slot_unavailable', 'turno pegado (sin margen) rechazado')
const after = fmt(await q(`select starts_at from available_slots('tarot', $1, $1)`, [mon]))
ok(!after.includes('10:00') && !after.includes('10:30') && after.includes('10:45'), `turnos del lunes se actualizan: ${after.filter(t => t >= '09:30' && t <= '11:00').join(' ')}`)
await err(`insert into bookings (service_id, starts_at, ends_at, status, client_name, client_email)
           select id, $1::timestamptz, $1::timestamptz + interval '30 min', 'paid', 'X', 'x@x.com' from services where key='tarot'`,
  [`${mon} 10:15 Europe/Paris`], 'bookings_no_overlap', 'la base impide sesiones superpuestas')
const [call] = await q(`select * from create_booking('call', $1::timestamptz, 'Cami', 'c@mail.com', '+33', 'fr', '')`, [`${mon} 14:00 Europe/Paris`])
ok(call.status === 'confirmed', 'llamada gratis queda confirmada')
await err(`select * from create_booking('tarot', now() + interval '1 hour', 'D', 'd@mail.com', '', 'fr', '')`, [], 'slot_unavailable', 'con menos de 12 h de aviso rechazado')

// Estado pagado → fecha
await q(`update bookings set status='paid' where id=$1`, [b1.id])
ok((await q(`select paid_at from bookings where id=$1`, [b1.id]))[0].paid_at, 'marcar pagada guarda la fecha')

// Eventos con cupo
const [ev] = await q(`insert into events (title, starts_at, ends_at, capacity, price) values
  ('{"fr":"Cours d''essai gratuit"}', $1::timestamptz, $1::timestamptz + interval '1 hour', 2, 0) returning *`, [`${wed} 15:00 Europe/Paris`])
await q(`select * from register_event($1, 'E1', 'e1@mail.com', '', 'fr', '')`, [ev.id])
await err(`select * from register_event($1, 'E1', 'E1@mail.com', '', 'fr', '')`, [ev.id], 'already_registered', 'misma persona no se inscribe dos veces')
await q(`select * from register_event($1, 'E2', 'e2@mail.com', '', 'fr', '')`, [ev.id])
await err(`select * from register_event($1, 'E3', 'e3@mail.com', '', 'fr', '')`, [ev.id], 'event_full', 'evento lleno')
const [pe] = await q(`select * from public_events()`)
ok(pe.spots_left === 0, 'public_events muestra 0 lugares')
const wedAfter = fmt(await q(`select starts_at from available_slots('tarot', $1, $1)`, [wed]))
ok(!wedAfter.some((t) => t > '14:15' && t < '16:15'), 'el evento ocupa la agenda: ' + wedAfter.filter(t => t >= '14:00' && t <= '16:30').join(' '))

// Cancelación
const [{ cancel_token }] = await q(`select cancel_token from bookings where client_email='e2@mail.com'`)
const [cb] = await q(`select * from cancel_booking($1)`, [cancel_token])
ok(cb.status === 'cancelled' && cb.cancelled_at, 'cancelación con token')
await err(`select * from cancel_booking($1)`, [cancel_token], 'already_cancelled', 'no se cancela dos veces')
ok((await q(`select * from public_events()`))[0].spots_left === 1, 'cancelar libera un lugar')
ok((await q(`select * from booking_by_token($1)`, [cancel_token]))[0].status === 'cancelled', 'booking_by_token')

// Horario de verano: un lunes de julio, las 9:00 de París son 07:00 UTC
await q(`update settings set max_days_ahead = 365`)
const [{ jul }] = await q(`select (date '2027-07-05')::text jul`)
const jr = await q(`select starts_at from available_slots('tarot', $1, $1) limit 1`, [jul])
ok(new Date(jr[0].starts_at).toISOString().endsWith('07:00:00.000Z'), `verano: primer turno ${new Date(jr[0].starts_at).toISOString()}`)

// RLS: anon no ve reservas
await db.exec(`grant usage on schema public to anon; grant select on all tables in schema public to anon;`)
await db.exec(`set role anon`)
ok((await q(`select * from bookings`)).length === 0, 'anon no ve reservas')
ok((await q(`select * from services`)).length === 9, 'anon ve los 9 servicios')
await err(`select * from create_booking('tarot', now(), 'x','x@x.com','','fr','')`, [], 'permission denied', 'anon no puede reservar directo')
await db.exec(`reset role`)

console.log(fails ? `\n${fails} FALLAS` : '\nTodo OK')
process.exit(fails ? 1 : 0)
