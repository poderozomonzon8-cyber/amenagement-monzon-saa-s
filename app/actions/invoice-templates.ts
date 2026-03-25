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
    .limit(1)
  
  if (error) throw new Error(error.message)
  
  // Return first record or empty object with defaults
  return (data?.[0] || {
    id: '',
    company_name: 'Aménagement Monzon',
    address: null,
    phone: null,
    email: null,
    logo_url: null,
    signature_url: null,
    primary_color: '#C9A84C',
    secondary_color: '#0A0A0A',
  }) as CompanySettings
}

export async function updateCompanySettings(settings: Partial<CompanySettings>) {
  const supabase = await createClient()
  
  if (!settings.id) throw new Error('ID is required')
  
  const { data, error } = await supabase
    .from('company_settings')
    .update(settings)
    .eq('id', settings.id)
    .select()
    .limit(1)
  
  if (error) throw new Error(error.message)
  return (data?.[0] || settings) as CompanySettings
}

export async function uploadLogo(file: File) {
  const supabase = await createClient()
  const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`
  
  console.log('[v0] Uploading logo:', fileName)
  
  try {
    const { data, error } = await supabase.storage
      .from('company_assets')
      .upload(`logos/${fileName}`, file, { upsert: true })
    
    if (error) {
      console.log('[v0] Storage upload error:', error.message)
      throw new Error(error.message)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('company_assets')
      .getPublicUrl(`logos/${fileName}`)
    
    console.log('[v0] Logo uploaded successfully:', publicUrl)
    return publicUrl
  } catch (err) {
    console.log('[v0] Logo upload exception:', err instanceof Error ? err.message : String(err))
    throw err
  }
}

export async function uploadSignature(file: File) {
  const supabase = await createClient()
  const fileName = `signature-${Date.now()}.${file.name.split('.').pop()}`
  
  console.log('[v0] Uploading signature:', fileName)
  
  try {
    const { data, error } = await supabase.storage
      .from('company_assets')
      .upload(`signatures/${fileName}`, file, { upsert: true })
    
    if (error) {
      console.log('[v0] Storage upload error:', error.message)
      throw new Error(error.message)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('company_assets')
      .getPublicUrl(`signatures/${fileName}`)
    
    console.log('[v0] Signature uploaded successfully:', publicUrl)
    return publicUrl
  } catch (err) {
    console.log('[v0] Signature upload exception:', err instanceof Error ? err.message : String(err))
    throw err
  }
}
