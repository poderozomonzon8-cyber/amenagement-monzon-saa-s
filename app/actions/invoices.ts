'use server'

import { createClient } from '@/lib/supabase/server'
import { Invoice, InvoiceItem } from '@/lib/types'

export async function getInvoices() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*, profile:profiles(*)),
      project:projects(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as Invoice[]
}

export async function getInvoiceById(id: string) {
  const supabase = await createClient()

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*, profile:profiles(*)),
      project:projects(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)

  // Get invoice items
  const { data: items } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', id)
    .order('created_at')

  return { ...invoice, items: items || [] } as Invoice
}

export async function createInvoice(data: {
  invoice_type?: 'estimate' | 'invoice' | 'credit_note'
  project_id: string | null
  client_id: string
  subtotal?: number
  tax_rate?: number
  tax_amount?: number
  total: number
  due_date?: string | null
  notes?: string | null
  status?: string
  items?: InvoiceItem[]
}) {
  const supabase = await createClient()

  // Generate invoice number
  const timestamp = Date.now()
  const type = data.invoice_type || 'invoice'
  const prefix = type === 'estimate' ? 'EST' : type === 'credit_note' ? 'CR' : 'INV'
  const invoice_number = `${prefix}-${timestamp}`

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      invoice_number,
      invoice_type: type,
      project_id: data.project_id,
      client_id: data.client_id,
      subtotal: data.subtotal || data.total,
      tax_rate: data.tax_rate || 14.975,
      tax_amount: data.tax_amount || 0,
      total: data.total,
      status: data.status || 'draft',
      due_date: data.due_date || null,
      notes: data.notes || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Insert invoice items if provided
  if (data.items && data.items.length > 0) {
    const itemsWithInvoiceId = data.items.map(item => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    await supabase.from('invoice_items').insert(itemsWithInvoiceId)
  }

  return invoice as Invoice
}

export async function updateInvoice(id: string, data: Partial<Invoice> & { items?: InvoiceItem[] }) {
  const supabase = await createClient()

  const { items, client, project, ...invoiceData } = data

  const { data: invoice, error } = await supabase
    .from('invoices')
    .update(invoiceData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Update items if provided
  if (items) {
    await supabase.from('invoice_items').delete().eq('invoice_id', id)
    if (items.length > 0) {
      const itemsWithInvoiceId = items.map(item => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))
      await supabase.from('invoice_items').insert(itemsWithInvoiceId)
    }
  }

  return invoice as Invoice
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('invoices').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = { status }
  if (status === 'paid') {
    updateData.paid_date = new Date().toISOString().split('T')[0]
  }

  const { data, error } = await supabase
    .from('invoices')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Invoice
}
