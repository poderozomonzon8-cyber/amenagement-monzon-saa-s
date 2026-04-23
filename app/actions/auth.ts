'use server'

import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'

export interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  created_at: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export async function signIn(email: string, password: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    
    // Find user by email
    const result = await sql`
      SELECT id, email, password_hash, role, first_name, last_name, created_at
      FROM users
      WHERE LOWER(email) = ${normalizedEmail}
    `

    if (!result.rows[0]) {
      return { error: 'Invalid email or password' }
    }

    const user = result.rows[0]
    
    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return { error: 'Invalid email or password' }
    }

    // Create session
    const cookieStore = await cookies()
    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    cookieStore.set('user_role', user.role, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    cookieStore.set('user_email', user.email, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    redirect('/dashboard')
  } catch (error: unknown) {
    // Re-throw redirect errors (Next.js uses exceptions for redirects)
    // In Next.js, redirect() throws an error with digest containing 'NEXT_REDIRECT'
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error
    }
    console.error('Sign in error:', error)
    return { error: 'Failed to sign in' }
  }
}

export async function signUp(email: string, password: string, role: 'admin' | 'employee' | 'client', firstName: string, lastName: string) {
  try {
    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE LOWER(email) = ${email.toLowerCase()}
    `

    if (existing.rows.length > 0) {
      return { error: 'Email already registered' }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES (${email.toLowerCase()}, ${passwordHash}, ${firstName}, ${lastName}, ${role})
      RETURNING id, email, first_name, last_name, role, created_at
    `

    if (!result.rows[0]) {
      return { error: 'Failed to create account' }
    }

    return { success: true, data: { user: result.rows[0] } }
  } catch (error) {
    console.error('Sign up error:', error)
    return { error: 'Failed to create account' }
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('user_id')
    cookieStore.delete('user_role')
    cookieStore.delete('user_email')
    redirect('/auth/login')
  } catch (error) {
    console.error('Sign out error:', error)
    redirect('/auth/login')
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) return null

    const result = await sql`
      SELECT id, email, first_name, last_name, role, created_at
      FROM users
      WHERE id = ${userId}
    `

    if (!result.rows[0]) return null

    return result.rows[0] as User
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// OAuth Sign In - handles Google and Apple
export async function oauthSignIn(
  provider: 'google' | 'apple',
  providerUserId: string,
  email: string,
  name?: string,
  imageUrl?: string
) {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    
    // Check if OAuth account exists
    const existingOAuth = await sql`
      SELECT u.id, u.email, u.role, u.first_name, u.last_name
      FROM oauth_accounts oa
      JOIN users u ON u.id = oa.user_id
      WHERE oa.provider = ${provider} AND oa.provider_user_id = ${providerUserId}
    `

    let user
    
    if (existingOAuth.rows.length > 0) {
      user = existingOAuth.rows[0]
    } else {
      // Check if user with email exists
      const existingUser = await sql`
        SELECT id, email, role, first_name, last_name FROM users WHERE LOWER(email) = ${normalizedEmail}
      `

      if (existingUser.rows.length > 0) {
        user = existingUser.rows[0]
        // Link OAuth account to existing user
        await sql`
          INSERT INTO oauth_accounts (user_id, provider, provider_user_id, email, name, image_url)
          VALUES (${user.id}, ${provider}, ${providerUserId}, ${email}, ${name || null}, ${imageUrl || null})
          ON CONFLICT (provider, provider_user_id) DO NOTHING
        `
      } else {
        // Create new user
        const nameParts = name?.split(' ') || []
        const firstName = nameParts[0] || null
        const lastName = nameParts.slice(1).join(' ') || null
        
        const newUser = await sql`
          INSERT INTO users (email, password_hash, first_name, last_name, role)
          VALUES (${normalizedEmail}, ${randomUUID()}, ${firstName}, ${lastName}, 'client')
          RETURNING id, email, role, first_name, last_name
        `
        user = newUser.rows[0]

        // Link OAuth account
        await sql`
          INSERT INTO oauth_accounts (user_id, provider, provider_user_id, email, name, image_url)
          VALUES (${user.id}, ${provider}, ${providerUserId}, ${email}, ${name || null}, ${imageUrl || null})
        `
      }
    }

    // Create session
    const cookieStore = await cookies()
    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    cookieStore.set('user_role', user.role, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return { success: true }
  } catch (error) {
    console.error('OAuth sign in error:', error)
    return { error: 'Failed to sign in with ' + provider }
  }
}

// Send magic link email
export async function sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    const token = randomUUID() + randomUUID().replace(/-/g, '')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await sql`
      INSERT INTO email_magic_links (email, token, expires_at)
      VALUES (${normalizedEmail}, ${token}, ${expiresAt.toISOString()})
    `

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}` || 'http://localhost:3000'
    const magicLinkUrl = `${baseUrl}/auth/magic-link?token=${token}`
    
    // For now, log the magic link (in production, send via email service)
    console.log('Magic link for', normalizedEmail, ':', magicLinkUrl)

    return { success: true }
  } catch (error) {
    console.error('Send magic link error:', error)
    return { success: false, error: 'Failed to send magic link' }
  }
}

// Verify magic link token
export async function verifyMagicLink(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sql`
      SELECT email, expires_at, used FROM email_magic_links
      WHERE token = ${token}
    `

    if (result.rows.length === 0) {
      return { success: false, error: 'Invalid or expired link' }
    }

    const link = result.rows[0]
    
    if (link.used) {
      return { success: false, error: 'This link has already been used' }
    }

    if (new Date(link.expires_at) < new Date()) {
      return { success: false, error: 'This link has expired' }
    }

    // Mark as used
    await sql`
      UPDATE email_magic_links SET used = true, used_at = NOW()
      WHERE token = ${token}
    `

    // Get or create user
    let user
    const existingUser = await sql`
      SELECT id, email, role, first_name, last_name FROM users WHERE LOWER(email) = ${link.email.toLowerCase()}
    `

    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0]
    } else {
      const newUser = await sql`
        INSERT INTO users (email, password_hash, role)
        VALUES (${link.email}, ${randomUUID()}, 'client')
        RETURNING id, email, role, first_name, last_name
      `
      user = newUser.rows[0]
    }

    // Create session
    const cookieStore = await cookies()
    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    cookieStore.set('user_role', user.role, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return { success: true }
  } catch (error) {
    console.error('Verify magic link error:', error)
    return { success: false, error: 'Failed to verify magic link' }
  }
}

// Create or update admin user with hashed password
export async function setupAdminUser(
  email: string, 
  password: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    const passwordHash = await bcrypt.hash(password, 12)

    await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES (${normalizedEmail}, ${passwordHash}, ${firstName}, ${lastName}, 'admin')
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = 'admin',
        updated_at = NOW()
    `

    return { success: true }
  } catch (error) {
    console.error('Setup admin error:', error)
    return { success: false, error: 'Failed to setup admin user' }
  }
}
