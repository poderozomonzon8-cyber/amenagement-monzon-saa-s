'use server'
// v1.0.1 - Exports: getInvoiceTemplates, getTemplates, getCompanySettings, updateCompanySettings, uploadLogo, uploadSignature
import { createClient } from '@/lib/supabase/server'
import { CompanySettings, InvoiceTemplate } from '@/lib/types'

export async function getInvoiceTemplates() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invoice_templates')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return data as InvoiceTemplate[]
}

// Alias for compatibility
export const getTemplates = getInvoiceTemplates

// Get company settings with limit instead of single - returns defaults if not found
export async function getCompanySettings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
  
  if (error) return getDefaultSettings()
  
  return (data?.[0] || getDefaultSettings()) as CompanySettings
}

function getDefaultSettings(): CompanySettings {
  return {
    id: '',
    company_name: 'Aménagement Monzon',
    address: null,
    phone: null,
    email: null,
    logo_url: null,
    signature_url: null,
    primary_color: '#C9A84C',
    secondary_color: '#0A0A0A',
    tax_number_1: null,
    tax_number_2: null,
    template_id: null,
  }
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
      console.log('[v0] Storage error:', error.message)
      throw new Error(error.message)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('company_assets')
      .getPublicUrl(`logos/${fileName}`)
    
    console.log('[v0] Logo URL:', publicUrl)
    return publicUrl
  } catch (err) {
    console.log('[v0] Upload error:', err instanceof Error ? err.message : String(err))
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
      console.log('[v0] Storage error:', error.message)
      throw new Error(error.message)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('company_assets')
      .getPublicUrl(`signatures/${fileName}`)
    
    console.log('[v0] Signature URL:', publicUrl)
    return publicUrl
  } catch (err) {
    console.log('[v0] Upload error:', err instanceof Error ? err.message : String(err))
    throw err
  }
}
