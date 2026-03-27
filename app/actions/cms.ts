'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================================
// HERO MANAGEMENT
// ============================================================

export type WebsiteHero = {
  id: string
  page_key: 'home' | 'construction' | 'hardscape' | 'maintenance'
  title: string
  subtitle: string
  cta_text: string
  cta_link: string
  media_type: 'image' | 'video'
  media_url: string | null
  video_url: string | null
  overlay_color: string
  accent_color: string
  is_active: boolean
  updated_at: string
}

export async function getHeroes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('website_heroes')
    .select('*')
    .order('page_key')
  
  if (error) {
    console.error('Error fetching heroes:', error)
    return []
  }
  return data as WebsiteHero[]
}

export async function getHeroByPage(pageKey: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('website_heroes')
    .select('*')
    .eq('page_key', pageKey)
    .single()
  
  if (error) {
    console.error('Error fetching hero:', error)
    return null
  }
  return data as WebsiteHero
}

export async function updateHero(id: string, updates: Partial<WebsiteHero>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('website_heroes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating hero:', error)
    throw new Error(error.message)
  }
  
  revalidatePath('/marketing')
  revalidatePath('/marketing/services/construction')
  revalidatePath('/marketing/services/hardscape')
  revalidatePath('/marketing/services/maintenance')
}

// ============================================================
// PORTFOLIO MANAGEMENT
// ============================================================

export type PortfolioItem = {
  id: string
  title: string
  description: string | null
  category: 'construction' | 'hardscape' | 'maintenance'
  image_url: string
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export async function getPortfolioItems() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching portfolio:', error)
    return []
  }
  return data as PortfolioItem[]
}

export async function createPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert(item)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating portfolio item:', error)
    throw new Error(error.message)
  }
  
  revalidatePath('/marketing/portfolio')
  return data as PortfolioItem
}

export async function updatePortfolioItem(id: string, updates: Partial<PortfolioItem>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('portfolio_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating portfolio item:', error)
    throw new Error(error.message)
  }
  
  revalidatePath('/marketing/portfolio')
}

export async function deletePortfolioItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('portfolio_items')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting portfolio item:', error)
    throw new Error(error.message)
  }
  
  revalidatePath('/marketing/portfolio')
}

// ============================================================
// ABOUT / FOUNDER MANAGEMENT
// ============================================================

export type WebsiteAbout = {
  id: string
  founder_name: string
  founder_image_url: string | null
  founder_story: string
  mission_statement: string
  years_experience: number
  projects_completed: number
  updated_at: string
}

export async function getAboutContent() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('website_about')
    .select('*')
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error fetching about content:', error)
    return null
  }
  return data as WebsiteAbout
}

export async function updateAboutContent(id: string, updates: Partial<WebsiteAbout>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('website_about')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating about content:', error)
    throw new Error(error.message)
  }
  
  revalidatePath('/marketing')
  revalidatePath('/marketing/about')
}

// ============================================================
// REVIEWS / TESTIMONIALS MANAGEMENT
// ============================================================

export type Review = {
  id: string
  client_name: string
  client_role: string | null
  rating: number
  comment: string
  is_featured: boolean
  is_approved: boolean
  created_at: string
}

export async function getReviews(onlyApproved = false) {
  const supabase = await createClient()
  let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
  
  if (onlyApproved) {
    query = query.eq('is_approved', true)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
  return data as Review[]
}

export async function getFeaturedReviews() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6)
  
  if (error) {
    console.error('Error fetching featured reviews:', error)
    return []
  }
  return data as Review[]
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating review:', error)
    throw new Error(error.message)
  }
  
  revalidatePath('/marketing')
  return data as Review
}

export async function updateReview(id: string, updates: Partial<Review>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
  
  if (error) {
    console.error('Error updating review:', error)
    throw new Error(error.message)
  }
  
  revalidatePath('/marketing')
}

export async function deleteReview(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting review:', error)
    throw new Error(error.message)
  }
  
  revalidatePath('/marketing')
}

// ============================================================
// MEDIA UPLOAD
// ============================================================

export async function uploadCMSMedia(file: File, folder: string = 'general') {
  const supabase = await createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('cms-media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('Error uploading media:', error)
    throw new Error(error.message)
  }
  
  const { data: urlData } = supabase.storage
    .from('cms-media')
    .getPublicUrl(data.path)
  
  return urlData.publicUrl
}

export async function deleteCMSMedia(url: string) {
  const supabase = await createClient()
  
  // Extract path from URL
  const path = url.split('/cms-media/')[1]
  if (!path) return
  
  const { error } = await supabase.storage
    .from('cms-media')
    .remove([path])
  
  if (error) {
    console.error('Error deleting media:', error)
  }
}
