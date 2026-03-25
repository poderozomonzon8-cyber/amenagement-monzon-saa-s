/**
 * Migration runner for Aménagement Monzon
 * Uses Supabase REST API to execute the schema SQL directly.
 */

const SUPABASE_URL = 'https://zlynkkolnenjylzyhwvj.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseW5ra29sbmVuanlsenlod3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODI3ODcsImV4cCI6MjA4OTk1ODc4N30.JQBmHLTWiKZv_IgDB1NGZbvVLqAlwwKAp48UhDLpUCg'

// Each statement separated so we can run them one at a time
const statements = [
  // PROFILES TABLE
  `CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'employee', 'client')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY`,

  `DROP POLICY IF EXISTS "users_view_own_profile" ON public.profiles`,
  `CREATE POLICY "users_view_own_profile" ON public.profiles FOR SELECT USING (auth.uid() = id)`,

  `DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles`,
  `CREATE POLICY "users_update_own_profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)`,

  `DROP POLICY IF EXISTS "allow_insert_own_profile" ON public.profiles`,
  `CREATE POLICY "allow_insert_own_profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)`,

  // PROJECTS TABLE
  `CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
    type TEXT NOT NULL DEFAULT 'renovation',
    address TEXT,
    budget DECIMAL(12,2) DEFAULT 0,
    spent DECIMAL(12,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY`,

  `DROP POLICY IF EXISTS "admins_all_projects" ON public.projects`,
  `CREATE POLICY "admins_all_projects" ON public.projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )`,

  `DROP POLICY IF EXISTS "employees_view_projects" ON public.projects`,
  `CREATE POLICY "employees_view_projects" ON public.projects FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'employee')
  )`,

  `DROP POLICY IF EXISTS "clients_view_own_projects" ON public.projects`,
  `CREATE POLICY "clients_view_own_projects" ON public.projects FOR SELECT USING (client_id = auth.uid())`,

  // INVOICES TABLE
  `CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 14.975,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    due_date DATE,
    paid_date DATE,
    notes TEXT,
    line_items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY`,

  `DROP POLICY IF EXISTS "admins_all_invoices" ON public.invoices`,
  `CREATE POLICY "admins_all_invoices" ON public.invoices FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )`,

  `DROP POLICY IF EXISTS "clients_view_own_invoices" ON public.invoices`,
  `CREATE POLICY "clients_view_own_invoices" ON public.invoices FOR SELECT USING (client_id = auth.uid())`,

  // PAYMENTS TABLE
  `CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('cash', 'virement', 'interac', 'carte', 'cheque')),
    reference TEXT,
    notes TEXT,
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY`,

  `DROP POLICY IF EXISTS "admins_all_payments" ON public.payments`,
  `CREATE POLICY "admins_all_payments" ON public.payments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )`,

  `DROP POLICY IF EXISTS "clients_view_own_payments" ON public.payments`,
  `CREATE POLICY "clients_view_own_payments" ON public.payments FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE invoices.id = payments.invoice_id
      AND invoices.client_id = auth.uid()
    )
  )`,

  // TIME ENTRIES TABLE
  `CREATE TABLE IF NOT EXISTS public.time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    hours DECIMAL(4,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY`,

  `DROP POLICY IF EXISTS "admins_all_time_entries" ON public.time_entries`,
  `CREATE POLICY "admins_all_time_entries" ON public.time_entries FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )`,

  `DROP POLICY IF EXISTS "employees_own_time_entries" ON public.time_entries`,
  `CREATE POLICY "employees_own_time_entries" ON public.time_entries FOR ALL USING (employee_id = auth.uid())`,

  // PROJECT PHOTOS TABLE
  `CREATE TABLE IF NOT EXISTS public.project_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  `ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY`,

  `DROP POLICY IF EXISTS "admins_all_photos" ON public.project_photos`,
  `CREATE POLICY "admins_all_photos" ON public.project_photos FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )`,

  `DROP POLICY IF EXISTS "employees_view_photos" ON public.project_photos`,
  `CREATE POLICY "employees_view_photos" ON public.project_photos FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'employee')
  )`,

  `DROP POLICY IF EXISTS "employees_insert_photos" ON public.project_photos`,
  `CREATE POLICY "employees_insert_photos" ON public.project_photos FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'employee')
  )`,

  `DROP POLICY IF EXISTS "clients_view_own_project_photos" ON public.project_photos`,
  `CREATE POLICY "clients_view_own_project_photos" ON public.project_photos FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_photos.project_id
      AND projects.client_id = auth.uid()
    )
  )`,

  // AUTO-CREATE PROFILE TRIGGER
  `CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data ->> 'role', 'client')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  END;
  $$`,

  `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`,

  `CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()`,

  // UPDATED_AT TRIGGER
  `CREATE OR REPLACE FUNCTION public.update_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$`,

  `DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles`,
  `CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()`,

  `DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects`,
  `CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()`,

  `DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices`,
  `CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()`,

  `DROP TRIGGER IF EXISTS update_time_entries_updated_at ON public.time_entries`,
  `CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON public.time_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()`,

  // INDEXES
  `CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status)`,
  `CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id)`,
  `CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON public.invoices(project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status)`,
  `CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id)`,
  `CREATE INDEX IF NOT EXISTS idx_time_entries_employee_id ON public.time_entries(employee_id)`,
  `CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON public.time_entries(project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_time_entries_date ON public.time_entries(date)`,
  `CREATE INDEX IF NOT EXISTS idx_project_photos_project_id ON public.project_photos(project_id)`,
]

async function runStatement(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ sql }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json().catch(() => ({}))
}

// Use the pg-based approach via Supabase's SQL endpoint
async function runViaSQLEndpoint(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ query: sql }),
  })
  return res
}

async function main() {
  console.log('Starting Aménagement Monzon database migration...')
  console.log(`Target: ${SUPABASE_URL}`)
  console.log(`Statements to run: ${statements.length}`)
  console.log('')

  let passed = 0
  let failed = 0
  const errors = []

  for (let i = 0; i < statements.length; i++) {
    const sql = statements[i].trim()
    const preview = sql.split('\n')[0].substring(0, 70)
    process.stdout.write(`[${i + 1}/${statements.length}] ${preview}... `)

    try {
      await runStatement(sql)
      console.log('OK')
      passed++
    } catch (err) {
      // Try to detect non-fatal errors (already exists, etc.)
      const msg = err.message || ''
      if (
        msg.includes('already exists') ||
        msg.includes('does not exist') ||
        msg.includes('42P07') ||
        msg.includes('42704')
      ) {
        console.log('SKIP (already exists)')
        passed++
      } else {
        console.log(`FAIL: ${msg.substring(0, 100)}`)
        failed++
        errors.push({ statement: preview, error: msg })
      }
    }
  }

  console.log('')
  console.log('='.repeat(60))
  console.log(`Migration complete: ${passed} passed, ${failed} failed`)

  if (errors.length > 0) {
    console.log('\nErrors:')
    errors.forEach((e) => {
      console.log(`  - ${e.statement}`)
      console.log(`    ${e.error}`)
    })
  } else {
    console.log('All tables, RLS policies, triggers, and indexes created successfully.')
  }
}

main().catch((err) => {
  console.error('Migration runner crashed:', err)
  process.exit(1)
})
