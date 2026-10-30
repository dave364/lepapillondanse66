-- ============================================================================
-- Le Papillon Danse 66 · Sistema de reservas propio
-- Se corre una sola vez en Supabase: SQL Editor → pegar todo → Run
-- (o `supabase db push` si usás la CLI).
--
-- Horas: todo se guarda en UTC (timestamptz) y se calcula en la zona de
-- settings.timezone (Europe/Paris), así el cambio de hora de verano/invierno
-- no corre los horarios.
-- ============================================================================

create extension if not exists btree_gist;

-- ---------------------------------------------------------------------------
-- Ajustes generales (una sola fila)
-- ---------------------------------------------------------------------------
create table public.settings (
  id                int primary key default 1 check (id = 1),
  timezone          text    not null default 'Europe/Paris',
  slot_step_minutes int     not null default 15  check (slot_step_minutes between 5 and 120),
  buffer_minutes    int     not null default 15  check (buffer_minutes between 0 and 120),
  min_notice_hours  int     not null default 12  check (min_notice_hours between 0 and 336),
  max_days_ahead    int     not null default 60  check (max_days_ahead between 1 and 365),
  reminder_hours    int     not null default 24  check (reminder_hours between 1 and 168),
  -- adónde llegan los avisos de reservas nuevas y a quién responde la clienta
  admin_email       text    not null default 'lepapillondanse@gmail.com',
  paypal_url        text    not null default 'https://paypal.me/zulgeycastro',
  -- cambiar a https://www.lepapillondanse66.com cuando el dominio apunte acá
  site_url          text    not null default 'https://lepapillondanse66.onrender.com',
  -- dónde son las sesiones que no son en línea (va en el email)
  session_location  text    not null default 'Salle Sweet Om « Centre del Món », 1 bis rue de la Pépinière Robin, 66000 Perpignan'
);
insert into public.settings (id) values (1);

-- ---------------------------------------------------------------------------
-- Servicios (clases y sesiones individuales que se reservan con horario)
-- name = { "fr": "...", "es": "...", "en": "...", "ar": "..." } (para emails y panel)
-- La descripción larga de cada uno sigue en los archivos de idioma del sitio.
-- ---------------------------------------------------------------------------
create table public.services (
  id         uuid primary key default gen_random_uuid(),
  key        text unique not null,
  category   text not null check (category in ('call', 'dance', 'care')),
  name       jsonb not null,
  price      numeric(8,2) not null default 0 check (price >= 0),
  minutes    int not null check (minutes between 5 and 480),
  online     boolean not null default false,
  free_trial boolean not null default false,
  active     boolean not null default true,
  sort       int not null default 0
);

-- ---------------------------------------------------------------------------
-- Horario de atención semanal (weekday ISO: 1 = lunes … 7 = domingo)
-- ---------------------------------------------------------------------------
create table public.availability (
  id         uuid primary key default gen_random_uuid(),
  weekday    smallint not null check (weekday between 1 and 7),
  start_time time not null,
  end_time   time not null check (end_time > start_time)
);

-- Ocupado todas las semanas (clases presenciales, etc.)
create table public.recurring_blocks (
  id         uuid primary key default gen_random_uuid(),
  weekday    smallint not null check (weekday between 1 and 7),
  start_time time not null,
  end_time   time not null check (end_time > start_time),
  label      text
);

-- Ocupado una sola vez (vacaciones, un turno médico, un día libre…)
create table public.blocks (
  id        uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at   timestamptz not null check (ends_at > starts_at),
  label     text
);

