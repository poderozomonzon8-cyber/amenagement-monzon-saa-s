'use server'

import { createClient } from '@/lib/supabase/server'
import { Employee } from '@/lib/types'

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

export async function ensureProfileExists(profileId: string, email?: string): Promise<boolean> {
  const supabase = await createClient()
  
  // Check if profile exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', profileId)
    .limit(1)
  
  if (existing?.length) return true
  
  // Create profile if it doesn't exist
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: profileId,
      role: 'employee',
      full_name: email?.split('@')[0] || 'Utilisateur',
    })
  
  return !error
}

export async function createEmployee(data: {
  profile_id: string
  position?: string
  salary?: number
}): Promise<Employee> {
  const supabase = await createClient()

  // Check if employee already exists to avoid duplicate FK violation
  const { data: existing } = await supabase
    .from('employees')
    .select('id')
    .eq('profile_id', data.profile_id)
    .limit(1)

  if (existing?.length) {
    return getEmployeeByProfileId(data.profile_id) as any
  }

  const { data: employee, error } = await supabase
    .from('employees')
    .insert(data)
    .select()
    .limit(1)

  if (error) throw new Error(error.message)
  return (employee?.[0] || {}) as Employee
}

export async function getOrCreateEmployee(profileId: string, email?: string): Promise<Employee> {
  // First check if employee already exists
  const existing = await getEmployeeByProfileId(profileId)
  if (existing) return existing
  
  // If not, ensure profile exists
  const profileExists = await ensureProfileExists(profileId, email)
  if (!profileExists) {
    throw new Error('Profile could not be created or does not exist')
  }
  
  // Now create employee record
  return await createEmployee({ profile_id: profileId })
}

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

export async function deleteEmployee(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}
