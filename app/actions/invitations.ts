'use server'

import { createClient } from '@/lib/supabase/server'

// Email sending via Resend (set RESEND_API_KEY in env vars)
async function sendInvitationEmail(email: string, role: string, inviteUrl: string) {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    console.warn('[v0] RESEND_API_KEY not set - email not sent. Invite URL:', inviteUrl)
    return
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@amenagementmonzon.com',
        to: email,
        subject: `Invitation Aménagement Monzon - ${role === 'client' ? 'Client Portal' : 'Employee App'}`,
        html: `
          <h2>Bienvenue à Aménagement Monzon</h2>
          <p>Vous avez été invité à rejoindre notre plateforme en tant que <strong>${role === 'client' ? 'client' : 'employé'}</strong>.</p>
          <p><a href="${inviteUrl}" style="padding: 10px 20px; background: #C9A84C; color: #000; text-decoration: none; border-radius: 4px; display: inline-block;">Accepter l'invitation</a></p>
          <p>Ce lien expire dans 7 jours.</p>
          <p>Si vous n'avez pas demandé cette invitation, veuillez l'ignorer.</p>
        `,
      }),
    })
    
    if (!response.ok) {
      console.error('[v0] Email send failed:', await response.text())
    }
  } catch (err) {
    console.error('[v0] Email send exception:', err)
  }
}

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

// Create invitation and send email
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
    .limit(1)
  
  if (error) throw new Error(error.message)
  
  // Send invitation email
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/invite/${token}`
  await sendInvitationEmail(data.email, data.role, inviteUrl)
  
  return (invitation?.[0] || {}) as Invitation
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
    .limit(1)
  
  if (error) return null
  return (data?.[0] || null) as Invitation | null
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
