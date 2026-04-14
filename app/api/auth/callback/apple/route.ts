import { NextResponse } from 'next/server'
import { oauthSignIn } from '@/app/actions/auth'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const code = formData.get('code') as string
    const idToken = formData.get('id_token') as string
    const userStr = formData.get('user') as string

    if (!code && !idToken) {
      return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
    }

    let email: string
    let name: string | undefined
    let providerUserId: string

    if (idToken) {
      // Decode the ID token (Apple sends this with response_mode=form_post)
      const decoded = jwt.decode(idToken) as { sub: string; email: string }
      providerUserId = decoded.sub
      email = decoded.email
    } else {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.APPLE_CLIENT_ID!,
          client_secret: process.env.APPLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`}/api/auth/callback/apple`,
          grant_type: 'authorization_code',
        }),
      })

      const tokens = await tokenResponse.json()

      if (!tokens.id_token) {
        console.error('Apple token error:', tokens)
        return NextResponse.redirect(new URL('/auth/login?error=token_failed', request.url))
      }

      const decoded = jwt.decode(tokens.id_token) as { sub: string; email: string }
      providerUserId = decoded.sub
      email = decoded.email
    }

    // Parse user info if provided (only sent on first sign-in)
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        name = `${user.name?.firstName || ''} ${user.name?.lastName || ''}`.trim()
      } catch {
        // Ignore parsing errors
      }
    }

    // Sign in or create user
    const result = await oauthSignIn('apple', providerUserId, email, name)

    if (result.error) {
      return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(result.error)}`, request.url))
    }

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Apple OAuth error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
  }
}

// Handle GET requests (some configurations redirect via GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/auth/login?error=oauth_cancelled', request.url))
  }

  return NextResponse.redirect(new URL('/auth/login?error=invalid_request', request.url))
}
