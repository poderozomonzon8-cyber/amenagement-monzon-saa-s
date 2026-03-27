-- Add automation_rules table for workflow automation
create table if not exists public.automation_rules (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  trigger    text not null check (trigger in ('invoice_created','invoice_paid','quote_converted','project_deadline','payment_reminder')),
  action     text not null check (action in ('send_notification','send_email','update_status','create_follow_up')),
  action_data jsonb,
  enabled    boolean not null default true,
  delay_days integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_automation_rules_enabled on public.automation_rules(enabled);
create index idx_automation_rules_trigger on public.automation_rules(trigger);

-- Enable RLS
alter table public.automation_rules enable row level security;

-- RLS Policies: admins only
create policy "automation_rules_select" on public.automation_rules for select
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "automation_rules_insert" on public.automation_rules for insert
  with check (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "automation_rules_update" on public.automation_rules for update
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "automation_rules_delete" on public.automation_rules for delete
  using (auth.uid() in (select id from public.profiles where role = 'admin'));
