-- Add employee_availability table
create table if not exists public.employee_availability (
  id            uuid primary key default gen_random_uuid(),
  employee_id   uuid not null references public.employees(id) on delete cascade,
  day_of_week   integer not null check (day_of_week between 0 and 6),
  start_time    time not null,
  end_time      time not null,
  created_at    timestamptz not null default now()
);

create unique index idx_employee_availability_unique on public.employee_availability(employee_id, day_of_week);

-- Add bookings table
create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references public.clients(id) on delete cascade,
  employee_id       uuid references public.employees(id) on delete set null,
  service_type      text not null check (service_type in ('construction','hardscape','maintenance')),
  date_time         timestamptz not null,
  duration_minutes  integer default 120,
  status            text not null default 'pending' check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  project_id        uuid references public.projects(id) on delete set null,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_bookings_client_id on public.bookings(client_id);
create index idx_bookings_employee_id on public.bookings(employee_id);
create index idx_bookings_date_time on public.bookings(date_time);
create index idx_bookings_status on public.bookings(status);

-- Enable RLS
alter table public.employee_availability enable row level security;
alter table public.bookings enable row level security;

-- RLS Policies for employee_availability
create policy "employee_availability_select" on public.employee_availability for select
  using (true);

create policy "employee_availability_manage" on public.employee_availability
  using (
    employee_id = (select id from public.employees where profile_id = auth.uid())
    or auth.uid() in (select id from public.profiles where role = 'admin')
  );

-- RLS Policies for bookings
create policy "bookings_select_own" on public.bookings for select
  using (
    client_id = (select client_id from public.clients where profile_id = auth.uid())
    or employee_id = (select id from public.employees where profile_id = auth.uid())
    or auth.uid() in (select id from public.profiles where role = 'admin')
  );

create policy "bookings_insert_client" on public.bookings for insert
  with check (
    client_id = (select client_id from public.clients where profile_id = auth.uid())
  );

create policy "bookings_update_admin" on public.bookings for update
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "bookings_delete_admin" on public.bookings for delete
  using (auth.uid() in (select id from public.profiles where role = 'admin'));
