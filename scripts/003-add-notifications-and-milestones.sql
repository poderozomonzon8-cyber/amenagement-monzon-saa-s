-- Add notifications table for real-time alerts
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null check (type in ('invoice','quote','payment','project_update','milestone','reminder')),
  title      text not null,
  message    text,
  related_id uuid,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_read on public.notifications(read);

-- Add milestones table for project tracking
create table if not exists public.milestones (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  name        text not null,
  description text,
  date        date not null,
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

create index idx_milestones_project_id on public.milestones(project_id);
create index idx_milestones_date on public.milestones(date);

-- Enable RLS
alter table public.notifications enable row level security;
alter table public.milestones enable row level security;

-- RLS Policies for notifications
create policy "notifications_select_own" on public.notifications for select
  using (user_id = auth.uid() or auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "notifications_insert_admin" on public.notifications for insert
  with check (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "notifications_delete_own" on public.notifications for delete
  using (user_id = auth.uid() or auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "notifications_update_own" on public.notifications for update
  using (user_id = auth.uid() or auth.uid() in (select id from public.profiles where role = 'admin'));

-- RLS Policies for milestones
create policy "milestones_select" on public.milestones for select
  using (true);

create policy "milestones_insert" on public.milestones for insert
  with check (auth.uid() in (select id from public.profiles where role in ('admin','employee')));

create policy "milestones_update" on public.milestones for update
  using (auth.uid() in (select id from public.profiles where role in ('admin','employee')));

create policy "milestones_delete" on public.milestones for delete
  using (auth.uid() in (select id from public.profiles where role = 'admin'));
