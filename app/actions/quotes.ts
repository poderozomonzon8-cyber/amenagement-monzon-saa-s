'use server'

import { createClient } from '@/lib/supabase/server'

// Get historical pricing data to suggest ranges
export async function getPricingSuggestions(serviceType: string) {
  const supabase = await createClient()

  // Get average pricing from past invoices of this service type
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      total,
      subtotal,
      invoice_items(description, unit_price, quantity)
    `)
    .eq('status', 'paid')
    .eq('invoice_type', 'invoice')
    .limit(50)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pricing data:', error)
    return {
      minPrice: 500,
      avgPrice: 1500,
      maxPrice: 5000,
    }
  }

  if (!data || data.length === 0) {
    // Default ranges for Aménagement Monzon services
    const defaults: Record<string, { min: number; avg: number; max: number }> = {
      construction: { min: 2000, avg: 8000, max: 50000 },
      hardscape: { min: 1500, avg: 5000, max: 20000 },
      maintenance: { min: 300, avg: 1000, max: 5000 },
    }
    return defaults[serviceType] || defaults.construction
  }

  const prices = data.map((inv: any) => inv.total).filter(Boolean)
  const sorted = prices.sort((a, b) => a - b)
  const minPrice = sorted[0]
  const maxPrice = sorted[sorted.length - 1]
  const avgPrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length

  return {
    minPrice: Math.round(minPrice),
    avgPrice: Math.round(avgPrice),
    maxPrice: Math.round(maxPrice),
  }
}

// Save quote templates for recurring services
export async function saveQuoteTemplate(data: {
  name: string
  serviceType: string
  description: string
  items: Array<{ description: string; quantity: number; unitPrice: number }>
}) {
  const supabase = await createClient()

  const { data: template, error } = await supabase
    .from('quote_templates')
    .insert({
      name: data.name,
      service_type: data.serviceType,
      description: data.description,
      items_config: data.items,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return template
}

// Get saved quote templates
export async function getQuoteTemplates() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('quote_templates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

// Convert quote (estimate) to invoice
export async function convertQuoteToInvoice(quoteId: string) {
  const supabase = await createClient()

  // Get the quote
  const { data: quote, error: quoteError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', quoteId)
    .eq('invoice_type', 'estimate')
    .single()

  if (quoteError) throw new Error('Quote not found')

  // Create new invoice from quote
  const timestamp = Date.now()
  const invoiceNumber = `INV-${timestamp}`

  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      invoice_number: invoiceNumber,
      invoice_type: 'invoice',
      project_id: quote.project_id,
      client_id: quote.client_id,
      subtotal: quote.subtotal,
      tax_rate: quote.tax_rate,
      tax_amount: quote.tax_amount,
      total: quote.total,
      status: 'sent',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      notes: `Converted from quote ${quote.invoice_number}`,
    })
    .select()
    .single()

  if (invoiceError) throw new Error(invoiceError.message)

  // Copy invoice items
  const { data: quoteItems, error: itemsError } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', quoteId)

  if (!itemsError && quoteItems && quoteItems.length > 0) {
    const invoiceItems = quoteItems.map((item: any) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    await supabase.from('invoice_items').insert(invoiceItems)
  }

  return invoice
}

// Get quote for editing/viewing
export async function getQuoteById(id: string) {
  const supabase = await createClient()

  const { data: quote, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*, profile:profiles(*)),
      project:projects(*)
    `)
    .eq('id', id)
    .eq('invoice_type', 'estimate')
    .single()

  if (error) throw new Error(error.message)

  const { data: items } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', id)

  return { ...quote, items: items || [] }
}
