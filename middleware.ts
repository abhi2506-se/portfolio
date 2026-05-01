import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'portfolio_admin_session'

// Protected admin routes that require authentication
const PROTECTED_PATHS = ['/admin/dashboard']

function verifyToken(token: string): boolean {
  if (!token) return false
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const isExpired = Date.now() - decoded.ts > 24 * 60 * 60 * 1000
    if (isExpired) return false
    // Ensure ADMIN_USERNAME is properly defined and matches
    const adminUsername = process.env.ADMIN_USERNAME
    if (!adminUsername || typeof adminUsername !== 'string') return false
    return decoded.username === adminUsername
  } catch {
    return false
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if the path is protected
  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path))
  if (!isProtected) {
    return NextResponse.next()
  }

  // Check for session cookie
  const sessionCookie = req.cookies.get(SESSION_COOKIE)
  if (!sessionCookie?.value || !verifyToken(sessionCookie.value)) {
    // Redirect to login page
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}