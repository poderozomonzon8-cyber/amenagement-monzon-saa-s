'use server'

import { sql } from '@vercel/postgres'

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
    const result = await sql`
      INSERT INTO leads (name, email, phone, service_type, description, budget, preferred_date, status)
      VALUES (${data.name}, ${data.email}, ${data.phone || null}, ${data.service_type}, ${data.description}, ${data.budget || null}, ${data.preferred_date || null}, 'new')
      RETURNING id
    `

    if (!result.rows[0]) throw new Error('Failed to create lead')

    return { success: true, leadId: result.rows[0].id }
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
    const result = await sql`
      SELECT * FROM leads 
      ORDER BY created_at DESC
    `
    return (result.rows || []) as Lead[]
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
    await sql`
      UPDATE leads 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${leadId}
    `
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
    // Get the lead
    const leadResult = await sql`
      SELECT name, phone FROM leads WHERE id = ${leadId}
    `
    
    if (!leadResult.rows[0]) throw new Error('Lead not found')
    const lead = leadResult.rows[0]

    // Create client from lead
    const clientResult = await sql`
      INSERT INTO clients (name, phone, address, created_at)
      VALUES (${lead.name}, ${lead.phone}, null, NOW())
      RETURNING id
    `

    if (!clientResult.rows[0]) throw new Error('Failed to create client')

    // Update lead status
    await sql`
      UPDATE leads SET status = 'converted', updated_at = NOW()
      WHERE id = ${leadId}
    `

    return { success: true, clientId: clientResult.rows[0].id }
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
    await sql`
      DELETE FROM leads WHERE id = ${leadId}
    `
    return { success: true }
  } catch (error) {
    console.error('Error deleting lead:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete lead'
    }
  }
}
