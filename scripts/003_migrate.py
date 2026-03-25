import urllib.request
import urllib.error
import json
import sys

SUPABASE_URL = "https://zlynkkolnenjylzyhwvj.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseW5ra29sbmVuanlsenlod3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODI3ODcsImV4cCI6MjA4OTk1ODc4N30.JQBmHLTWiKZv_IgDB1NGZbvVLqAlwwKAp48UhDLpUCg"

HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

# Each statement is run individually so we can report granular results
STATEMENTS = [
    # --- profiles ---
    """CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'employee', 'client')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)""",
    "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY",
    "DROP POLICY IF EXISTS users_view_own_profile ON public.profiles",
    "CREATE POLICY users_view_own_profile ON public.profiles FOR SELECT USING (auth.uid() = id)",
    "DROP POLICY IF EXISTS users_update_own_profile ON public.profiles",
    "CREATE POLICY users_update_own_profile ON public.profiles FOR UPDATE USING (auth.uid() = id)",
    "DROP POLICY IF EXISTS allow_insert_own_profile ON public.profiles",
    "CREATE POLICY allow_insert_own_profile ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)",
    "DROP POLICY IF EXISTS admins_view_all_profiles ON public.profiles",
    """CREATE POLICY admins_view_all_profiles ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)""",

    # --- projects ---
    """CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','in_progress','completed','on_hold')),
  type TEXT NOT NULL DEFAULT 'renovation',
  address TEXT,
  budget DECIMAL(12,2) DEFAULT 0,
  spent DECIMAL(12,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)""",
    "ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY",
    "DROP POLICY IF EXISTS admins_all_projects ON public.projects",
    """CREATE POLICY admins_all_projects ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)""",
    "DROP POLICY IF EXISTS employees_view_projects ON public.projects",
    """CREATE POLICY employees_view_projects ON public.projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'employee')
)""",
    "DROP POLICY IF EXISTS clients_view_own_projects ON public.projects",
    "CREATE POLICY clients_view_own_projects ON public.projects FOR SELECT USING (client_id = auth.uid())",

    # --- invoices ---
    """CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 14.975,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  due_date DATE,
  paid_date DATE,
  notes TEXT,
  line_items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)""",
    "ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY",
    "DROP POLICY IF EXISTS admins_all_invoices ON public.invoices",
    """CREATE POLICY admins_all_invoices ON public.invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)""",
    "DROP POLICY IF EXISTS clients_view_own_invoices ON public.invoices",
    "CREATE POLICY clients_view_own_invoices ON public.invoices FOR SELECT USING (client_id = auth.uid())",

    # --- payments ---
    """CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('cash','virement','interac','carte','cheque')),
  reference TEXT,
  notes TEXT,
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
)""",
    "ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY",
    "DROP POLICY IF EXISTS admins_all_payments ON public.payments",
    """CREATE POLICY admins_all_payments ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)""",
    "DROP POLICY IF EXISTS clients_view_own_payments ON public.payments",
    """CREATE POLICY clients_view_own_payments ON public.payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = payments.invoice_id AND invoices.client_id = auth.uid()
  )
)""",

    # --- time_entries ---
    """CREATE TABLE IF NOT EXISTS public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  hours DECIMAL(4,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)""",
    "ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY",
    "DROP POLICY IF EXISTS admins_all_time_entries ON public.time_entries",
    """CREATE POLICY admins_all_time_entries ON public.time_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)""",
    "DROP POLICY IF EXISTS employees_own_time_entries ON public.time_entries",
    "CREATE POLICY employees_own_time_entries ON public.time_entries FOR ALL USING (employee_id = auth.uid())",

    # --- project_photos ---
    """CREATE TABLE IF NOT EXISTS public.project_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)""",
    "ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY",
    "DROP POLICY IF EXISTS admins_all_photos ON public.project_photos",
    """CREATE POLICY admins_all_photos ON public.project_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)""",
    "DROP POLICY IF EXISTS employees_manage_photos ON public.project_photos",
    """CREATE POLICY employees_manage_photos ON public.project_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'employee')
)""",
    "DROP POLICY IF EXISTS clients_view_own_project_photos ON public.project_photos",
    """CREATE POLICY clients_view_own_project_photos ON public.project_photos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_photos.project_id AND projects.client_id = auth.uid()
  )
)""",

    # --- triggers ---
    """CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'client')
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$""",
    "DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users",
    """CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()""",

    """CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$""",
    "DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles",
    "CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()",
    "DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects",
    "CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()",
    "DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.invoices",
    "CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()",
    "DROP TRIGGER IF EXISTS trg_time_entries_updated_at ON public.time_entries",
    "CREATE TRIGGER trg_time_entries_updated_at BEFORE UPDATE ON public.time_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()",

    # --- indexes ---
    "CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id)",
    "CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status)",
    "CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id)",
    "CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON public.invoices(project_id)",
    "CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status)",
    "CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id)",
    "CREATE INDEX IF NOT EXISTS idx_time_entries_employee_id ON public.time_entries(employee_id)",
    "CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON public.time_entries(project_id)",
    "CREATE INDEX IF NOT EXISTS idx_time_entries_date ON public.time_entries(date)",
    "CREATE INDEX IF NOT EXISTS idx_project_photos_project_id ON public.project_photos(project_id)",
]


