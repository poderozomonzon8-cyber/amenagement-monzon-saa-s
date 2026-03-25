'use server'

import { createClient } from '@/lib/supabase/server'
import { Employee } from '@/lib/types'

// Get all employees with their profiles
export async function getEmployees() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      profiles (
        full_name,
        phone,
        role
      )
    `)
    .order('position')

  if (error) throw new Error(error.message)
  return data || []
}

// Get employee by profile ID using limit instead of single
export async function getEmployeeByProfileId(profileId: string): Promise<Employee | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('profile_id', profileId)
    .limit(1)

  if (error) return null
  return (data?.[0] || null) as Employee | null
}

// Ensure profile exists before creating employee
export async function ensureProfileExists(profileId: string, email?: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', profileId)
    .limit(1)
  
  if (existing?.length) return true
  
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: profileId,
      role: 'employee',
      full_name: email?.split('@')[0] || 'Utilisateur',
    })
  
  return !error
}

// Create employee with duplicate check
export async function createEmployee(data: {
  profile_id: string
  position?: string
  salary?: number
}): Promise<Employee> {
  const supabase = await createClient()

  // Check for existing employee to avoid duplicate FK error
  const { data: existing } = await supabase
    .from('employees')
    .select('*')
    .eq('profile_id', data.profile_id)
    .limit(1)

  if (existing?.length) {
    return (existing[0] || {}) as Employee
  }

  const { data: employee, error } = await supabase
    .from('employees')
    .insert(data)
    .select()
    .limit(1)

  if (error) throw new Error(error.message)
  return (employee?.[0] || {}) as Employee
}

// Get or create employee with proper flow
export async function getOrCreateEmployee(profileId: string, email?: string): Promise<Employee> {
  // First check if employee already exists
  const existing = await getEmployeeByProfileId(profileId)
  if (existing) return existing
  
  // Ensure profile exists
  const profileExists = await ensureProfileExists(profileId, email)
  if (!profileExists) {
    throw new Error('Profile could not be created or does not exist')
  }
  
  // Create employee record
  return await createEmployee({ profile_id: profileId })
}

// Delete employee
export async function deleteEmployee(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}
