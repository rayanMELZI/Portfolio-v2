'use client'

import type { Lang } from '../data/content'
import { ui, type SiteContentData } from '../data/content'

interface ProjectsProps {
  data: SiteContentData
  lang: Lang
}

export default function Projects({ lang, data }: ProjectsProps) {
  const t = ui[lang]
  const nums = ['01', '02', '03']

  return (
    <section id="projects" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: 'var(--accent-ink)' }}>02</span>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 600, letterSpacing: '-0.025em',
        }}>
          {t.projectsTitle}
        </h2>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {data.projects.map((p, i) => (
          <a
            key={i}
            href={p.link}
            target="_blank"
            className="card-hover"
            style={{
              display: 'flex', flexDirection: 'column',
              border: '1px solid var(--line)', borderRadius: 16,
              background: 'var(--surface)', padding: 24,
              boxShadow: 'var(--shadow)', minHeight: 188,
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11.5, color: 'var(--faint)',
              }}>
                {nums[i]}
              </span>
              <span style={{ color: 'var(--accent-ink)', fontSize: 15 }}>↗</span>
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18, fontWeight: 600,
              letterSpacing: '-0.01em', marginBottom: 9,
              color: 'var(--ink)',
            }}>
              {p.name}
            </div>
            <p style={{
              fontSize: 14, lineHeight: 1.6,
              color: 'var(--muted)', marginBottom: 16, flex: 1,
            }}>
              {p.desc[lang]}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11, color: 'var(--ink)',
                    background: 'var(--surface2)',
                    border: '1px solid var(--line)',
                    borderRadius: 7, padding: '4px 9px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
