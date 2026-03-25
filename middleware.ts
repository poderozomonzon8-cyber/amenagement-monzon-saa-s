import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Simple middleware that allows all requests through
  // Auth is handled at the page level in app/page.tsx
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
