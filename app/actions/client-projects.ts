'use server'

import { createClient } from '@/lib/supabase/server'

// Get all clients for dropdown - NO ORDER CLAUSE, sort in JS
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
    
    // Sort by name in JavaScript
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
    console.error('[v0] getAllClients catch:', err)
    return []
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
    console.error('[v0] assignClientToProject catch:', err)
    throw err
  }
}

// Get project with client info - SIMPLIFIED QUERY
export async function getProjectWithClient(projectId: string) {
  try {
    const supabase = await createClient()
    
    // First get the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    
    if (projectError || !project) {
      console.error('[v0] getProjectWithClient project error:', projectError?.message)
      return null
    }
    
    // If project has a client_id, get client info separately
    if (project.client_id) {
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select(`
          id,
          address,
          profile_id,
          profiles (
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('id', project.client_id)
        .single()
      
      if (!clientError && client) {
        return { ...project, clients: client }
      }
    }
    
    return project
  } catch (err) {
    console.error('[v0] getProjectWithClient catch:', err)
    return null
  }
}
