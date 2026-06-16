'use client'

import type { Lang } from '../data/content'
import { ui, type SiteContentData } from '../data/content'

interface ExperienceProps {
  data: SiteContentData
  lang: Lang
}

export default function Experience({ lang, data }: ExperienceProps) {
  const t = ui[lang]

  return (
    <section id="work" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: 'var(--accent-ink)' }}>03</span>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 600, letterSpacing: '-0.025em',
        }}>
          {t.expTitle}
        </h2>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {data.work.map((job, i) => (
          <div
            key={i}
            className="card-hover"
            style={{
              display: 'grid', gridTemplateColumns: '200px 1fr', gap: 36,
              border: '1px solid var(--line)', borderRadius: 18,
              background: 'var(--surface)', padding: '30px 32px',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 19, fontWeight: 600,
                letterSpacing: '-0.01em', marginBottom: 6,
              }}>
                {job.org}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11.5, color: 'var(--faint)', lineHeight: 1.6,
              }}>
                {job.period[lang]}<br />{job.place[lang]}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 16, fontWeight: 600,
                color: 'var(--accent-ink)', marginBottom: 10,
              }}>
                {job.role[lang]}
              </div>
              <p style={{
                fontSize: 15.5, lineHeight: 1.65,
                color: 'var(--muted)', marginBottom: 16, maxWidth: '48em',
              }}>
                {job.body[lang]}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11.5, color: 'var(--ink)',
                      background: 'var(--surface2)',
                      border: '1px solid var(--line)',
                      borderRadius: 7, padding: '5px 10px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
