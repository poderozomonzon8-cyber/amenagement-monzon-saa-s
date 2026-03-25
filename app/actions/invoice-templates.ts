'use server'

import { createClient } from '@/lib/supabase/server'
import { InvoiceTemplate, CompanySettings } from '@/lib/types'

export async function getInvoiceTemplates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('invoice_templates')
    .select('*')
    .order('name')
  
  if (error) throw new Error(error.message)
  return (data || []) as InvoiceTemplate[]
}

export async function getCompanySettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .single()
  
  if (error) throw new Error(error.message)
  return data as CompanySettings
}

export async function updateCompanySettings(settings: Partial<CompanySettings>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('company_settings')
    .update(settings)
    .eq('id', settings.id)
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  return data as CompanySettings
}

export async function uploadLogo(file: File) {
  const supabase = await createClient()
  const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`
  
  const { data, error } = await supabase.storage
    .from('company_assets')
    .upload(`logos/${fileName}`, file, { upsert: true })
  
  if (error) throw new Error(error.message)
  
  const { data: { publicUrl } } = supabase.storage
    .from('company_assets')
    .getPublicUrl(`logos/${fileName}`)
  
  return publicUrl
}

export async function uploadSignature(file: File) {
  const supabase = await createClient()
  const fileName = `signature-${Date.now()}.${file.name.split('.').pop()}`
  
  const { data, error } = await supabase.storage
    .from('company_assets')
    .upload(`signatures/${fileName}`, file, { upsert: true })
  
  if (error) throw new Error(error.message)
  
  const { data: { publicUrl } } = supabase.storage
    .from('company_assets')
    .getPublicUrl(`signatures/${fileName}`)
  
  return publicUrl
}
