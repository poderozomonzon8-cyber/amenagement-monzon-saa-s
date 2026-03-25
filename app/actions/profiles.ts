'use server'

import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'

// Get all profiles (users)
export async function getProfiles(): Promise<Profile[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return (data || []) as Profile[]
}

// Get profile by ID
export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data as Profile
}

// Update profile role
export async function updateProfileRole(id: string, role: 'admin' | 'employee' | 'client'): Promise<Profile> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  return data as Profile
}

// Update profile
export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  return data as Profile
}

// Delete profile (careful - cascades to employee/client)
export async function deleteProfile(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
  
  if (error) throw new Error(error.message)
}
