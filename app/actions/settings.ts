'use server'

import { createClient } from '@/lib/supabase/server'
import { CompanySettings } from '@/lib/types'

export async function getCompanySettings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    // Return default settings if table doesn't exist or is empty
    return {
      id: '',
      company_name: 'Aménagement Monzon',
      address: 'Montréal, QC',
      phone: '',
      email: 'contact@amenagementmonzon.com',
      tax_number_1: '',
      tax_number_2: '',
      logo_url: null,
      signature_url: null,
      primary_color: '#C9A84C',
      secondary_color: '#0A0A0A',
      template_id: null,
      facebook_url: 'https://www.facebook.com/AmenagementMonzon/',
      instagram_url: 'https://www.instagram.com/amenagement_monzon',
      tiktok_url: 'https://www.tiktok.com/@amenagement_monzon',
    } as CompanySettings
  }

  return data as CompanySettings
}

export async function updateCompanySettings(data: Partial<CompanySettings>) {
  const supabase = await createClient()

  // Get existing settings
  const { data: existing } = await supabase
    .from('company_settings')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    const { data: settings, error } = await supabase
      .from('company_settings')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return settings as CompanySettings
  } else {
    const { data: settings, error } = await supabase
      .from('company_settings')
      .insert(data)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return settings as CompanySettings
  }
}
