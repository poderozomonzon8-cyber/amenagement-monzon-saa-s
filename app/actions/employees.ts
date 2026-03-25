'use server'

import { createClient } from '@/lib/supabase/server'
import { Employee } from '@/lib/types'

export async function getEmployeeByProfileId(profileId: string): Promise<Employee | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('profile_id', profileId)
    .single()

  if (error) return null
  return data as Employee
}

export async function ensureProfileExists(profileId: string, email?: string): Promise<boolean> {
  const supabase = await createClient()
  
  // Check if profile exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', profileId)
    .single()
  
  if (existing) return true
  
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

  const { data: employee, error } = await supabase
    .from('employees')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return employee as Employee
}

export async function getOrCreateEmployee(profileId: string, email?: string): Promise<Employee> {
  console.log('[v0] getOrCreateEmployee called with profileId:', profileId)
  
  // First check if employee already exists
  const existing = await getEmployeeByProfileId(profileId)
  console.log('[v0] Existing employee check:', existing ? 'found' : 'not found')
  
  if (existing) return existing
  
  // If not, ensure profile exists
  const profileExists = await ensureProfileExists(profileId, email)
  console.log('[v0] Profile exists or created:', profileExists)
  
  if (!profileExists) {
    throw new Error('Profile could not be created or does not exist')
  }
  
  // Now create employee record
  console.log('[v0] Creating employee for profile:', profileId)
  return await createEmployee({ profile_id: profileId })
}

export async function getEmployees(): Promise<Employee[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('employees')
    .select('*')

  if (error) throw new Error(error.message)
  return (data || []) as Employee[]
}
