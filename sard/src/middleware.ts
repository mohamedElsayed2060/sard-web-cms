import { NextResponse } from 'next/server'

export function middleware(req: any) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/en'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
