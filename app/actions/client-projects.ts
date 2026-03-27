'use server'

import { createClient } from '@/lib/supabase/server'
import { Project } from '@/lib/types'

/**
 * Get all clients for dropdown selection
 * Returns clients with their profile information
 */
export async function getAllClients() {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        id,
        profile_id,
        address,
        profiles (
          id,
          full_name,
          email
        )
      `)
    
    if (error) {
      console.error('[v0] getAllClients error:', error.message)
      return []
    }
    
    // Sort clients by name in JavaScript (avoids Supabase nested field ordering issues)
    const sorted = (data || []).sort((a, b) => {
      const nameA = a.profiles?.full_name || 'Unknown'
      const nameB = b.profiles?.full_name || 'Unknown'
      return nameA.localeCompare(nameB)
    })
    
    return sorted.map(client => ({
      ...client,
      name: client.profiles?.full_name || 'Unknown'
    }))
  } catch (err) {
    console.error('[v0] getAllClients exception:', err)
    return []
  }
}

/**
 * Assign a client to a project
 */
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

/**
 * Remove client from a project
 */
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

/**
 * Get a single project with full client info
 */
export async function getProjectWithClient(projectId: string) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        clients (
          id,
          address,
          profile_id,
          profiles (
            id,
            full_name,
            email,
            phone
          )
        )
      `)
      .eq('id', projectId)
      .limit(1)
    
    if (error) {
      console.error('[v0] getProjectWithClient error:', error.message)
      return null
    }
    
    return (data?.[0] || null) as any
  } catch (err) {
    console.error('[v0] getProjectWithClient exception:', err)
    return null
  }
}
