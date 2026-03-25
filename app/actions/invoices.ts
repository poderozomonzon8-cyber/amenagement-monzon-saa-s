'use server'

import { createClient } from '@/lib/supabase/server'

export async function createInvoice(data: {
  project_id: string
  amount: number
  due_date: string
  description: string
  client_id: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const invoiceNumber = `INV-${Date.now()}`

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      ...data,
      invoice_number: invoiceNumber,
      admin_id: user.id,
      status: 'draft',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return invoice
}

export async function getInvoices(userId: string) {
  const supabase = await createClient()

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('admin_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return invoices
}

export async function getInvoiceById(id: string) {
  const supabase = await createClient()

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return invoice
}

export async function updateInvoice(id: string, data: Partial<{
  status: string
  amount: number
  due_date: string
  description: string
}>) {
  const supabase = await createClient()

  const { data: invoice, error } = await supabase
    .from('invoices')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return invoice
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
