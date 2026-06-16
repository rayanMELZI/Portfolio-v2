import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getContent, updateContent } from '@/lib/content'
import type { SiteContentData } from '@/app/data/content'

export async function GET() {
  try {
    const data = await getContent()
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  let body: { data?: SiteContentData }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  if (!body.data || typeof body.data !== 'object') {
    return NextResponse.json({ error: 'Données manquantes.' }, { status: 400 })
  }

  try {
    await updateContent(body.data)
    revalidatePath('/')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde.' }, { status: 500 })
  }
}