-- ---------------------------------------------------------------------------
-- Eventos con cupo (clase gratis de prueba, talleres, haflas…)
-- ---------------------------------------------------------------------------
create table public.events (
  id            uuid primary key default gen_random_uuid(),
  title         jsonb not null,               -- { fr, es, en, ar } (al menos fr)
  description   jsonb not null default '{}'::jsonb,
  starts_at     timestamptz not null,
  ends_at       timestamptz not null check (ends_at > starts_at),
  capacity      int not null check (capacity > 0),
  price         numeric(8,2) not null default 0 check (price >= 0),
  location      text,                          -- dirección o "En ligne"
  online        boolean not null default false,
  published     boolean not null default true,
  blocks_agenda boolean not null default true, -- si ocupa la agenda de sesiones
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Reservas (de un servicio con horario o de un evento con cupo)
-- ---------------------------------------------------------------------------
create type public.booking_status as enum (
  'pending_payment',  -- pendiente de pago (hasta que Zulgey la marque)
  'paid',             -- pagada
  'confirmed',        -- confirmada sin pago (gratis)
  'cancelled'
);

create table public.bookings (
  id               uuid primary key default gen_random_uuid(),
  service_id       uuid references public.services (id) on delete restrict,
  event_id         uuid references public.events (id) on delete cascade,
  starts_at        timestamptz not null,
  ends_at          timestamptz not null check (ends_at > starts_at),
  status           public.booking_status not null,
  price            numeric(8,2) not null default 0,
  client_name      text not null check (length(client_name) between 1 and 120),
  client_email     text not null check (client_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  client_phone     text check (length(client_phone) <= 40),
  lang             text not null default 'fr' check (lang in ('fr', 'es', 'en', 'ar')),
  notes            text check (length(notes) <= 2000),
  source           text not null default 'web' check (source in ('web', 'admin')),
  cancel_token     uuid not null default gen_random_uuid() unique,
  reminder_sent_at timestamptz,
  paid_at          timestamptz,
  cancelled_at     timestamptz,
  created_at       timestamptz not null default now(),
  check ((service_id is null) <> (event_id is null)),
  -- Dos sesiones nunca se pisan, aunque lleguen dos reservas al mismo tiempo
  constraint bookings_no_overlap exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  ) where (service_id is not null and status <> 'cancelled')
);

create index bookings_starts_at_idx on public.bookings (starts_at);
create index bookings_event_idx on public.bookings (event_id) where event_id is not null;
create index bookings_reminder_idx on public.bookings (starts_at)
  where reminder_sent_at is null and status <> 'cancelled';

-- Fechas de pago/cancelación automáticas al cambiar el estado
create function public.bookings_status_dates() returns trigger
language plpgsql as $$
begin
  if new.status = 'paid' and (tg_op = 'INSERT' or old.status <> 'paid') then
    new.paid_at := coalesce(new.paid_at, now());
  elsif new.status <> 'paid' then
    new.paid_at := null;
  end if;
  if new.status = 'cancelled' and (tg_op = 'INSERT' or old.status <> 'cancelled') then
    new.cancelled_at := now();
  elsif new.status <> 'cancelled' then
    new.cancelled_at := null;
  end if;
  return new;
end $$;

create trigger bookings_status_dates
  before insert or update of status on public.bookings
  for each row execute function public.bookings_status_dates();

-- ---------------------------------------------------------------------------
-- Administradoras (Zulgey). Se agrega con:
--   insert into public.admins (user_id) select id from auth.users where email = '...';
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

-- ============================================================================
-- Lógica de agenda
-- ============================================================================

-- Todo lo que ocupa la agenda entre dos momentos
create function public.busy_ranges(p_from timestamptz, p_to timestamptz)
returns table (range tstzrange)
language sql stable security definer set search_path = public as $$
  with s as (select timezone as tz from settings where id = 1)
  -- sesiones reservadas
  select tstzrange(b.starts_at, b.ends_at)
    from bookings b
   where b.service_id is not null and b.status <> 'cancelled'
     and b.starts_at < p_to and b.ends_at > p_from
  union all
  -- eventos que ocupan la agenda
  select tstzrange(e.starts_at, e.ends_at)
    from events e
   where e.blocks_agenda and e.starts_at < p_to and e.ends_at > p_from
  union all
  -- bloqueos puntuales
  select tstzrange(k.starts_at, k.ends_at)
    from blocks k
   where k.starts_at < p_to and k.ends_at > p_from
  union all
  -- bloqueos semanales, día por día
  select tstzrange((d::date + r.start_time) at time zone s.tz,
                   (d::date + r.end_time)   at time zone s.tz)
    from s,
         generate_series((p_from at time zone s.tz)::date::timestamp,
                         (p_to   at time zone s.tz)::date::timestamp, interval '1 day') d
    join recurring_blocks r on r.weekday = extract(isodow from d)
$$;

-- Horarios libres de un servicio entre dos fechas (en la zona de Francia).
-- Devuelve el inicio de cada turno.
create function public.available_slots(p_service_key text, p_from date, p_to date)
returns table (starts_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare
  st      settings;
  svc     services;
  v_today date;
  v_from  date;
  v_to    date;
begin
  select * into st from settings where id = 1;
  select * into svc from services where key = p_service_key and active;
  if not found then return; end if;

  v_today := (now() at time zone st.timezone)::date;
  v_from  := greatest(p_from, v_today);
  v_to    := least(p_to, v_today + st.max_days_ahead, v_from + 62);
  if v_to < v_from then return; end if;

  return query
  with windows as (
    select (d::date + a.start_time) at time zone st.timezone as w_start,
           (d::date + a.end_time)   at time zone st.timezone as w_end
      from generate_series(v_from::timestamp, v_to::timestamp, interval '1 day') d
      join availability a on a.weekday = extract(isodow from d)
  ),
  candidates as (
    select gs as slot
      from windows w,
           generate_series(w.w_start,
                           w.w_end - make_interval(mins => svc.minutes),
                           make_interval(mins => st.slot_step_minutes)) gs
  ),
  busy as (
    select range from busy_ranges(
      (v_from::timestamp at time zone st.timezone) - interval '1 day',
      (v_to::timestamp   at time zone st.timezone) + interval '2 day')
  )
  select distinct c.slot
    from candidates c
   where c.slot >= now() + make_interval(hours => st.min_notice_hours)
     and not exists (
       select 1 from busy b
        where b.range && tstzrange(
          c.slot - make_interval(mins => st.buffer_minutes),
          c.slot + make_interval(mins => svc.minutes + st.buffer_minutes))
     )
   order by c.slot;
end $$;

-- Reserva de un servicio. La llama la función `book` (servidor), no el sitio.
create function public.create_booking(
  p_service_key text,
  p_starts_at   timestamptz,
  p_name        text,
  p_email       text,
  p_phone       text,
  p_lang        text,
  p_notes       text
) returns public.bookings
language plpgsql volatile security definer set search_path = public as $$
declare
  st  settings;
  svc services;
  b   bookings;
  v_day date;
begin
  -- Una reserva a la vez: evita que dos personas tomen el mismo turno
  perform pg_advisory_xact_lock(hashtext('papillon-bookings'));

  select * into st from settings where id = 1;
  select * into svc from services where key = p_service_key and active;
  if not found then raise exception 'service_not_found'; end if;

  v_day := (p_starts_at at time zone st.timezone)::date;
  if not exists (
    select 1 from available_slots(p_service_key, v_day, v_day) s
     where s.starts_at = p_starts_at
  ) then
    raise exception 'slot_unavailable';
  end if;

  insert into bookings (service_id, starts_at, ends_at, status, price,
                        client_name, client_email, client_phone, lang, notes)
  values (svc.id, p_starts_at, p_starts_at + make_interval(mins => svc.minutes),
          case when svc.price > 0 then 'pending_payment' else 'confirmed' end::booking_status,
          svc.price, trim(p_name), lower(trim(p_email)), nullif(trim(p_phone), ''),
          coalesce(nullif(p_lang, ''), 'fr'), nullif(trim(p_notes), ''))
  returning * into b;
  return b;
end $$;

-- Inscripción a un evento con cupo
create function public.register_event(
  p_event_id uuid,
  p_name     text,
  p_email    text,
  p_phone    text,
  p_lang     text,
  p_notes    text
) returns public.bookings
language plpgsql volatile security definer set search_path = public as $$
declare
  ev    events;
  taken int;
  b     bookings;
begin
  -- Bloquea el evento: dos inscripciones simultáneas no superan el cupo
  select * into ev from events where id = p_event_id and published for update;
  if not found then raise exception 'event_not_found'; end if;
  if ev.starts_at <= now() then raise exception 'event_past'; end if;

  if exists (select 1 from bookings
              where event_id = ev.id and status <> 'cancelled'
                and client_email = lower(trim(p_email))) then
    raise exception 'already_registered';
  end if;

  select count(*) into taken from bookings
   where event_id = ev.id and status <> 'cancelled';
  if taken >= ev.capacity then raise exception 'event_full'; end if;

  insert into bookings (event_id, starts_at, ends_at, status, price,
                        client_name, client_email, client_phone, lang, notes)
  values (ev.id, ev.starts_at, ev.ends_at,
          case when ev.price > 0 then 'pending_payment' else 'confirmed' end::booking_status,
          ev.price, trim(p_name), lower(trim(p_email)), nullif(trim(p_phone), ''),
          coalesce(nullif(p_lang, ''), 'fr'), nullif(trim(p_notes), ''))
  returning * into b;
  return b;
end $$;

-- Cancelación por la clienta con el link del email
create function public.cancel_booking(p_token uuid) returns public.bookings
language plpgsql volatile security definer set search_path = public as $$
declare b bookings;
begin
  select * into b from bookings where cancel_token = p_token for update;
  if not found then raise exception 'booking_not_found'; end if;
  if b.status = 'cancelled' then raise exception 'already_cancelled'; end if;
  if b.starts_at <= now() then raise exception 'booking_past'; end if;
  update bookings set status = 'cancelled' where id = b.id returning * into b;
  return b;
end $$;

-- Eventos próximos para el sitio, con lugares libres
create function public.public_events()
returns table (id uuid, title jsonb, description jsonb, starts_at timestamptz,
               ends_at timestamptz, capacity int, spots_left int, price numeric,
               location text, online boolean)
language sql stable security definer set search_path = public as $$
  select e.id, e.title, e.description, e.starts_at, e.ends_at, e.capacity,
         greatest(e.capacity - (select count(*) from bookings b
                                 where b.event_id = e.id and b.status <> 'cancelled'), 0)::int,
         e.price, e.location, e.online
    from events e
   where e.published and e.starts_at > now()
   order by e.starts_at
$$;

-- Datos de una reserva por su token (página de cancelación)
create function public.booking_by_token(p_token uuid)
returns table (status public.booking_status, starts_at timestamptz, ends_at timestamptz,
               service_name jsonb, event_title jsonb)
language sql stable security definer set search_path = public as $$
  select b.status, b.starts_at, b.ends_at, s.name, e.title
    from bookings b
    left join services s on s.id = b.service_id
    left join events e on e.id = b.event_id
   where b.cancel_token = p_token
$$;

-- ============================================================================
-- Permisos (Row Level Security)
-- El público solo ve servicios activos y usa las funciones de arriba.
-- El panel (usuaria en public.admins) puede todo.
-- ============================================================================
alter table public.settings         enable row level security;
alter table public.services         enable row level security;
alter table public.availability     enable row level security;
alter table public.recurring_blocks enable row level security;
alter table public.blocks           enable row level security;
alter table public.events           enable row level security;
alter table public.bookings         enable row level security;
alter table public.admins           enable row level security;

create policy "servicios activos visibles" on public.services
  for select using (active or public.is_admin());

create policy "admin settings"  on public.settings         for all using (public.is_admin()) with check (public.is_admin());
create policy "admin services"  on public.services         for all using (public.is_admin()) with check (public.is_admin());
create policy "admin avail"     on public.availability     for all using (public.is_admin()) with check (public.is_admin());
create policy "admin rblocks"   on public.recurring_blocks for all using (public.is_admin()) with check (public.is_admin());
create policy "admin blocks"    on public.blocks           for all using (public.is_admin()) with check (public.is_admin());
create policy "admin events"    on public.events           for all using (public.is_admin()) with check (public.is_admin());
create policy "admin bookings"  on public.bookings         for all using (public.is_admin()) with check (public.is_admin());
create policy "admin ve admins" on public.admins           for select using (public.is_admin());

-- Acceso a las tablas (las reglas de arriba deciden qué filas ve cada uno)
grant usage on schema public to anon, authenticated, service_role;
grant select on public.services to anon;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;

-- Funciones: el sitio solo puede consultar; reservar/cancelar pasa por el servidor
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.available_slots(text, date, date) to anon, authenticated;
grant execute on function public.public_events()                   to anon, authenticated;
grant execute on function public.booking_by_token(uuid)            to anon, authenticated;
grant execute on function public.is_admin()                        to anon, authenticated;
grant execute on function public.busy_ranges(timestamptz, timestamptz) to authenticated;
grant execute on function public.create_booking(text, timestamptz, text, text, text, text, text) to service_role;
grant execute on function public.register_event(uuid, text, text, text, text, text) to service_role;
grant execute on function public.cancel_booking(uuid) to service_role;

-- ============================================================================
-- Datos iniciales
-- ============================================================================

-- Horario provisorio: lunes a viernes de 9 a 17 h (hora de Francia)
insert into public.availability (weekday, start_time, end_time)
select d, '09:00', '17:00' from generate_series(1, 5) d;

-- Clases presenciales
insert into public.recurring_blocks (weekday, start_time, end_time, label) values
  (1, '18:00', '19:15', 'Clase presencial (lunes)'),
  (3, '11:00', '12:00', 'Clase presencial (miércoles)');

-- Servicios (precios y duraciones del Setmore al 29/10/2026)
insert into public.services (key, category, name, price, minutes, online, free_trial, sort) values
  ('call', 'call',
   '{"fr":"Appel découverte gratuit","es":"Llamada gratuita para conocernos","en":"Free discovery call","ar":"مكالمة تعارف مجانية"}',
   0, 30, true, false, 0),
  ('intuitiveDance', 'dance',
   '{"fr":"Danse intuitive & études complémentaires","es":"Danza intuitiva y estudios complementarios","en":"Intuitive dance & complementary studies","ar":"الرقص الحدسي ودراسات مكمّلة"}',
   45, 45, true, true, 10),
  ('orientalIntuitive', 'dance',
   '{"fr":"Danse orientale intuitive","es":"Danza oriental intuitiva","en":"Intuitive oriental dance","ar":"الرقص الشرقي الحدسي"}',
   35, 45, true, true, 20),
  ('pilatesOnline', 'dance',
   '{"fr":"Préparation corporelle","es":"Preparación corporal","en":"Body conditioning","ar":"التهيئة الجسدية"}',
   60, 45, true, true, 30),
  ('tarot', 'care',
   '{"fr":"Consultation de tarot","es":"Consulta de tarot","en":"Tarot reading","ar":"استشارة تاروت"}',
   40, 30, false, false, 40),
  ('pendulum', 'care',
   '{"fr":"Pendule, radiesthésie & nettoyage énergétique","es":"Péndulo, radiestesia y limpieza energética","en":"Pendulum, dowsing & energy cleansing","ar":"البندول وعلم الاستشعار وتنظيف الطاقة"}',
   50, 30, false, false, 50),
  ('akashic', 'care',
   '{"fr":"Vies antérieures & annales akashiques","es":"Vidas pasadas y registros akáshicos","en":"Past lives & Akashic records","ar":"الحيوات السابقة والسجلات الأكاشية"}',
   100, 60, false, false, 60),
  ('spiritualCoaching', 'care',
   '{"fr":"Coaching spirituel & holistique de transformation","es":"Coaching espiritual y holístico de transformación","en":"Spiritual & holistic transformation coaching","ar":"تدريب روحي وشمولي للتحوّل"}',
   150, 60, false, false, 70),
  ('empowerment', 'care',
   '{"fr":"Coaching Empowerment Féminin","es":"Coaching Empowerment Femenino","en":"Women''s Empowerment Coaching","ar":"تدريب تمكين المرأة"}',
   300, 60, true, false, 80);
