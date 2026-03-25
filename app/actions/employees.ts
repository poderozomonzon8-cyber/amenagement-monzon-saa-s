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
  // First ensure profile exists
  await ensureProfileExists(profileId, email)
  
  // Then check for existing employee
  const existing = await getEmployeeByProfileId(profileId)
  if (existing) return existing
  
  // Create employee record
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
