'use server'

import { sql } from '@vercel/postgres'
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
  overlay_intensity?: number
  accent_color: string
  is_active: boolean
  updated_at: string
}

// Default hero data for fallback
const defaultHeroes: Record<string, Partial<WebsiteHero>> = {
  home: {
    page_key: 'home',
    title: 'Aménagement Monzon',
    subtitle: 'Your trusted partner for construction, hardscape, and maintenance services in Montreal',
    cta_text: 'Get a Free Quote',
    cta_link: '/marketing/contact',
    media_type: 'image',
    overlay_color: '#000000',
    overlay_intensity: 0.5,
    accent_color: '#C9A84C',
    is_active: true
  },
  construction: {
    page_key: 'construction',
    title: 'Construction & Renovations',
    subtitle: 'Quality construction services for residential and commercial projects',
    cta_text: 'Request Quote',
    cta_link: '/marketing/contact',
    media_type: 'image',
    overlay_color: '#000000',
    overlay_intensity: 0.5,
    accent_color: '#C9A84C',
    is_active: true
  },
  hardscape: {
    page_key: 'hardscape',
    title: 'Hardscape & Landscape',
    subtitle: 'Transform your outdoor space with our expert hardscape services',
    cta_text: 'Request Quote',
    cta_link: '/marketing/contact',
    media_type: 'image',
    overlay_color: '#000000',
    overlay_intensity: 0.5,
    accent_color: '#C9A84C',
    is_active: true
  },
  maintenance: {
    page_key: 'maintenance',
    title: 'Maintenance Services',
    subtitle: 'Reliable property maintenance to keep your space in perfect condition',
    cta_text: 'Request Quote',
    cta_link: '/marketing/contact',
    media_type: 'image',
    overlay_color: '#000000',
    overlay_intensity: 0.5,
    accent_color: '#C9A84C',
    is_active: true
  }
}

export async function getHeroes(): Promise<WebsiteHero[]> {
  try {
    const result = await sql`SELECT * FROM website_heroes ORDER BY page_key`
    return result.rows as WebsiteHero[]
  } catch (error) {
    console.error('Error fetching heroes:', error)
    // Return fallback heroes
    return Object.values(defaultHeroes).map((h, i) => ({
      id: `fallback-${i}`,
      ...h,
      media_url: null,
      video_url: null,
      updated_at: new Date().toISOString()
    })) as WebsiteHero[]
  }
}

export async function getHeroByPage(pageKey: string): Promise<WebsiteHero | null> {
  try {
    const result = await sql`SELECT * FROM website_heroes WHERE page_key = ${pageKey} LIMIT 1`
    if (result.rows[0]) {
      return result.rows[0] as WebsiteHero
    }
    // Return fallback if not found
    const fallback = defaultHeroes[pageKey]
    if (fallback) {
      return {
        id: `fallback-${pageKey}`,
        ...fallback,
        media_url: null,
        video_url: null,
        updated_at: new Date().toISOString()
      } as WebsiteHero
    }
    return null
  } catch (error) {
    console.error('Error fetching hero:', { message: (error as Error).message, details: String(error) })
    // Return fallback on error
    const fallback = defaultHeroes[pageKey]
    if (fallback) {
      return {
        id: `fallback-${pageKey}`,
        ...fallback,
        media_url: null,
        video_url: null,
        updated_at: new Date().toISOString()
      } as WebsiteHero
    }
    return null
  }
}

