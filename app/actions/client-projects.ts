'use server'

import { createClient } from '@/lib/supabase/server'

// Get all clients for dropdown - with safe error handling
export async function getAllClients() {
  try {
    const supabase = await createClient()
    
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
    
    // Sort by profile name in JavaScript
    const sorted = (data || []).sort((a, b) => {
      const nameA = a.profiles?.full_name || ''
      const nameB = b.profiles?.full_name || ''
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

// Get project with client info - with safe error handling  
export async function getProjectWithClient(projectId: string) {
  try {
    const supabase = await createClient()
    
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
    
    return data?.[0] || null
  } catch (err) {
    console.error('[v0] getProjectWithClient exception:', err)
    return null
  }
}

// Assign client to project
export async function assignClientToProject(projectId: string, clientId: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('projects')
      .update({ client_id: clientId })
      .eq('id', projectId)
    
    if (error) {
      console.error('[v0] assignClientToProject error:', error.message)
      throw new Error(error.message)
    }
    
    return { success: true }
  } catch (err) {
    console.error('[v0] assignClientToProject exception:', err)
    throw err
  }
}

// Remove client from project
export async function removeClientFromProject(projectId: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('projects')
      .update({ client_id: null })
      .eq('id', projectId)
    
    if (error) {
      console.error('[v0] removeClientFromProject error:', error.message)
      throw new Error(error.message)
    }
    
    return { success: true }
  } catch (err) {
    console.error('[v0] removeClientFromProject exception:', err)
    throw err
  }
}
