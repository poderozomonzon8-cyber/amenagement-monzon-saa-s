-- Add service_requests table for client self-service
create table if not exists public.service_requests (
  id                  uuid primary key default gen_random_uuid(),
  client_id           uuid not null references public.clients(id) on delete cascade,
  service_type        text not null check (service_type in ('construction','hardscape','maintenance')),
  description         text not null,
  preferred_date      date not null,
  budget_estimate     numeric(10, 2),
  status              text not null default 'pending' check (status in ('pending','approved','rejected','in_progress','completed')),
  created_project_id  uuid references public.projects(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_service_requests_client_id on public.service_requests(client_id);
create index idx_service_requests_status on public.service_requests(status);
create index idx_service_requests_preferred_date on public.service_requests(preferred_date);

-- Enable RLS
alter table public.service_requests enable row level security;

-- RLS Policies
create policy "service_requests_select_own" on public.service_requests for select
  using (
    client_id = (select client_id from public.clients where profile_id = auth.uid())
    or auth.uid() in (select id from public.profiles where role = 'admin')
  );

create policy "service_requests_insert" on public.service_requests for insert
  with check (
    client_id = (select client_id from public.clients where profile_id = auth.uid())
  );

create policy "service_requests_update_admin" on public.service_requests for update
  using (auth.uid() in (select id from public.profiles where role = 'admin'));
