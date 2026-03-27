-- Aménagement Monzon SaaS Platform - Complete Database Schema
-- Features: Quotes, Client Portal, Employee Performance, Financial Intelligence, Automation, Self-Service, Booking, Documents, Multi-Tenant

-- ================ MULTI-TENANT INFRASTRUCTURE ================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  website TEXT,
  industry TEXT,
  founded_year INT,
  timezone TEXT DEFAULT 'America/Toronto',
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'pro', 'enterprise')) DEFAULT 'free',
  branding_primary_color TEXT DEFAULT '#C9A84C',
  branding_secondary_color TEXT DEFAULT '#1A1A1A',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(auth_user_id)
);

-- ================ ADVANCED SECURITY & ROLES ================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- ================ ENHANCED CLIENTS ================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id),
  address TEXT,
  city TEXT,
  postal_code TEXT,
  phone_secondary TEXT,
  business_type TEXT,
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'sms')),
  communication_preference TEXT,
  loyalty_score INT DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ================ SMART QUOTATION SYSTEM ================
CREATE TABLE IF NOT EXISTS quote_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  items JSONB DEFAULT '[]',
  markup_percentage DECIMAL(5,2) DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  quote_number TEXT UNIQUE,
  service_type TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(12,2),
  tax_amount DECIMAL(12,2),
  total DECIMAL(12,2),
  labor_hours DECIMAL(10,2),
  labor_rate DECIMAL(10,2),
  materials_cost DECIMAL(12,2),
  status TEXT CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')) DEFAULT 'draft',
  valid_until DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMP,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quote_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  action TEXT,
  changed_by UUID REFERENCES auth.users(id),
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================ ENHANCED PROJECTS ================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  quote_id UUID REFERENCES quotes(id),
  name TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  status TEXT CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold', 'cancelled')) DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  actual_end_date DATE,
  budget DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  progress_percentage INT DEFAULT 0,
  address TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  assigned_employee_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed_at TIMESTAMP,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================ EMPLOYEE PERFORMANCE SYSTEM ================
CREATE TABLE IF NOT EXISTS employee_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  department TEXT,
  hire_date DATE,
  hourly_rate DECIMAL(10,2),
  performance_score DECIMAL(5,2) DEFAULT 5,
  total_projects_completed INT DEFAULT 0,
  total_hours_worked DECIMAL(10,2) DEFAULT 0,
  efficiency_rating DECIMAL(5,2),
  specializations TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  manager_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employee_profiles(id),
  reviewer_id UUID REFERENCES auth.users(id),
  rating DECIMAL(5,2),
  comments TEXT,
  review_date TIMESTAMP DEFAULT NOW(),
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================ FINANCIAL INTELLIGENCE ================
CREATE TABLE IF NOT EXISTS project_financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  revenue DECIMAL(12,2),
  labor_cost DECIMAL(12,2),
  material_cost DECIMAL(12,2),
  equipment_cost DECIMAL(12,2),
  subcontractor_cost DECIMAL(12,2),
  total_expenses DECIMAL(12,2),
  profit DECIMAL(12,2) GENERATED ALWAYS AS (revenue - total_expenses) STORED,
  profit_margin DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN revenue > 0 THEN (profit / revenue * 100) ELSE 0 END
  ) STORED,
  labor_hours DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  category_id UUID REFERENCES expense_categories(id),
  amount DECIMAL(12,2),
  description TEXT,
  receipt_url TEXT,
  expense_date DATE,
  submitted_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  report_date DATE,
  report_type TEXT CHECK (report_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual')),
  total_revenue DECIMAL(12,2),
  total_expenses DECIMAL(12,2),
  net_profit DECIMAL(12,2),
  active_projects INT,
  completed_projects INT,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================ AUTOMATION ENGINE ================
CREATE TABLE IF NOT EXISTS automation_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger TEXT NOT NULL,
  actions JSONB NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
  status TEXT,
  triggered_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  result JSONB,
  error TEXT
);

