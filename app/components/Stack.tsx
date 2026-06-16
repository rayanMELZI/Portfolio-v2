'use client'

import type { Lang } from '../data/content'
import { ui, type SiteContentData } from '../data/content'

interface StackProps {
  data: SiteContentData
  lang: Lang
}

export default function Stack({ lang, data }: StackProps) {
  const t = ui[lang]

  return (
    <section id="stack" style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: 'var(--accent-ink)' }}>01</span>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 600, letterSpacing: '-0.025em',
        }}>
          {t.stackTitle}
        </h2>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {data.stack.map((g, i) => (
          <div
            key={i}
            style={{
              border: '1px solid var(--line)', borderRadius: 16,
              background: 'var(--surface)', padding: 24,
              boxShadow: 'var(--shadow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12.5, letterSpacing: '.05em',
                color: 'var(--ink)', fontWeight: 500,
              }}>
                {g.title[lang]}
              </span>
              {g.tag[lang] && (
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10.5, color: 'var(--accent-ink)',
                  background: 'var(--soft)', borderRadius: 999, padding: '3px 9px',
                }}>
                  {g.tag[lang]}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {g.items.map((item) => (
                <span
                  key={item}
                  style={{
                    fontSize: 13.5, color: 'var(--muted)',
                    background: 'var(--surface2)',
                    border: '1px solid var(--line)',
                    borderRadius: 8, padding: '6px 11px',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
