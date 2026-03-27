-- Add quote_templates table for saving reusable quote templates
create table if not exists public.quote_templates (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  service_type text not null,
  description text,
  items_config jsonb,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.quote_templates enable row level security;

-- RLS Policy: staff can read/write
create policy "quote_templates_select" on public.quote_templates for select using (true);
create policy "quote_templates_insert" on public.quote_templates for insert with check (true);
create policy "quote_templates_update" on public.quote_templates for update using (true);
create policy "quote_templates_delete" on public.quote_templates for delete using (true);
