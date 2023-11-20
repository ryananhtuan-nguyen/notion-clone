import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  console.log(req.url, 'Req Url LINE 10 middleware')
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(
        new URL('/login', process.env.NEXT_PUBLIC_SITE_URL)
      )
    }
  }

  const emailLinkError = 'Email link is invalid or has expired'
  if (
    req.nextUrl.searchParams.get('error_description') === emailLinkError &&
    req.nextUrl.pathname !== '/signup'
  ) {
    return NextResponse.redirect(
      new URL(
        `/signup?error_description=${req.nextUrl.searchParams.get(
          'error_description'
        )}`,
        process.env.NEXT_PUBLIC_SITE_URL
      )
    )
  }

  if (['/login', '/signup'].includes(req.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(
        new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL)
      )
    }
  }
  return res
}
