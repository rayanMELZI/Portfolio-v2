import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'rm_admin_session'

const PUBLIC_PATHS = ['/admin/login', '/api/admin/login']

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = req.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return redirect(req)
  }

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? '')
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return redirect(req)
  }
}

function redirect(req: NextRequest) {
  const isApi = req.nextUrl.pathname.startsWith('/api/')
  if (isApi) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  return NextResponse.redirect(new URL('/admin/login', req.url))
}
