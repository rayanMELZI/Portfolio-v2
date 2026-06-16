'use client'

import { useState, useRef } from 'react'
import type { Lang } from '../data/content'
import { ui, type SiteContentData } from '../data/content'

interface ContactProps {
  data: SiteContentData
  lang: Lang
}

export default function Contact({ lang, data }: ContactProps) {
  const t = ui[lang]
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [error, setError] = useState('')
  // Honeypot ref — champ caché pour bloquer les bots
  const honeyRef = useRef<HTMLInputElement>(null)

  const copyEmail = () => {
    navigator.clipboard.writeText(data.contact.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSubmit = async () => {
    // Validation côté client
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(lang === 'fr' ? 'Tous les champs sont requis.' : 'All fields are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(lang === 'fr' ? 'Adresse email invalide.' : 'Invalid email address.')
      return
    }

    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          honey: honeyRef.current?.value ?? '', // anti-bot
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? (lang === 'fr' ? 'Erreur serveur. Réessayez.' : 'Server error. Try again.'))
        setSending(false)
        return
      }

      setSent(true)
    } catch {
      setError(
        lang === 'fr'
          ? 'Connexion impossible. Vérifiez votre réseau.'
          : 'Connection failed. Check your network.'
      )
      setSending(false)
    }
  }

  return (
    <section id="contact" style={{ maxWidth: 1080, margin: '0 auto', padding: '60px 28px 44px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'stretch' }}>

        {/* ── Panneau gauche ── */}
        <div style={{
          border: '1px solid var(--line)', borderRadius: 22,
          background: 'var(--surface2)', padding: '40px 38px',
          boxShadow: 'var(--shadow)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12.5, letterSpacing: '.12em',
            color: 'var(--accent-ink)', marginBottom: 18,
          }}>
            {t.contactKicker}
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(28px, 3.6vw, 42px)',
            lineHeight: 1.04, letterSpacing: '-0.03em',
            fontWeight: 600, marginBottom: 18,
            whiteSpace: 'pre-line',
          }}>
            {t.contactTitle}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--muted)', marginBottom: 26 }}>
            {t.contactBody}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {/* Copier l'email */}
            <button
              onClick={copyEmail}
              style={{
                display: 'inline-flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 11,
                background: 'var(--surface)', color: 'var(--ink)',
                border: '1px solid var(--line)', borderRadius: 12,
                padding: '13px 16px', cursor: 'pointer',
                transition: 'border-color .18s', width: '100%',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5 }}>
                {data.contact.email}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--accent-ink)' }}>
                {copied ? t.copiedLabel : t.copyLabel}
              </span>
            </button>

            {/* Liens sociaux */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: 6 }}>
              <a href={data.contact.github} target="_blank" rel="noopener noreferrer" className="contact-link">GitHub</a>
              <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
              <a href={data.contact.site} target="_blank" rel="noopener noreferrer" className="contact-link">{t.siteLabel}</a>
            </div>
          </div>
        </div>

        {/* ── Panneau droit — formulaire ── */}
        <div style={{
          border: '1px solid var(--line)', borderRadius: 22,
          background: 'var(--surface)', padding: '34px 32px',
          boxShadow: 'var(--shadow)',
        }}>
          {sent ? (
            /* ── État succès ── */
            <div style={{
              height: '100%', minHeight: 340,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', gap: 14,
            }}>
              <div style={{
                width: 54, height: 54, borderRadius: '50%',
                background: 'var(--soft)', color: 'var(--accent-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                ✓
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600 }}>
                {t.sentTitle}
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: '24em', lineHeight: 1.6 }}>
                {t.sentBody}
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                style={{
                  marginTop: 8, fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12, color: 'var(--muted)', background: 'none',
                  border: '1px solid var(--line)', borderRadius: 8,
                  padding: '7px 14px', cursor: 'pointer',
                }}
              >
                {lang === 'fr' ? '← Envoyer un autre message' : '← Send another message'}
              </button>
            </div>
          ) : (
            /* ── Formulaire ── */
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                {t.formTitle}
              </div>

              {/* Honeypot — caché aux humains, les bots le remplissent */}
              <input
                ref={honeyRef}
                type="text"
                tabIndex={-1}
                aria-hidden="true"
                style={{ position: 'absolute', left: -9999, opacity: 0, pointerEvents: 'none' }}
                autoComplete="off"
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  className="fld"
                  placeholder={t.formName}
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoComplete="name"
                />
                <input
                  className="fld"
                  type="email"
                  placeholder={t.formEmail}
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoComplete="email"
                />
                <textarea
                  className="fld"
                  placeholder={t.formMsg}
                  rows={5}
                  value={form.message}
                  onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setError('') }}
                  style={{ resize: 'vertical' }}
                />

                {error && (
                  <div style={{
                    fontSize: 13, color: '#D14343',
                    fontFamily: "'IBM Plex Mono', monospace",
                    background: 'color-mix(in srgb, #D14343 8%, transparent)',
                    border: '1px solid color-mix(in srgb, #D14343 25%, transparent)',
                    borderRadius: 8, padding: '9px 12px',
                  }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, background: 'var(--accent)', color: '#fff',
                    fontWeight: 600, fontSize: 15, borderRadius: 11,
                    padding: '13px 22px', border: 'none',
                    cursor: sending ? 'wait' : 'pointer',
                    opacity: sending ? 0.75 : 1,
                    transition: 'filter .18s, opacity .18s',
                    marginTop: 4,
                  }}
                  onMouseEnter={e => !sending && (e.currentTarget.style.filter = 'brightness(1.08)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                >
                  {sending ? (
                    <>
                      <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                      {t.formSending}
                    </>
                  ) : (
                    <>{t.formSend} →</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </section>
  )
}
