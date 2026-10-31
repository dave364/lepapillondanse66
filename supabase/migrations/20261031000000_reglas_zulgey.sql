-- ============================================================================
-- Reglas que pasó Zulgey (31/10/2026)
-- Se corre una sola vez, después de 20261030000000_reservas.sql
-- ============================================================================

-- Paquetes: un servicio puede incluir varias sesiones (se paga el total al
-- reservar la primera; las siguientes se acuerdan con Sully)
alter table public.services
  add column sessions int not null default 1 check (sessions between 1 and 50);

-- Hasta cuántas horas antes puede cancelar la clienta con el link del email
alter table public.settings
  add column cancel_hours int not null default 24 check (cancel_hours between 0 and 336);

-- Coaching: holístico 4 sesiones por 150 € en total; empowerment 6 por 300 €
update public.services set sessions = 4 where key = 'spiritualCoaching';
update public.services set sessions = 6 where key = 'empowerment';

-- Lo presencial es solo la danza en Perpignan: el resto es en línea
update public.services set online = true
 where key in ('tarot', 'pendulum', 'akashic', 'spiritualCoaching', 'empowerment');

-- 48 h de anticipación, todo el año, 15 min entre sesiones
update public.settings
   set min_notice_hours = 48, max_days_ahead = 365, buffer_minutes = 15, cancel_hours = 24
 where id = 1;

-- Horario: lunes, jueves y viernes 18:00–19:30; sábados 18:00–20:00
delete from public.availability;
insert into public.availability (weekday, start_time, end_time) values
  (1, '18:00', '19:30'),
  (4, '18:00', '19:30'),
  (5, '18:00', '19:30'),
  (6, '18:00', '20:00');

-- Cancelación solo hasta `cancel_hours` antes del turno
create or replace function public.cancel_booking(p_token uuid) returns public.bookings
language plpgsql volatile security definer set search_path = public as $$
declare
  b  bookings;
  st settings;
begin
  select * into st from settings where id = 1;
  select * into b from bookings where cancel_token = p_token for update;
  if not found then raise exception 'booking_not_found'; end if;
  if b.status = 'cancelled' then raise exception 'already_cancelled'; end if;
  if b.starts_at <= now() then raise exception 'booking_past'; end if;
  if b.starts_at < now() + make_interval(hours => st.cancel_hours) then
    raise exception 'too_late';
  end if;
  update bookings set status = 'cancelled' where id = b.id returning * into b;
  return b;
end $$;

-- La página de cancelación necesita saber si todavía se puede cancelar
drop function public.booking_by_token(uuid);
create function public.booking_by_token(p_token uuid)
returns table (status public.booking_status, starts_at timestamptz, ends_at timestamptz,
               service_name jsonb, event_title jsonb, cancel_until timestamptz)
language sql stable security definer set search_path = public as $$
  select b.status, b.starts_at, b.ends_at, s.name, e.title,
         b.starts_at - make_interval(hours => (select cancel_hours from settings where id = 1))
    from bookings b
    left join services s on s.id = b.service_id
    left join events e on e.id = b.event_id
   where b.cancel_token = p_token
$$;

revoke execute on function public.booking_by_token(uuid) from public;
grant execute on function public.booking_by_token(uuid) to anon, authenticated;
revoke execute on function public.cancel_booking(uuid) from public, anon, authenticated;
grant execute on function public.cancel_booking(uuid) to service_role;
