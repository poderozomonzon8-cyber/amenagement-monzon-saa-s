'use server'

import { createClient } from '@/lib/supabase/server'
import { getOrCreateClient } from '@/app/actions/clients'
import { createProject } from '@/app/actions/projects'
import type { Profile } from '@/lib/types'

export interface LeadData {
  name: string
  email: string
  phone: string
  service_type: 'construction' | 'hardscape' | 'maintenance'
  budget_range: string
  project_description: string
  preferred_date?: string
}

export async function submitLead(data: LeadData) {
  try {
    const supabase = await createClient()

    // 1. Get or create client
    const client = await getOrCreateClient({
      first_name: data.name.split(' ')[0],
      last_name: data.name.split(' ').slice(1).join(' ') || '',
      email: data.email,
      phone: data.phone
    })

    if (!client?.id) {
      throw new Error('Failed to create/get client')
    }

    // 2. Create project request from lead
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: `${data.service_type.charAt(0).toUpperCase() + data.service_type.slice(1)} - ${data.name}`,
        description: data.project_description,
        client_id: client.id,
        service_type: data.service_type,
        budget: data.budget_range,
        status: 'quote_pending',
        start_date: data.preferred_date || null,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (projectError) {
      console.error('Project creation error:', projectError)
      throw projectError
    }

    // 3. Create notification for admin (optional, non-blocking)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            type: 'new_lead',
            title: `New Lead: ${data.name}`,
            message: `${data.name} (${data.email}) submitted a quote request for ${data.service_type}. Budget: ${data.budget_range}`,
            read: false
          })
      }
    } catch (notifError) {
      console.error('Notification error (non-critical):', notifError)
    }

    return {
      success: true,
      projectId: project.id,
      clientId: client.id,
      message: 'Lead received successfully'
    }
  } catch (error) {
    console.error('Error submitting lead:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit lead'
    }
  }
}

export async function getLeads() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('projects')
      .select('*, clients(*)')
      .eq('status', 'quote_pending')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}

export async function getQuoteForLead(projectId: string) {
  try {
    const supabase = await createClient()

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projectError) throw projectError

    // Calculate estimated price range based on service type and budget
    const estimates = {
      construction: { min: 5000, max: 50000 },
      hardscape: { min: 3000, max: 30000 },
      maintenance: { min: 500, max: 5000 }
    }

    const serviceType = project.service_type as keyof typeof estimates
    const range = estimates[serviceType] || { min: 1000, max: 10000 }

    return {
      projectId,
      serviceType: project.service_type,
      estimatedRange: range,
      budget_range: project.budget,
      description: project.description
    }
  } catch (error) {
    console.error('Error getting quote:', error)
    return null
  }
}
