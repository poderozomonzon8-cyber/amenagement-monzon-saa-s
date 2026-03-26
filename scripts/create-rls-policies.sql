-- =============================================
-- SECURITY: Row Level Security (RLS) Policies
-- =============================================

-- Profiles: Users can only see public info
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Employees: Can see own record, admins see all
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employees_self_read" ON employees
  FOR SELECT USING (
    auth.uid() = profile_id OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "employees_admin_all" ON employees
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Clients: Can see own record, admins see all
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_self_read" ON clients
  FOR SELECT USING (
    auth.uid() = profile_id OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "clients_admin_all" ON clients
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Projects: Visible to assigned clients, assigned employees, admins
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_client_read" ON projects
  FOR SELECT USING (
    client_id = (SELECT id FROM clients WHERE profile_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'employee')
  );

CREATE POLICY "projects_admin_all" ON projects
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Invoices: Visible to assigned client, created by, admins
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_client_read" ON invoices
  FOR SELECT USING (
    client_id = (SELECT id FROM clients WHERE profile_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "invoices_admin_all" ON invoices
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Time Entries: Employee sees own, admin sees all
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "time_entries_self_read" ON time_entries
  FOR SELECT USING (
    employee_id = (SELECT id FROM employees WHERE profile_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "time_entries_employee_insert" ON time_entries
  FOR INSERT WITH CHECK (
    employee_id = (SELECT id FROM employees WHERE profile_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "time_entries_self_update" ON time_entries
  FOR UPDATE USING (
    employee_id = (SELECT id FROM employees WHERE profile_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Payments: Associated invoice client, admins
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_invoice_read" ON payments
  FOR SELECT USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE client_id = (SELECT id FROM clients WHERE profile_id = auth.uid())
    ) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "payments_admin_all" ON payments
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Audit Logs: Admins only
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_admin_read" ON audit_logs
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Notifications: User's own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_self_read" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_self_update" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Email Logs: Admins only
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_logs_admin_read" ON email_logs
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Invitations: Admin create/view, recipient can use token
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invitations_admin_crud" ON invitations
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "invitations_public_use" ON invitations
  FOR SELECT USING (true);
