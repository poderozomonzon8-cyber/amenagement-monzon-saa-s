'use server'

import { createClient } from '@/lib/supabase/server'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  service_type: string
  description: string
  budget: string | null
  preferred_date: string | null
  status: 'new' | 'contacted' | 'converted' | 'closed'
  created_at: string
}

export async function createLead(data: {
  name: string
  email: string
  phone: string
  service_type: string
  description: string
  budget: string
  preferred_date: string | null
}): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        service_type: data.service_type,
        description: data.description,
        budget: data.budget || null,
        preferred_date: data.preferred_date || null,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) throw error

    return { success: true, leadId: lead.id }
  } catch (error) {
    console.error('Error creating lead:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead'
    }
  }
}

export async function getLeads(): Promise<Lead[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []) as Lead[]
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}

export async function updateLeadStatus(
  leadId: string,
  status: 'new' | 'contacted' | 'converted' | 'closed'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error updating lead status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lead'
    }
  }
}

export async function convertLeadToClient(leadId: string): Promise<{ success: boolean; clientId?: string; error?: string }> {
  try {
    const supabase = await createClient()

    // Get the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) throw new Error('Lead not found')

    // Create client from lead
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: lead.name,
        phone: lead.phone,
        address: null
      })
      .select('id')
      .single()

    if (clientError) throw clientError

    // Update lead status
    await supabase
      .from('leads')
      .update({ status: 'converted' })
      .eq('id', leadId)

    return { success: true, clientId: client.id }
  } catch (error) {
    console.error('Error converting lead to client:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert lead'
    }
  }
}

export async function deleteLead(leadId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error deleting lead:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete lead'
    }
  }
}
