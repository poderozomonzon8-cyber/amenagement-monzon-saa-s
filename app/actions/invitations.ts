'use server'

import { createClient } from '@/lib/supabase/server'

export interface Invitation {
  id: string
  email: string
  role: 'employee' | 'client'
  project_id: string | null
  token: string
  expires_at: string
  used_at: string | null
  created_by: string | null
  created_at: string
}

// Generate a random token
function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Get all invitations
export async function getInvitations(): Promise<Invitation[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return (data || []) as Invitation[]
}

// Create invitation
export async function createInvitation(data: {
  email: string
  role: 'employee' | 'client'
  project_id?: string | null
}): Promise<Invitation> {
  const supabase = await createClient()
  
  const token = generateToken()
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  
  const { data: invitation, error } = await supabase
    .from('invitations')
    .insert({
      email: data.email,
      role: data.role,
      project_id: data.project_id || null,
      token,
      expires_at,
    })
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  return invitation as Invitation
}

// Get invitation by token
export async function getInvitationByToken(token: string): Promise<Invitation | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()
  
  if (error) return null
  return data as Invitation
}

// Mark invitation as used
export async function markInvitationUsed(token: string): Promise<void> {
  const supabase = await createClient()
  
  await supabase
    .from('invitations')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)
}

// Delete invitation
export async function deleteInvitation(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id)
  
  if (error) throw new Error(error.message)
}