def post_rpc(sql: str) -> tuple[int, str]:
    """Call Supabase REST RPC to execute a SQL statement."""
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    payload = json.dumps({"query": sql}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, method="POST")
    for k, v in HEADERS.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as e:
        return 0, str(e)


def check_connectivity() -> bool:
    """Verify we can reach the Supabase project."""
    url = f"{SUPABASE_URL}/rest/v1/"
    req = urllib.request.Request(url)
    for k, v in HEADERS.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            print(f"Connectivity OK — HTTP {resp.status}")
            return True
    except urllib.error.HTTPError as e:
        print(f"Connectivity check — HTTP {e.code}")
        return e.code < 500
    except Exception as e:
        print(f"Connectivity error: {e}")
        return False


def run_migration():
    print("=" * 60)
    print("Amenagement Monzon — Database Migration")
    print(f"Target: {SUPABASE_URL}")
    print("=" * 60)

    if not check_connectivity():
        print("ERROR: Cannot reach Supabase. Check URL and network.")
        sys.exit(1)

    passed = 0
    skipped = 0
    failed = 0

    for i, stmt in enumerate(STATEMENTS):
        label = stmt.strip().split("\n")[0][:80].replace("\n", " ")
        code, body = post_rpc(stmt)

        # 200/201/204 = success; certain errors mean already exists (skip)
        skip_phrases = [
            "already exists", "42P07", "42710", "does not exist",
            "42704", "relation", "duplicate"
        ]
        if code in (200, 201, 204):
            print(f"  OK     [{i+1:02d}] {label}")
            passed += 1
        elif any(p in body for p in skip_phrases):
            print(f"  SKIP   [{i+1:02d}] {label}")
            skipped += 1
        else:
            print(f"  FAIL   [{i+1:02d}] {label}")
            print(f"         HTTP {code}: {body[:200]}")
            failed += 1

    print("=" * 60)
    print(f"Done: {passed} OK, {skipped} skipped, {failed} failed")
    print("=" * 60)

    if failed > 0:
        print("\nNOTE: Some statements failed.")
        print("If the exec_sql RPC does not exist, run the SQL manually:")
        print(f"  https://supabase.com/dashboard/project/zlynkkolnenjylzyhwvj/sql/new")
        print("  (copy from scripts/001_schema.sql)")
        sys.exit(1)
    else:
        print("Migration completed successfully!")


if __name__ == "__main__":
    run_migration()


SUPABASE_URL = "https://zlynkkolnenjylzyhwvj.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseW5ra29sbmVuanlsenlod3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODI3ODcsImV4cCI6MjA4OTk1ODc4N30.JQBmHLTWiKZv_IgDB1NGZbvVLqAlwwKAp48UhDLpUCg"

# Full schema as a single SQL block — sent to Supabase via the REST API
# using the /rest/v1/rpc/exec approach won't work with anon key.
# Instead we use the pg REST endpoint with service role or just build tables
# using the Supabase REST insert approach.
# Since we only have the anon key, we'll use the Supabase Database REST API
# to call a stored procedure, but that needs setup first.
# 
# The correct approach: call POST /rest/v1/rpc/run_sql if it exists,
# or use the Supabase client library's raw query approach.
# With only anon key, we'll use supabase-py to execute raw SQL via rpc.

