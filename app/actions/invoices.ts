'use server'

import { createClient } from '@/lib/supabase/server'
import { Invoice } from '@/lib/types'

export async function createInvoice(data: {
  project_id: string
  client_id: string
  total: number
  status: string
}) {
  const supabase = await createClient()

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return invoice as Invoice
}

export async function getInvoices() {
  const supabase = await createClient()

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (invoices || []) as Invoice[]
}

export async function getInvoiceById(id: string) {
  const supabase = await createClient()

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return invoice as Invoice
}

export async function updateInvoice(id: string, data: Partial<Invoice>) {
  const supabase = await createClient()

  const { data: invoice, error } = await supabase
    .from('invoices')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return invoice as Invoice
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}
