import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSessionToken, COOKIE_NAME } from '@/lib/auth'

// Rate-limit en mémoire : 5 tentatives / 15 min par IP
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX = 5
const WINDOW = 900_000

function checkRate(ip: string): boolean {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || rec.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW })
    return true
  }
  if (rec.count >= MAX) return false
  rec.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
      { status: 429 }
    )
  }

  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const ok = await verifyPassword(body.password ?? '')
  if (!ok) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  }

  const token = await createSessionToken()
  const isProd = process.env.NODE_ENV === 'production'

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  })
  return res
}
