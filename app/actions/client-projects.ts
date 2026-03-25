'use server'

import { createClient } from '@/lib/supabase/server'
import { Project } from '@/lib/types'

// Get all clients for dropdown
export async function getAllClients() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      profile_id,
      address,
      profiles (
        full_name,
        email
      )
    `)
    .order('profiles.full_name')
  
  if (error) throw new Error(error.message)
  return data || []
}

// Assign client to project
export async function assignClientToProject(projectId: string, clientId: string) {
  const supabase = await createClient()
  
  // Check if this client is already assigned
  const { data: existing } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('client_id', clientId)
    .limit(1)
  
  if (existing?.length) {
    throw new Error('This client is already assigned to this project')
  }
  
  // Update project with new client
  const { data, error } = await supabase
    .from('projects')
    .update({ client_id: clientId, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .limit(1)
  
  if (error) throw new Error(error.message)
  return (data?.[0] || {}) as Project
}

// Remove client from project
export async function removeClientFromProject(projectId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .update({ client_id: null, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .limit(1)
  
  if (error) throw new Error(error.message)
  return (data?.[0] || {}) as Project
}

// Get project with client info
export async function getProjectWithClient(projectId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      clients (
        id,
        address,
        profiles (
          full_name,
          email,
          phone
        )
      )
    `)
    .eq('id', projectId)
    .limit(1)
  
  if (error) throw new Error(error.message)
  return (data?.[0] || null) as any
}
