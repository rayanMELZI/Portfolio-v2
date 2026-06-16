'use client'

import type { Lang } from '../data/content'
import { ui, type SiteContentData } from '../data/content'

interface AboutProps {
  data: SiteContentData
  lang: Lang
}

export default function About({ lang, data }: AboutProps) {
  const t = ui[lang]

  return (
    <section id="about" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: 'var(--accent-ink)' }}>04</span>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 600, letterSpacing: '-0.025em',
        }}>
          {t.aboutTitle}
        </h2>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1.15fr 0.85fr',
        gap: 18, alignItems: 'start',
      }}>
        {/* Education */}
        <div style={{
          border: '1px solid var(--line)', borderRadius: 18,
          background: 'var(--surface)', padding: '28px 30px',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11.5, letterSpacing: '.06em',
            color: 'var(--faint)', marginBottom: 14,
          }}>
            {t.education}
          </div>
          {data.education.map((ed, i) => (
            <div key={i} style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}>
              <div style={{
                display: 'flex', alignItems: 'baseline',
                justifyContent: 'space-between', gap: 14, marginBottom: 4,
              }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 16.5, fontWeight: 600, letterSpacing: '-0.01em',
                }}>
                  {ed.degree[lang]}
                </span>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11.5, color: 'var(--faint)', flexShrink: 0,
                }}>
                  {ed.period}
                </span>
              </div>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>{ed.org[lang]}</div>
            </div>
          ))}
        </div>

        {/* Right column: Languages + Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Languages */}
          <div style={{
            border: '1px solid var(--line)', borderRadius: 18,
            background: 'var(--surface)', padding: '24px 26px',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11.5, letterSpacing: '.06em',
              color: 'var(--faint)', marginBottom: 14,
            }}>
              {t.languages}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.languages.map((l, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'baseline',
                  justifyContent: 'space-between', gap: 12,
                }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{l.name[lang]}</span>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11.5, color: 'var(--muted)',
                  }}>
                    {l.level[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights / Awards */}
          <div style={{
            border: '1px solid var(--line)', borderRadius: 18,
            background: 'var(--surface)', padding: '24px 26px',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11.5, letterSpacing: '.06em',
              color: 'var(--faint)', marginBottom: 14,
            }}>
              {t.highlights}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {data.awards.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent-ink)', fontSize: 14, lineHeight: 1.5 }}>→</span>
                  <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--muted)' }}>{a[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
