'use client'

import { ui, type Lang, type SiteContentData } from '../data/content'

interface HeroProps {
  data: SiteContentData
  lang: Lang
}

export default function Hero({ lang, data }: HeroProps) {
  const t = ui[lang]
  const p = data.profile
  const photo = p.photo // URL de la photo, gérée depuis l'admin

  return (
    <header id="top" style={{ maxWidth: 1080, margin: '0 auto', padding: '78px 28px 58px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 0.72fr',
        gap: 54,
        alignItems: 'center',
      }}>
        {/* Left col */}
        <div>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12.5, letterSpacing: '.13em',
              color: 'var(--accent-ink)', fontWeight: 500,
            }}>
              {p.roleTag[lang].toUpperCase()} · {p.roleSub[lang].toUpperCase()} — LYON
            </span>
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(52px, 7.6vw, 98px)',
            lineHeight: 0.9, letterSpacing: '-0.04em',
            fontWeight: 500, marginBottom: 18,
          }}>
            {p.name}
            <br />
            <span style={{ fontWeight: 700 }}>{p.family}</span>
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h1>

          {/* Availability pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            marginBottom: 26, padding: '6px 13px',
            border: '1px solid var(--line)', borderRadius: 999,
            background: 'var(--surface)',
          }}>
            <span className="avail-dot" />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12, color: 'var(--muted)',
            }}>
              {p.avail[lang]}
            </span>
          </div>

          {/* Lead */}
          <p style={{
            fontSize: 'clamp(18px, 2.1vw, 22px)', lineHeight: 1.5,
            color: 'var(--ink)', maxWidth: '25em',
            marginBottom: 18, fontWeight: 500,
          }}>
            {p.lead[lang]}
          </p>

          {/* Intro */}
          <p style={{
            fontSize: 16, lineHeight: 1.65,
            color: 'var(--muted)', maxWidth: '35em',
            marginBottom: 34,
          }}>
            {p.intro[lang]}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="#projects"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                background: 'var(--accent)', color: '#fff',
                fontWeight: 600, fontSize: 15,
                borderRadius: 11, padding: '13px 22px',
                transition: 'filter .18s',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
            >
              {t.viewWork} <span>→</span>
            </a>
            <a
              href={data.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontWeight: 600, fontSize: 15,
                border: '1px solid var(--line)', borderRadius: 11,
                padding: '13px 20px', background: 'var(--surface)', color: 'var(--ink)',
                transition: 'border-color .18s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              GitHub
            </a>
            <a
              href={data.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontWeight: 600, fontSize: 15,
                border: '1px solid var(--line)', borderRadius: 11,
                padding: '13px 20px', background: 'var(--surface)', color: 'var(--ink)',
                transition: 'border-color .18s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Profile card */}
        <div style={{
          border: '1px solid var(--line)', borderRadius: 20,
          background: 'var(--surface)', boxShadow: 'var(--shadow)',
          overflow: 'hidden',
        }}>
          {/* Photo area — only shown if photo is set */}
          {photo ? (
            <div style={{ position: 'relative', height: 248, overflow: 'hidden', background: 'var(--surface2)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={`${p.name} ${p.family}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : (
            // No photo: compact initials banner, visually clean
            <div style={{
              height: 120, background: 'var(--surface2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 24, fontWeight: 700, color: 'var(--faint)',
                letterSpacing: '-0.02em',
              }}>
                RM
              </div>
            </div>
          )}

          {/* Card info */}
          <div style={{ padding: '20px 22px 22px' }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 21, fontWeight: 600,
              letterSpacing: '-0.015em', lineHeight: 1.05,
              marginBottom: 5,
            }}>
              {p.name} <span style={{ fontWeight: 700 }}>{p.family}</span>
            </div>
            <div style={{
              fontSize: 14, color: 'var(--accent-ink)',
              fontWeight: 600, marginBottom: 16,
            }}>
              {p.roleTag[lang]}
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column',
              gap: 1, borderTop: '1px solid var(--line)',
            }}>
              {data.glance.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'baseline',
                    justifyContent: 'space-between', gap: 14,
                    padding: '11px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10.5, letterSpacing: '.06em', color: 'var(--faint)',
                  }}>
                    {row.k[lang]}
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, textAlign: 'right' }}>
                    {row.v[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
