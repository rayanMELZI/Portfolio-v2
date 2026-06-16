import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export async function POST(req: NextRequest) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Blob non configuré (BLOB_READ_WRITE_TOKEN manquant).' }, { status: 503 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Format non supporté. JPG, PNG, WebP ou AVIF uniquement.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 5 Mo).' }, { status: 400 })
  }

  try {
    const blob = await put(`profile/${Date.now()}-${file.name}`, file, {
      access: 'public',
      token,
    })
    return NextResponse.json({ url: blob.url })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l\'upload.' }, { status: 500 })
  }
}