export async function updateHero(id: string, updates: Partial<WebsiteHero>) {
  try {
    await sql`
      UPDATE website_heroes 
      SET 
        title = COALESCE(${updates.title}, title),
        subtitle = COALESCE(${updates.subtitle}, subtitle),
        cta_text = COALESCE(${updates.cta_text}, cta_text),
        cta_link = COALESCE(${updates.cta_link}, cta_link),
        media_type = COALESCE(${updates.media_type}, media_type),
        media_url = COALESCE(${updates.media_url}, media_url),
        overlay_color = COALESCE(${updates.overlay_color}, overlay_color),
        overlay_intensity = COALESCE(${updates.overlay_intensity}, overlay_intensity),
        accent_color = COALESCE(${updates.accent_color}, accent_color),
        is_active = COALESCE(${updates.is_active}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
    `
    revalidatePath('/marketing')
    revalidatePath('/marketing/services/construction')
    revalidatePath('/marketing/services/hardscape')
    revalidatePath('/marketing/services/maintenance')
  } catch (error) {
    console.error('Error updating hero:', error)
    throw new Error((error as Error).message)
  }
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

const fallbackPortfolio: PortfolioItem[] = [
  {
    id: 'fallback-1',
    title: 'Modern Patio Renovation',
    description: 'Complete outdoor patio transformation with built-in seating',
    category: 'hardscape',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fallback-2',
    title: 'Kitchen Renovation',
    description: 'Full kitchen remodel with new cabinetry and fixtures',
    category: 'construction',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fallback-3',
    title: 'Landscape Design',
    description: 'Beautiful garden design with native plants',
    category: 'hardscape',
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
    is_featured: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const result = await sql`SELECT * FROM portfolio_items ORDER BY display_order ASC`
    return result.rows.length > 0 ? (result.rows as PortfolioItem[]) : fallbackPortfolio
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return fallbackPortfolio
  }
}

export async function createPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioItem> {
  try {
    const result = await sql`
      INSERT INTO portfolio_items (title, description, category, image_url, is_featured, display_order)
      VALUES (${item.title}, ${item.description}, ${item.category}, ${item.image_url}, ${item.is_featured}, ${item.display_order})
      RETURNING *
    `
    revalidatePath('/marketing/portfolio')
    return result.rows[0] as PortfolioItem
  } catch (error) {
    console.error('Error creating portfolio item:', error)
    throw new Error((error as Error).message)
  }
}

export async function updatePortfolioItem(id: string, updates: Partial<PortfolioItem>) {
  try {
    await sql`
      UPDATE portfolio_items 
      SET 
        title = COALESCE(${updates.title}, title),
        description = COALESCE(${updates.description}, description),
        category = COALESCE(${updates.category}, category),
        image_url = COALESCE(${updates.image_url}, image_url),
        is_featured = COALESCE(${updates.is_featured}, is_featured),
        display_order = COALESCE(${updates.display_order}, display_order),
        updated_at = NOW()
      WHERE id = ${id}
    `
    revalidatePath('/marketing/portfolio')
  } catch (error) {
    console.error('Error updating portfolio item:', error)
    throw new Error((error as Error).message)
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    await sql`DELETE FROM portfolio_items WHERE id = ${id}`
    revalidatePath('/marketing/portfolio')
  } catch (error) {
    console.error('Error deleting portfolio item:', error)
    throw new Error((error as Error).message)
  }
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

const fallbackAbout: WebsiteAbout = {
  id: 'fallback',
  founder_name: 'Silvio L. Monzon',
  founder_image_url: null,
  founder_story: 'With Mexican roots and a humble hardworking background, Silvio L. Monzon founded Aménagement Monzon in 2014 with big dreams and determination. Starting with commercial cleaning, he scaled the business through landscape, hardscape, and construction to become the complete property partner owners trust.',
  mission_statement: 'To be the one trusted partner owners call to manage every aspect of their property—from routine maintenance to complete transformations—built on quality, integrity, and family values.',
  years_experience: 10,
  projects_completed: 300,
  updated_at: new Date().toISOString()
}

export async function getAboutContent(): Promise<WebsiteAbout> {
  try {
    const result = await sql`SELECT * FROM website_about LIMIT 1`
    return result.rows[0] ? (result.rows[0] as WebsiteAbout) : fallbackAbout
  } catch (error) {
    console.error('Error fetching about content:', error)
    return fallbackAbout
  }
}

export async function updateAboutContent(id: string, updates: Partial<WebsiteAbout>) {
  try {
    await sql`
      UPDATE website_about 
      SET 
        founder_name = COALESCE(${updates.founder_name}, founder_name),
        founder_image_url = COALESCE(${updates.founder_image_url}, founder_image_url),
        founder_story = COALESCE(${updates.founder_story}, founder_story),
        mission_statement = COALESCE(${updates.mission_statement}, mission_statement),
        years_experience = COALESCE(${updates.years_experience}, years_experience),
        projects_completed = COALESCE(${updates.projects_completed}, projects_completed),
        updated_at = NOW()
      WHERE id = ${id}
    `
    revalidatePath('/marketing')
    revalidatePath('/marketing/about')
  } catch (error) {
    console.error('Error updating about content:', error)
    throw new Error((error as Error).message)
  }
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

const fallbackReviews: Review[] = [
  {
    id: 'fallback-1',
    client_name: 'Jean-Pierre Tremblay',
    client_role: 'Homeowner',
    rating: 5,
    comment: 'Exceptional work quality and professionalism. The team transformed our backyard into a beautiful outdoor living space.',
    is_featured: true,
    is_approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'fallback-2',
    client_name: 'Marie-Claude Gagnon',
    client_role: 'Property Manager',
    rating: 5,
    comment: 'Reliable, punctual, and detail-oriented. Amenagement Monzon handles all our maintenance needs seamlessly.',
    is_featured: true,
    is_approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'fallback-3',
    client_name: 'Robert Lavoie',
    client_role: 'Real Estate Developer',
    rating: 5,
    comment: 'Perfect partner for renovation projects. Their design sense and execution are top-notch.',
    is_featured: true,
    is_approved: true,
    created_at: new Date().toISOString()
  }
]

export async function getReviews(onlyApproved = false): Promise<Review[]> {
  try {
    const result = onlyApproved 
      ? await sql`SELECT * FROM reviews WHERE is_approved = true ORDER BY created_at DESC`
      : await sql`SELECT * FROM reviews ORDER BY created_at DESC`
    return result.rows.length > 0 ? (result.rows as Review[]) : fallbackReviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return fallbackReviews
  }
}

export async function getFeaturedReviews(): Promise<Review[]> {
  try {
    const result = await sql`
      SELECT * FROM reviews 
      WHERE is_approved = true AND is_featured = true 
      ORDER BY created_at DESC 
      LIMIT 6
    `
    return result.rows.length > 0 ? (result.rows as Review[]) : fallbackReviews
  } catch (error) {
    console.error('Error fetching featured reviews:', error)
    return fallbackReviews
  }
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
  try {
    const result = await sql`
      INSERT INTO reviews (client_name, client_role, rating, comment, is_featured, is_approved)
      VALUES (${review.client_name}, ${review.client_role}, ${review.rating}, ${review.comment}, ${review.is_featured}, ${review.is_approved})
      RETURNING *
    `
    revalidatePath('/marketing')
    return result.rows[0] as Review
  } catch (error) {
    console.error('Error creating review:', error)
    throw new Error((error as Error).message)
  }
}

export async function updateReview(id: string, updates: Partial<Review>) {
  try {
    await sql`
      UPDATE reviews 
      SET 
        client_name = COALESCE(${updates.client_name}, client_name),
        client_role = COALESCE(${updates.client_role}, client_role),
        rating = COALESCE(${updates.rating}, rating),
        comment = COALESCE(${updates.comment}, comment),
        is_featured = COALESCE(${updates.is_featured}, is_featured),
        is_approved = COALESCE(${updates.is_approved}, is_approved)
      WHERE id = ${id}
    `
    revalidatePath('/marketing')
  } catch (error) {
    console.error('Error updating review:', error)
    throw new Error((error as Error).message)
  }
}

export async function deleteReview(id: string) {
  try {
    await sql`DELETE FROM reviews WHERE id = ${id}`
    revalidatePath('/marketing')
  } catch (error) {
    console.error('Error deleting review:', error)
    throw new Error((error as Error).message)
  }
}

// ============================================================
// MEDIA UPLOAD (Using Vercel Blob or external service)
// ============================================================

export async function uploadCMSMedia(file: File, folder: string = 'general'): Promise<string> {
  // For now, return a placeholder - you can integrate Vercel Blob later
  console.log('Media upload requested for:', file.name, 'in folder:', folder)
  return `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800`
}

export async function deleteCMSMedia(url: string) {
  console.log('Media delete requested for:', url)
  // Implement with Vercel Blob when ready
}
