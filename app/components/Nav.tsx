'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import type { Lang } from '../data/content'
import { ui } from '../data/content'

interface NavProps {
  lang: Lang
  setLang: (l: Lang) => void
}

export default function Nav({ lang, setLang }: NavProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = ui[lang]

  useEffect(() => setMounted(true), [])

  const isDark = mounted && theme === 'dark'

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'saturate(180%) blur(14px)',
      background: 'color-mix(in srgb, var(--bg) 82%, transparent)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto', padding: '13px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
      }}>
        {/* Logo */}
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{
            position: 'relative', width: 34, height: 34, borderRadius: 9,
            background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14,
              color: 'var(--bg)', letterSpacing: '-0.03em',
            }}>RM</span>
            <span style={{
              position: 'absolute', right: -3, bottom: -3, width: 9, height: 9,
              borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)',
            }} />
          </span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
            fontSize: 15.5, letterSpacing: '-0.01em',
          }}>
            Rayane <span style={{ fontWeight: 700 }}>MELZI</span>
          </span>
        </a>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="#projects" className="nav-link">{t.navProjects}</a>
          <a href="#work" className="nav-link">{t.navExp}</a>
          <a href="#about" className="nav-link">{t.navAbout}</a>

          {/* Lang toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', background: 'var(--surface2)',
            border: '1px solid var(--line)', borderRadius: 9, padding: 2,
          }}>
            {(['fr', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 500,
                  padding: '4px 9px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: lang === l ? 'var(--surface)' : 'transparent',
                  color: lang === l ? 'var(--ink)' : 'var(--faint)',
                  boxShadow: lang === l ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                  transition: 'all .18s',
                  letterSpacing: '.04em',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label="toggle theme"
            style={{
              width: 34, height: 34, borderRadius: 9, border: '1px solid var(--line)',
              background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer',
              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color .18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
          >
            {mounted ? (isDark ? '☀' : '☾') : '☾'}
          </button>

          {/* CV button */}
          <a
            href="/CV_dev.pdf"
              download="CV_Rayane_MELZI.pdf"
            target="_blank"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 500,
              color: 'var(--ink)', background: 'var(--surface)',
              border: '1px solid var(--line)', borderRadius: 9, padding: '8px 13px',
              transition: 'border-color .18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
          >
            {t.resume} ↓
          </a>

          {/* Contact button */}
          <a
            href="#contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontSize: 13.5, fontWeight: 600, color: '#fff',
              background: 'var(--accent)', borderRadius: 9, padding: '9px 16px',
              transition: 'filter .18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
            onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
          >
            {t.navContact}
          </a>
        </div>
      </div>
    </nav>
  )
}
