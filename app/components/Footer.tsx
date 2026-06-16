'use client'

import type { Lang } from '../data/content'
import { ui } from '../data/content'

interface FooterProps {
  lang: Lang
}

export default function Footer({ lang }: FooterProps) {
  const t = ui[lang]

  return (
    <footer style={{
      maxWidth: 1080, margin: '0 auto',
      padding: '32px 28px 48px',
      borderTop: '1px solid var(--line)',
      marginTop: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11.5, color: 'var(--faint)',
      }}>
        {t.footer}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <span style={{
          position: 'relative', width: 26, height: 26, borderRadius: 7,
          background: 'var(--ink)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600, fontSize: 10.5,
            color: 'var(--bg)', letterSpacing: '-0.03em',
          }}>RM</span>
          <span style={{
            position: 'absolute', right: -2, bottom: -2,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--accent)', border: '1.5px solid var(--bg)',
          }} />
        </span>
      </div>
    </footer>
  )
}