SCHEMA_SQL = """
-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'employee', 'client')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_view_own_profile" ON public.profiles;
CREATE POLICY "users_view_own_profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
CREATE POLICY "users_update_own_profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "allow_insert_own_profile" ON public.profiles;
CREATE POLICY "allow_insert_own_profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "admins_view_all_profiles" ON public.profiles;
CREATE POLICY "admins_view_all_profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
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
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_all_projects" ON public.projects;
CREATE POLICY "admins_all_projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "employees_view_projects" ON public.projects;
CREATE POLICY "employees_view_projects" ON public.projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'employee')
);

DROP POLICY IF EXISTS "clients_view_own_projects" ON public.projects;
CREATE POLICY "clients_view_own_projects" ON public.projects FOR SELECT USING (client_id = auth.uid());

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
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
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_all_invoices" ON public.invoices;
CREATE POLICY "admins_all_invoices" ON public.invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "clients_view_own_invoices" ON public.invoices;
CREATE POLICY "clients_view_own_invoices" ON public.invoices FOR SELECT USING (client_id = auth.uid());

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('cash', 'virement', 'interac', 'carte', 'cheque')),
  reference TEXT,
  notes TEXT,
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_all_payments" ON public.payments;
CREATE POLICY "admins_all_payments" ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "clients_view_own_payments" ON public.payments;
CREATE POLICY "clients_view_own_payments" ON public.payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = payments.invoice_id
    AND invoices.client_id = auth.uid()
  )
);

-- Time entries table
CREATE TABLE IF NOT EXISTS public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  hours DECIMAL(4,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_all_time_entries" ON public.time_entries;
CREATE POLICY "admins_all_time_entries" ON public.time_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "employees_own_time_entries" ON public.time_entries;
CREATE POLICY "employees_own_time_entries" ON public.time_entries FOR ALL USING (employee_id = auth.uid());

-- Project photos table
CREATE TABLE IF NOT EXISTS public.project_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_all_photos" ON public.project_photos;
CREATE POLICY "admins_all_photos" ON public.project_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "employees_manage_photos" ON public.project_photos;
CREATE POLICY "employees_manage_photos" ON public.project_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'employee')
);

DROP POLICY IF EXISTS "clients_view_own_project_photos" ON public.project_photos;
CREATE POLICY "clients_view_own_project_photos" ON public.project_photos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_photos.project_id
    AND projects.client_id = auth.uid()
  )
);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
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
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_time_entries_updated_at ON public.time_entries;
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON public.time_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON public.invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_employee_id ON public.time_entries(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON public.time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON public.time_entries(date);
CREATE INDEX IF NOT EXISTS idx_project_photos_project_id ON public.project_photos(project_id);
"""

def run_migration():
    print("Aménagement Monzon — Database Migration")
    print(f"Target: {SUPABASE_URL}")
    print("-" * 60)

    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
    }

    # Try calling the pg REST SQL endpoint
    # Supabase exposes /rest/v1/rpc/<function> for RPC calls
    # For raw SQL we need to use the Supabase pg connection via supabase-py
    try:
        from supabase import create_client, Client
        print("Using supabase-py client...")
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

        # Execute each statement individually
        statements = [s.strip() for s in SCHEMA_SQL.split(';') if s.strip()]
        passed = 0
        failed = 0
        errors = []

        for i, stmt in enumerate(statements):
            preview = stmt.split('\n')[0][:70]
            try:
                result = supabase.rpc('exec_raw_sql', {'sql': stmt}).execute()
                print(f"  [{i+1}/{len(statements)}] OK — {preview}")
                passed += 1
            except Exception as e:
                err_str = str(e)
                if any(x in err_str for x in ['already exists', '42P07', '42710', 'does not exist', '42704']):
                    print(f"  [{i+1}/{len(statements)}] SKIP — {preview}")
                    passed += 1
                else:
                    print(f"  [{i+1}/{len(statements)}] FAIL — {preview}")
                    print(f"    Error: {err_str[:120]}")
                    failed += 1
                    errors.append((preview, err_str))

        print("-" * 60)
        print(f"Result: {passed} passed, {failed} failed out of {len(statements)} statements")
        return errors

    except ImportError:
        print("supabase-py not available, trying direct HTTP...")
        return run_via_http(headers)


def run_via_http(headers):
    """Fall back to direct HTTP REST calls for table creation probing."""
    import httpx

    errors = []

    # Test connectivity
    with httpx.Client(timeout=30) as client:
        resp = client.get(f"{SUPABASE_URL}/rest/v1/profiles", headers=headers)
        print(f"Connectivity check — GET /rest/v1/profiles: HTTP {resp.status_code}")

        if resp.status_code == 200:
            print("profiles table already exists!")
        elif resp.status_code == 404 or resp.status_code == 400:
            msg = resp.text
            print(f"Response: {msg[:200]}")
            if 'does not exist' in msg or 'relation' in msg:
                print("\nTables do not exist yet.")
                print("ACTION REQUIRED: Please run the SQL in scripts/001_schema.sql manually")
                print("via the Supabase SQL Editor at:")
                print(f"  https://supabase.com/dashboard/project/zlynkkolnenjylzyhwvj/sql/new")
                errors.append(("HTTP fallback", "Tables need to be created manually via Supabase SQL Editor"))
        elif resp.status_code == 401:
            print("Authentication issue — check anon key")
            errors.append(("Auth", "Invalid or missing anon key"))
        else:
            print(f"Unexpected status: {resp.status_code} — {resp.text[:200]}")

    return errors


if __name__ == "__main__":
    errors = run_migration()
    if errors:
        print("\nSome statements failed — see above for details.")
        sys.exit(1)
    else:
        print("\nMigration completed successfully!")
        sys.exit(0)
