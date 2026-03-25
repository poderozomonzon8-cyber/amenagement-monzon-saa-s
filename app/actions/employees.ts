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

export async function getOrCreateEmployee(profileId: string): Promise<Employee> {
  const existing = await getEmployeeByProfileId(profileId)
  if (existing) return existing
  
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
