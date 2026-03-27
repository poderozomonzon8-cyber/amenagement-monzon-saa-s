'use server'

import { createClient } from '@/lib/supabase/server'

// Safe getAllClients - returns empty array on any error
export async function getAllClients() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('clients')
      .select('id, profile_id, address, profiles(id, full_name, email)')
    
    if (error) {
      console.error('[v0] getAllClients error:', error.message)
      return []
    }
    
    // Sort in JS, not database
    const sorted = (data || []).sort((a: any, b: any) => {
      const nameA = a.profiles?.full_name || ''
      const nameB = b.profiles?.full_name || ''
      return nameA.localeCompare(nameB)
    })
    
    return sorted.map((c: any) => ({ ...c, name: c.profiles?.full_name || 'Unknown' }))
  } catch (err) {
    console.error('[v0] getAllClients caught:', err)
    return []
  }
}

// Safe getProjectWithClient - returns null on any error
export async function getProjectWithClient(projectId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('projects')
      .select('*, clients(id, address, profile_id, profiles(id, full_name, email, phone))')
      .eq('id', projectId)
      .limit(1)
    
    if (error) {
      console.error('[v0] getProjectWithClient error:', error.message)
      return null
    }
    
    return data?.[0] || null
  } catch (err) {
    console.error('[v0] getProjectWithClient caught:', err)
    return null
  }
}

// Safe assignClientToProject
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
    console.error('[v0] assignClientToProject caught:', err)
    throw err
  }
}

// Safe removeClientFromProject
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
    console.error('[v0] removeClientFromProject caught:', err)
    throw err
  }
}
