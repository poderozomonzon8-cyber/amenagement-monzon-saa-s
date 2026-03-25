'use server'

import { createClient } from '@/lib/supabase/server'

export async function createPayment(data: {
  invoice_id: string
  amount: number
  method: 'cash' | 'virement' | 'interac' | 'card'
  date: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      ...data,
      admin_id: user.id,
      status: 'completed',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Update invoice status if fully paid
  const invoice = await supabase
    .from('invoices')
    .select('amount')
    .eq('id', data.invoice_id)
    .single()

  if (invoice.data) {
    const totalPaid = await supabase
      .from('payments')
      .select('amount')
      .eq('invoice_id', data.invoice_id)

    const paid = totalPaid.data?.reduce((sum, p) => sum + p.amount, 0) || 0
    if (paid >= invoice.data.amount) {
      await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', data.invoice_id)
    }
  }

  return payment
}

export async function getPayments(userId: string) {
  const supabase = await createClient()

  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .eq('admin_id', userId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return payments
}

export async function getPaymentsByInvoice(invoiceId: string) {
  const supabase = await createClient()

  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return payments
}

export async function updatePayment(id: string, data: Partial<{
  amount: number
  method: string
  date: string
  status: string
}>) {
  const supabase = await createClient()

  const { data: payment, error } = await supabase
    .from('payments')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return payment
}

export async function deletePayment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}
