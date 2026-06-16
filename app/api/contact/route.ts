import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// ─── In-memory rate limiter (reset on server restart — fine for a personal portfolio) ───
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3        // max 3 messages
const RATE_WINDOW = 3600000 // par heure (ms)

function checkRate(ip: string): boolean {
  const now = Date.now()
  const rec = rateMap.get(ip)
  if (!rec || rec.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (rec.count >= RATE_LIMIT) return false
  rec.count++
  return true
}

// ─── Email template ────────────────────────────────────────────────────────
function html(name: string, email: string, message: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><style>
  body{font-family:system-ui,sans-serif;background:#FAFAF7;margin:0;padding:40px 20px}
  .card{max-width:560px;margin:0 auto;background:#fff;border:1px solid #E7E5DC;border-radius:16px;overflow:hidden}
  .header{background:#171815;padding:28px 32px;display:flex;align-items:center;gap:12px}
  .logo{width:36px;height:36px;border-radius:9px;background:#2B50E0;display:inline-flex;align-items:center;justify-content:center;font-family:sans-serif;font-weight:700;font-size:13px;color:#fff;letter-spacing:-.02em}
  .title{color:#ECEDE8;font-size:16px;font-weight:600}
  .body{padding:28px 32px}
  .label{font-family:monospace;font-size:10.5px;color:#9A9B92;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
  .value{font-size:15px;color:#171815;margin-bottom:20px;line-height:1.5}
  .msg{background:#F3F2EC;border-radius:10px;padding:16px 18px;font-size:15px;color:#5E5F58;line-height:1.65;white-space:pre-wrap}
  .footer{padding:16px 32px;border-top:1px solid #E7E5DC;font-family:monospace;font-size:11px;color:#9A9B92}
</style></head>
<body>
  <div class="card">
    <div class="header">
      <span class="logo">RM</span>
      <span class="title">Nouveau message — Portfolio</span>
    </div>
    <div class="body">
      <div class="label">De</div>
      <div class="value">${name}</div>
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${email}" style="color:#2B50E0">${email}</a></div>
      <div class="label">Message</div>
      <div class="msg">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    </div>
    <div class="footer">Envoyé depuis rayanemelzi.dev · ${new Date().toLocaleString('fr-FR')}</div>
  </div>
</body>
</html>`
}

// ─── POST handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: 'Trop de messages. Réessayez dans une heure.' },
      { status: 429 }
    )
  }

  // 2. Parse body
  let body: { name?: string; email?: string; message?: string; honey?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const { name, email, message, honey } = body

  // 3. Honeypot anti-spam (champ caché — les bots le remplissent, les humains non)
  if (honey) {
    // Faire semblant d'avoir réussi pour ne pas alerter le bot
    return NextResponse.json({ ok: true })
  }

  // 4. Validation
  const nameT = name?.trim() ?? ''
  const emailT = email?.trim() ?? ''
  const msgT = message?.trim() ?? ''

  if (!nameT || !emailT || !msgT) {
    return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
  }
  if (nameT.length < 2 || nameT.length > 100) {
    return NextResponse.json({ error: 'Nom invalide.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailT)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
  }
  if (msgT.length < 10 || msgT.length > 4000) {
    return NextResponse.json({ error: 'Message trop court ou trop long.' }, { status: 400 })
  }

  // 5. Vérifier que les variables d'environnement sont configurées
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL) {
    console.error('[contact] Variables SMTP manquantes dans .env.local')
    return NextResponse.json(
      { error: 'Le serveur email n\'est pas configuré. Contactez directement rayanmelzi@outlook.com' },
      { status: 503 }
    )
  }

  // 6. Envoyer l'email via Nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: SMTP_PORT === '465',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    await transporter.sendMail({
      from: `"Portfolio Rayane" <${SMTP_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: `"${nameT}" <${emailT}>`,
      subject: `[Portfolio] Message de ${nameT}`,
      text: `De : ${nameT} <${emailT}>\n\n${msgT}`,
      html: html(nameT, emailT, msgT),
    })

    console.log(`[contact] Email envoyé de ${emailT}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Erreur nodemailer:', err)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi. Réessayez ou contactez directement rayanmelzi@outlook.com' },
      { status: 500 }
    )
  }
}
