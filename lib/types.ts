// Database types for Aménagement Monzon platform

export type UserRole = 'admin' | 'employee' | 'client' | 'pending'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  phone: string | null
  created_at: string
}

export interface Client {
  id: string
  profile_id: string | null
  address: string | null
  profile?: Profile
}

export interface Employee {
  id: string
  profile_id: string | null
  position: string | null
  salary: number | null
  profile?: Profile
}

export interface Project {
  id: string
  client_id: string | null
  name: string
  status: string
  start_date: string | null
  end_date: string | null
  budget: number | null
  created_at?: string
  client?: Client
}

export interface TimeEntry {
  id: string
  employee_id: string
  project_id: string | null
  hours: number
  description: string | null
  date: string
  project?: Project
}

export interface Expense {
  id: string
  project_id: string
  amount: number
  category: string | null
  note: string | null
  created_at: string
}

export interface InvoiceItem {
  id?: string
  invoice_id?: string
  description: string
  quantity: number
  unit_price: number
  total?: number
}

export interface Invoice {
  id: string
  invoice_number: string | null
  invoice_type: 'estimate' | 'invoice' | 'credit_note'
  project_id: string | null
  client_id: string | null
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  status: string
  due_date: string | null
  paid_date: string | null
  notes: string | null
  created_at: string
  items?: InvoiceItem[]
  client?: Client
  project?: Project
}

export interface Payment {
  id: string
  invoice_id: string
  amount: number
  method: string
  status: string
  created_at: string
  invoice?: Invoice
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export interface CompanySettings {
  id: string
  company_name: string
  address: string | null
  phone: string | null
  email: string | null
  tax_number_1: string | null
  tax_number_2: string | null
  logo_url: string | null
  primary_color: string
  secondary_color: string
}
