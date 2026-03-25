'use server'

import { createClient } from '@/lib/supabase/server'
import { Payment } from '@/lib/types'

export async function createPayment(data: {
  invoice_id: string
  amount: number
  method: string
  status: string
}) {
  const supabase = await createClient()

  const { data: payment, error } = await supabase
    .from('payments')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return payment as Payment
}

export async function getPayments() {
  const supabase = await createClient()

  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (payments || []) as Payment[]
}

export async function getPaymentsByInvoice(invoiceId: string) {
  const supabase = await createClient()

  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (payments || []) as Payment[]
}

export async function updatePayment(id: string, data: Partial<Payment>) {
  const supabase = await createClient()

  const { data: payment, error } = await supabase
    .from('payments')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return payment as Payment
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
