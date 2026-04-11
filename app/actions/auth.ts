'use server'

import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
    // Find user by email
    const result = await sql`
      SELECT id, email, password_hash, role, first_name, last_name, created_at
      FROM users
      WHERE email = ${email.toLowerCase()}
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

    redirect('/dashboard')
  } catch (error) {
    console.error('Sign in error:', error)
    return { error: 'Failed to sign in' }
  }
}

export async function signUp(email: string, password: string, role: 'admin' | 'employee' | 'client', firstName: string, lastName: string) {
  try {
    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `

    if (existing.rows.length > 0) {
      return { error: 'Email already registered' }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

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
