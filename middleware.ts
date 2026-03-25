import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(_request: NextRequest) {
  // Cache buster: Pass-through middleware - auth handled at page level
  // Forces rebuild and clears stale error logs
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
