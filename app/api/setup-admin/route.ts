import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'

// This endpoint sets up the initial admin user
// In production, this should be removed or protected
export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, secretKey } = await request.json()
    
    // Simple protection - require a secret key
    if (secretKey !== process.env.ADMIN_SETUP_KEY && secretKey !== 'monzon-setup-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    return NextResponse.json({ success: true, message: 'Admin user created/updated' })
  } catch (error) {
    console.error('Setup admin error:', error)
    return NextResponse.json({ error: 'Failed to setup admin' }, { status: 500 })
  }
}
