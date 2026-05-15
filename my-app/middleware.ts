import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('dashboard_session')
  const { pathname } = request.nextUrl

  const publicRoutes = ['/', '/login']
  const isPublic = publicRoutes.includes(pathname)

  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)']
}