-- ================ CLIENT SELF-SERVICE ================
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  service_type TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('requested', 'quote_sent', 'approved', 'in_progress', 'completed')) DEFAULT 'requested',
  quote_id UUID REFERENCES quotes(id),
  project_id UUID REFERENCES projects(id),
  requested_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  client_notes TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================ BOOKING & CALENDAR SYSTEM ================
CREATE TABLE IF NOT EXISTS available_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES auth.users(id),
  service_type TEXT,
  slot_start TIMESTAMP,
  slot_end TIMESTAMP,
  capacity INT DEFAULT 1,
  booked_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  slot_id UUID REFERENCES available_slots(id),
  service_type TEXT NOT NULL,
  booking_date DATE,
  start_time TIME,
  end_time TIME,
  location TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('confirmed', 'pending', 'completed', 'cancelled')) DEFAULT 'confirmed',
  created_project BOOLEAN DEFAULT FALSE,
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  booking_id UUID REFERENCES bookings(id),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  event_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================ DOCUMENT & CONTRACT SYSTEM ================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  document_type TEXT NOT NULL,
  file_name TEXT,
  file_url TEXT,
  file_size INT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS digital_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id),
  signer_name TEXT,
  signer_email TEXT,
  signed_at TIMESTAMP,
  signature_data TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================ NOTIFICATIONS & MESSAGING ================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  notification_type TEXT,
  related_entity_id UUID,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  sender_id UUID REFERENCES auth.users(id),
  recipient_id UUID REFERENCES auth.users(id),
  message TEXT,
  attachments JSONB,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================ TIME TRACKING ENHANCED ================
ALTER TABLE IF EXISTS time_entries ADD COLUMN IF NOT EXISTS
  verified_by UUID REFERENCES auth.users(id);
ALTER TABLE IF EXISTS time_entries ADD COLUMN IF NOT EXISTS
  verified_at TIMESTAMP;
ALTER TABLE IF EXISTS time_entries ADD COLUMN IF NOT EXISTS
  billable BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS time_entries ADD COLUMN IF NOT EXISTS
  notes TEXT;

-- ================ PAYMENT METHODS & ENHANCED INVOICES ================
ALTER TABLE IF EXISTS invoices ADD COLUMN IF NOT EXISTS
  company_id UUID REFERENCES companies(id);
ALTER TABLE IF EXISTS invoices ADD COLUMN IF NOT EXISTS
  invoice_terms TEXT;
ALTER TABLE IF EXISTS invoices ADD COLUMN IF NOT EXISTS
  payment_due_date DATE;
ALTER TABLE IF EXISTS invoices ADD COLUMN IF NOT EXISTS
  payment_method TEXT;
ALTER TABLE IF EXISTS invoices ADD COLUMN IF NOT EXISTS
  tax_rate DECIMAL(5,2) DEFAULT 0;
ALTER TABLE IF EXISTS invoices ADD COLUMN IF NOT EXISTS
  discount_amount DECIMAL(12,2) DEFAULT 0;

-- ================ INDEXES FOR PERFORMANCE ================
CREATE INDEX IF NOT EXISTS idx_quotes_company_status ON quotes(company_id, status);
CREATE INDEX IF NOT EXISTS idx_quotes_client_created ON quotes(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_company_status ON projects(company_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_employee ON projects(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_bookings_company_date ON bookings(company_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_expenses_company_date ON expenses(company_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_time_entries_employee_date ON time_entries(employee_id, work_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_chat_project ON chat_messages(project_id, created_at DESC);

-- ================ RLS POLICIES ================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Users can only access data from their company
CREATE POLICY "Users can view their company" ON companies
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can view clients in their company" ON clients
  FOR SELECT USING (company_id IN (
    SELECT id FROM companies WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can view projects in their company" ON projects
  FOR SELECT USING (company_id IN (
    SELECT id FROM companies WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can view quotes in their company" ON quotes
  FOR SELECT USING (company_id IN (
    SELECT id FROM companies WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Clients can view their own bookings" ON bookings
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid())
    OR company_id IN (SELECT id FROM companies WHERE auth_user_id = auth.uid())
  );
