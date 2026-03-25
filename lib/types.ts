// Database types for Aménagement Monzon platform

export type UserRole = 'admin' | 'employee' | 'client'

export interface Profile {
  id: string
  first_name: string
  last_name: string
  role: UserRole
  company: string
  email: string
  phone: string | null
  created_at: string
}

export interface Project {
  id: string
  admin_id: string
  name: string
  description: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  client_id: string
  start_date: string
  end_date: string
  budget: number
  spent: number
  created_at: string
}

export interface Invoice {
  id: string
  admin_id: string
  project_id: string
  client_id: string
  invoice_number: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  due_date: string
  description: string
  created_at: string
}

export interface Payment {
  id: string
  admin_id: string
  invoice_id: string
  amount: number
  method: 'cash' | 'virement' | 'interac' | 'card'
  status: 'pending' | 'completed' | 'failed'
  date: string
  created_at: string
}

export interface TimeEntry {
  id: string
  admin_id: string
  project_id: string
  employee_id: string
  hours: number
  date: string
  description: string
  created_at: string
}

export interface ProjectPhoto {
  id: string
  project_id: string
  url: string
  created_at: string
}
