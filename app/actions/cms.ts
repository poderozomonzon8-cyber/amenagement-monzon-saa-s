'use server'

import { createClient } from '@/lib/supabase/server'

export interface HeroContent {
  id: string
  page_key: string
  title: string
  subtitle: string
  cta_text: string
  cta_link: string
  media_type: 'image' | 'video'
  media_url?: string
  overlay_color: string
  accent_color: string
  is_published: boolean
}

// Fetch hero content for a specific page
export async function getHeroContent(pageKey: string): Promise<HeroContent | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cms_hero_content')
    .select('*')
    .eq('page_key', pageKey)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error(`Failed to fetch hero content for ${pageKey}:`, error)
    return null
  }

  return data as HeroContent
}

// Fetch all hero content (for admin dashboard)
export async function getAllHeroContent(): Promise<HeroContent[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cms_hero_content')
    .select('*')
    .order('page_key', { ascending: true })

  if (error) {
    console.error('Failed to fetch all hero content:', error)
    return []
  }

  return data as HeroContent[]
}

// Update hero content
export async function updateHeroContent(
  pageKey: string,
  updates: Partial<HeroContent>
): Promise<{ success: boolean; data?: HeroContent; error?: string }> {
  const supabase = await createClient()

  // Check if user is admin
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, error: 'Not authenticated' }
  }

  // Update the content
  const { data, error } = await supabase
    .from('cms_hero_content')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq('page_key', pageKey)
    .select()
    .single()

  if (error) {
    console.error(`Failed to update hero content for ${pageKey}:`, error)
    return { success: false, error: error.message }
  }

  // Log to history
  try {
    await supabase
      .from('cms_hero_history')
      .insert({
        hero_id: data.id,
        title: updates.title || data.title,
        subtitle: updates.subtitle || data.subtitle,
        media_url: updates.media_url || data.media_url,
        changed_by: session.user.id,
      })
  } catch (historyError) {
    console.warn('Failed to log hero history:', historyError)
  }

  return { success: true, data: data as HeroContent }
}

// Upload and update hero media
export async function updateHeroMedia(
  pageKey: string,
  mediaType: 'image' | 'video',
  mediaUrl: string
): Promise<{ success: boolean; error?: string }> {
  return updateHeroContent(pageKey, {
    media_type: mediaType,
    media_url: mediaUrl,
  }).then(result => ({
    success: result.success,
    error: result.error,
  }))
}
