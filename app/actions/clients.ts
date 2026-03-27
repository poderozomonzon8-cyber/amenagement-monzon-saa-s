'use server'

import { createClient } from '@/lib/supabase/server'
import { Client } from '@/lib/types'

// Get or create client by email - for lead submissions
export async function getOrCreateClient(data: { first_name: string; last_name: string; email: string; phone?: string }): Promise<Client> {
  const supabase = await createClient()
  
  // Check if client already exists by email
  const { data: existing } = await supabase
    .from('clients')
    .select('*')
    .eq('email', data.email)
    .single()

  if (existing) return existing as Client

  // Create new client without requiring profile_id
  const { data: newClient, error } = await supabase
    .from('clients')
    .insert({
      email: data.email,
      phone: data.phone || null,
      name: `${data.first_name}${data.last_name ? ' ' + data.last_name : ''}`.trim(),
      address: null
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating client:', error)
    throw new Error(error.message)
  }
  return newClient as Client
}

export async function getClients() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      profile:profiles(*)
    `)
    .order('id')

  if (error) throw new Error(error.message)
  return (data || []) as Client[]
}

export async function getClientById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as Client
}

export async function createClientForProfile(profileId: string, address?: string) {
  const supabase = await createClient()
  
  // Check if client already exists for this profile
  const { data: existing } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', profileId)
    .single()

  if (existing) return existing as Client

  const { data, error } = await supabase
    .from('clients')
    .insert({ profile_id: profileId, address: address || null })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Client
}

export async function updateClient(id: string, data: Partial<Client>) {
  const supabase = await createClient()

  const { data: client, error } = await supabase
    .from('clients')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return client as Client
}
