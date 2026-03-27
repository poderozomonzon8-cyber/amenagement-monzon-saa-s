'use server'

import { createClient } from '@/lib/supabase/server'
import { createProject } from './projects'
import { createNotification } from './notifications'

export interface ServiceRequest {
  id: string
  client_id: string
  service_type: 'construction' | 'hardscape' | 'maintenance'
  description: string
  preferred_date: string
  budget_estimate?: number
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed'
  created_project_id?: string
  created_at: string
  updated_at: string
}

export async function getServiceRequests(clientId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching service requests:', error)
    return []
  }

  return data || []
}

export async function createServiceRequest(data: {
  client_id: string
  service_type: 'construction' | 'hardscape' | 'maintenance'
  description: string
  preferred_date: string
  budget_estimate?: number
}) {
  const supabase = await createClient()

  const { data: request, error } = await supabase
    .from('service_requests')
    .insert({
      client_id: data.client_id,
      service_type: data.service_type,
      description: data.description,
      preferred_date: data.preferred_date,
      budget_estimate: data.budget_estimate || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Notify admins of new request
  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')

  for (const admin of admins || []) {
    await createNotification({
      user_id: admin.id,
      type: 'project_update',
      title: 'Nouvelle demande de service',
      message: `Un client a demandé un service de ${data.service_type}`,
      related_id: request.id,
    })
  }

  return request
}

export async function approveServiceRequest(requestId: string) {
  const supabase = await createClient()

  // Get request details
  const { data: request, error: reqError } = await supabase
    .from('service_requests')
    .select('*, client:clients(*, profile:profiles(id))')
    .eq('id', requestId)
    .single()

  if (reqError) throw new Error(reqError.message)

  // Create a project from the request
  const newProject = await createProject({
    name: `${request.service_type.toUpperCase()} - ${new Date(request.preferred_date).toLocaleDateString('fr-FR')}`,
    client_id: request.client_id,
    status: 'planning',
    start_date: new Date().toISOString().split('T')[0],
    end_date: request.preferred_date,
    budget: request.budget_estimate || 5000,
  })

  // Update request status
  const { data: updated, error: updateError } = await supabase
    .from('service_requests')
    .update({
      status: 'approved',
      created_project_id: newProject.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .select()
    .single()

  if (updateError) throw new Error(updateError.message)

  // Notify client
  if (request.client?.profile?.id) {
    await createNotification({
      user_id: request.client.profile.id,
      type: 'project_update',
      title: 'Demande approuvée',
      message: `Votre demande de service a été approuvée et un projet a été créé`,
      related_id: newProject.id,
    })
  }

  return updated
}

export async function rejectServiceRequest(requestId: string, reason: string) {
  const supabase = await createClient()

  const { data: request, error: reqError } = await supabase
    .from('service_requests')
    .select('*, client:clients(*, profile:profiles(id))')
    .eq('id', requestId)
    .single()

  if (reqError) throw new Error(reqError.message)

  const { data: updated, error: updateError } = await supabase
    .from('service_requests')
    .update({
      status: 'rejected',
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .select()
    .single()

  if (updateError) throw new Error(updateError.message)

  // Notify client
  if (request.client?.profile?.id) {
    await createNotification({
      user_id: request.client.profile.id,
      type: 'project_update',
      title: 'Demande rejetée',
      message: `Votre demande de service a été rejetée. ${reason}`,
      related_id: requestId,
    })
  }

  return updated
}

export async function getClientQuotesForApproval(clientId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
    .eq('invoice_type', 'estimate')
    .eq('status', 'sent')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function approveQuote(quoteId: string) {
  const supabase = await createClient()

  const { data: quote, error } = await supabase
    .from('invoices')
    .update({ status: 'approved' })
    .eq('id', quoteId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Notify admins
  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')

  for (const admin of admins || []) {
    await createNotification({
      user_id: admin.id,
      type: 'quote',
      title: 'Devis approuvé par client',
      message: `Le client a approuvé le devis ${quote.invoice_number}`,
      related_id: quoteId,
    })
  }

  return quote
}

export async function getClientPaymentMethods() {
  return [
    { id: 'card', label: 'Carte de crédit', available: true },
    { id: 'virement', label: 'Virement bancaire', available: true },
    { id: 'interac', label: 'Interac', available: true },
    { id: 'check', label: 'Chèque', available: true },
  ]
}
