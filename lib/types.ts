// Database types matching your existing Supabase schema

export type UserRole = 'admin' | 'employee' | 'client'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  phone: string | null
  created_at: string
}

export interface Client {
  id: string
  profile_id: string
  address: string | null
}

export interface Employee {
  id: string
  profile_id: string
  position: string | null
  salary: number | null
}

export interface Project {
  id: string
  client_id: string
  name: string
  status: string
  start_date: string | null
  end_date: string | null
  budget: number | null
}

export interface TimeEntry {
  id: string
  employee_id: string
  project_id: string
  hours: number
  description: string | null
  date: string
}

export interface Expense {
  id: string
  project_id: string
  amount: number
  category: string | null
  note: string | null
  created_at: string
}

export interface Invoice {
  id: string
  project_id: string
  client_id: string
  total: number
  status: string
  created_at: string
}

export interface Payment {
  id: string
  invoice_id: string
  amount: number
  method: string
  status: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}
