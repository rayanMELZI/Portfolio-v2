'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { content as DEFAULTS, type SiteContentData } from '../data/content'

// ─── Mini field components ───────────────────────────────────────────────────
function Field({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--faint)', letterSpacing: '.06em' }}>
        {label.toUpperCase()}
      </label>
      <input
        style={{
          width: '100%', background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 9, padding: '9px 12px', fontSize: 13.5, color: 'var(--ink)',
          outline: 'none', fontFamily: "'Public Sans', sans-serif",
        }}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function BiField({ label, fr, en, onFr, onEn, multiline = false }: {
  label: string; fr: string; en: string
  onFr: (v: string) => void; onEn: (v: string) => void; multiline?: boolean
}) {
  const iStyle: React.CSSProperties = {
    flex: 1, width: '100%', background: 'var(--surface)', border: '1px solid var(--line)',
    borderRadius: 9, padding: '9px 12px', fontSize: 13.5, color: 'var(--ink)',
    outline: 'none', fontFamily: "'Public Sans', sans-serif",
    resize: multiline ? 'vertical' : undefined,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--faint)', letterSpacing: '.06em' }}>
        {label.toUpperCase()}
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, color: 'var(--faint)', fontFamily: "'IBM Plex Mono',monospace" }}>FR</span>
          {multiline
            ? <textarea style={iStyle} rows={3} value={fr} onChange={e => onFr(e.target.value)} />
            : <input style={iStyle} value={fr} onChange={e => onFr(e.target.value)} />}
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, color: 'var(--faint)', fontFamily: "'IBM Plex Mono',monospace" }}>EN</span>
          {multiline
            ? <textarea style={iStyle} rows={3} value={en} onChange={e => onEn(e.target.value)} />
            : <input style={iStyle} value={en} onChange={e => onEn(e.target.value)} />}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24, marginTop: 24 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--ink)' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  )
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '9px', border: '1px dashed var(--line)',
      borderRadius: 9, background: 'transparent', color: 'var(--muted)',
      fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 4,
    }}>
      + {label}
    </button>
  )
}

function Card({ children, onDel }: { children: React.ReactNode; onDel: () => void }) {
  return (
    <div style={{
      border: '1px solid var(--line)', borderRadius: 12,
      background: 'var(--surface2)', padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onDel} style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
          color: '#D14343', background: 'none', border: 'none', cursor: 'pointer',
        }}>
          ✕ Supprimer
        </button>
      </div>
      {children}
    </div>
  )
}

// ─── Uploader de photo de profil ─────────────────────────────────────────────
function PhotoUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  const handleFile = async (file: File) => {
    setUploading(true)
    setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) { setErr(json.error ?? 'Échec.'); setUploading(false); return }
      onChange(json.url)
    } catch {
      setErr('Erreur de connexion.')
    }
    setUploading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--faint)', letterSpacing: '.06em' }}>
        PHOTO DE PROFIL
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Aperçu */}
        <div style={{
          width: 64, height: 64, borderRadius: 12, overflow: 'hidden',
          background: 'var(--surface2)', border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--faint)' }}>RM</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: 13, fontWeight: 600, cursor: uploading ? 'wait' : 'pointer',
            background: 'var(--surface)', color: 'var(--ink)',
            border: '1px solid var(--line)', borderRadius: 9, padding: '8px 13px',
            opacity: uploading ? 0.7 : 1, width: 'fit-content',
          }}>
            {uploading ? 'Upload…' : (value ? 'Changer la photo' : 'Choisir une image')}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              style={{ display: 'none' }}
              disabled={uploading}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
          </label>
          {value && (
            <button
              onClick={() => onChange('')}
              style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#D14343', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
            >
              Retirer la photo
            </button>
          )}
        </div>
      </div>
      {err && <span style={{ fontSize: 12, color: '#D14343' }}>{err}</span>}
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--faint)' }}>
        JPG, PNG, WebP ou AVIF · max 5 Mo · n'oublie pas d'Enregistrer après.
      </span>
    </div>
  )
}

// ─── Main admin editor ───────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Tout le contenu, dans un seul état
  const [c, setC] = useState<SiteContentData>(() => JSON.parse(JSON.stringify(DEFAULTS)))

  // Helpers de mise à jour immuables
  const set = useCallback(<K extends keyof SiteContentData>(key: K, value: SiteContentData[K]) => {
    setC(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  useEffect(() => {
    const t = (localStorage.getItem('rm-theme') as 'light' | 'dark') || 'light'
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)

    // Charge le contenu depuis la BD (API protégée)
    fetch('/api/admin/content')
      .then(res => {
        if (res.status === 401) { router.push('/admin/login'); return null }
        return res.json()
      })
      .then(json => {
        if (json?.data) setC(json.data)
        setLoading(false)
      })
      .catch(() => { setError('Impossible de charger le contenu.'); setLoading(false) })
  }, [router])

  const applyTheme = (t: 'light' | 'dark') => {
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('rm-theme', t)
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: c }),
      })
      if (res.status === 401) { router.push('/admin/login'); return }
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Erreur.'); setSaving(false); return }
      setSaved(true)
      setSaving(false)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Erreur de connexion.')
      setSaving(false)
    }
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13 }}>
        Chargement du contenu…
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Nav admin */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'saturate(180%) blur(14px)',
        background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '11px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ position: 'relative', width: 28, height: 28, borderRadius: 7, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 11, color: 'var(--bg)', letterSpacing: '-.03em' }}>RM</span>
              <span style={{ position: 'absolute', right: -2, bottom: -2, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', border: '1.5px solid var(--bg)' }} />
            </span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 14 }}>Éditeur de contenu</span>
            {saved && <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#16A34A', marginLeft: 8 }}>Enregistré ✓</span>}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', fontSize: 13 }}>
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <a href="/" target="_blank" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, fontWeight: 500,
              color: 'var(--ink)', background: 'var(--surface)',
              border: '1px solid var(--line)', borderRadius: 8, padding: '6px 11px',
            }}>
              Voir le site ↗
            </a>
            <button onClick={logout} style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5,
              color: 'var(--muted)', background: 'none',
              border: '1px solid var(--line)', borderRadius: 8,
              padding: '6px 11px', cursor: 'pointer',
            }}>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* ── PROFIL ── */}
        <Section title="Profil">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Prénom" value={c.profile.name} onChange={v => set('profile', { ...c.profile, name: v })} />
            <Field label="Nom de famille" value={c.profile.family} onChange={v => set('profile', { ...c.profile, family: v })} />
          </div>
          <BiField label="Rôle principal" fr={c.profile.roleTag.fr} en={c.profile.roleTag.en}
            onFr={v => set('profile', { ...c.profile, roleTag: { ...c.profile.roleTag, fr: v } })}
            onEn={v => set('profile', { ...c.profile, roleTag: { ...c.profile.roleTag, en: v } })} />
          <BiField label="Sous-titre (DevOps…)" fr={c.profile.roleSub.fr} en={c.profile.roleSub.en}
            onFr={v => set('profile', { ...c.profile, roleSub: { ...c.profile.roleSub, fr: v } })}
            onEn={v => set('profile', { ...c.profile, roleSub: { ...c.profile.roleSub, en: v } })} />
          <BiField label="Disponibilité (pill)" fr={c.profile.avail.fr} en={c.profile.avail.en}
            onFr={v => set('profile', { ...c.profile, avail: { ...c.profile.avail, fr: v } })}
            onEn={v => set('profile', { ...c.profile, avail: { ...c.profile.avail, en: v } })} />
          <BiField label="Accroche (lead)" fr={c.profile.lead.fr} en={c.profile.lead.en} multiline
            onFr={v => set('profile', { ...c.profile, lead: { ...c.profile.lead, fr: v } })}
            onEn={v => set('profile', { ...c.profile, lead: { ...c.profile.lead, en: v } })} />
          <BiField label="Introduction" fr={c.profile.intro.fr} en={c.profile.intro.en} multiline
            onFr={v => set('profile', { ...c.profile, intro: { ...c.profile.intro, fr: v } })}
            onEn={v => set('profile', { ...c.profile, intro: { ...c.profile.intro, en: v } })} />
          <PhotoUploader
            value={c.profile.photo}
            onChange={url => set('profile', { ...c.profile, photo: url })}
          />
        </Section>

        {/* ── CONTACT ── */}
        <Section title="Contact & réseaux">
          <Field label="Email" value={c.contact.email} onChange={v => set('contact', { ...c.contact, email: v })} />
          <Field label="GitHub URL" value={c.contact.github} onChange={v => set('contact', { ...c.contact, github: v })} />
          <Field label="LinkedIn URL" value={c.contact.linkedin} onChange={v => set('contact', { ...c.contact, linkedin: v })} />
          <Field label="Site web URL" value={c.contact.site} onChange={v => set('contact', { ...c.contact, site: v })} />
        </Section>

        {/* ── PROJETS ── */}
        <Section title="Projets">
          {c.projects.map((p, i) => (
            <Card key={i} onDel={() => set('projects', c.projects.filter((_, j) => j !== i))}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 8 }}>
                <Field label="Nom du projet" value={p.name} onChange={v => set('projects', c.projects.map((x, j) => j === i ? { ...x, name: v } : x))} />
                <Field label="Lien (URL)" value={p.link} onChange={v => set('projects', c.projects.map((x, j) => j === i ? { ...x, link: v } : x))} />
              </div>
              <Field label="Tags (séparés par virgule)" value={p.tags.join(', ')}
                onChange={v => set('projects', c.projects.map((x, j) => j === i ? { ...x, tags: v.split(',').map(s => s.trim()).filter(Boolean) } : x))} />
              <BiField label="Description" fr={p.desc.fr} en={p.desc.en} multiline
                onFr={v => set('projects', c.projects.map((x, j) => j === i ? { ...x, desc: { ...x.desc, fr: v } } : x))}
                onEn={v => set('projects', c.projects.map((x, j) => j === i ? { ...x, desc: { ...x.desc, en: v } } : x))} />
            </Card>
          ))}
          <AddBtn label="Ajouter un projet" onClick={() => set('projects', [...c.projects, { name: 'Nouveau projet', link: '#', tags: [], desc: { fr: '', en: '' } }])} />
        </Section>

        {/* ── EXPÉRIENCE ── */}
        <Section title="Expérience professionnelle">
          {c.work.map((w, i) => (
            <Card key={i} onDel={() => set('work', c.work.filter((_, j) => j !== i))}>
              <Field label="Entreprise / Organisation" value={w.org} onChange={v => set('work', c.work.map((x, j) => j === i ? { ...x, org: v } : x))} />
              <BiField label="Poste" fr={w.role.fr} en={w.role.en}
                onFr={v => set('work', c.work.map((x, j) => j === i ? { ...x, role: { ...x.role, fr: v } } : x))}
                onEn={v => set('work', c.work.map((x, j) => j === i ? { ...x, role: { ...x.role, en: v } } : x))} />
              <BiField label="Période" fr={w.period.fr} en={w.period.en}
                onFr={v => set('work', c.work.map((x, j) => j === i ? { ...x, period: { ...x.period, fr: v } } : x))}
                onEn={v => set('work', c.work.map((x, j) => j === i ? { ...x, period: { ...x.period, en: v } } : x))} />
              <BiField label="Lieu" fr={w.place.fr} en={w.place.en}
                onFr={v => set('work', c.work.map((x, j) => j === i ? { ...x, place: { ...x.place, fr: v } } : x))}
                onEn={v => set('work', c.work.map((x, j) => j === i ? { ...x, place: { ...x.place, en: v } } : x))} />
              <BiField label="Description" fr={w.body.fr} en={w.body.en} multiline
                onFr={v => set('work', c.work.map((x, j) => j === i ? { ...x, body: { ...x.body, fr: v } } : x))}
                onEn={v => set('work', c.work.map((x, j) => j === i ? { ...x, body: { ...x.body, en: v } } : x))} />
              <Field label="Tags (virgule)" value={w.tags.join(', ')}
                onChange={v => set('work', c.work.map((x, j) => j === i ? { ...x, tags: v.split(',').map(s => s.trim()).filter(Boolean) } : x))} />
            </Card>
          ))}
          <AddBtn label="Ajouter une expérience" onClick={() => set('work', [...c.work, { org: 'Entreprise', role: { fr: '', en: '' }, period: { fr: '', en: '' }, place: { fr: '', en: '' }, tags: [], body: { fr: '', en: '' } }])} />
        </Section>

        {/* ── FORMATION ── */}
        <Section title="Formation">
          {c.education.map((ed, i) => (
            <Card key={i} onDel={() => set('education', c.education.filter((_, j) => j !== i))}>
              <BiField label="Diplôme" fr={ed.degree.fr} en={ed.degree.en}
                onFr={v => set('education', c.education.map((x, j) => j === i ? { ...x, degree: { ...x.degree, fr: v } } : x))}
                onEn={v => set('education', c.education.map((x, j) => j === i ? { ...x, degree: { ...x.degree, en: v } } : x))} />
              <BiField label="École / Université" fr={ed.org.fr} en={ed.org.en}
                onFr={v => set('education', c.education.map((x, j) => j === i ? { ...x, org: { ...x.org, fr: v } } : x))}
                onEn={v => set('education', c.education.map((x, j) => j === i ? { ...x, org: { ...x.org, en: v } } : x))} />
              <Field label="Période" value={ed.period}
                onChange={v => set('education', c.education.map((x, j) => j === i ? { ...x, period: v } : x))} />
            </Card>
          ))}
          <AddBtn label="Ajouter une formation" onClick={() => set('education', [...c.education, { degree: { fr: '', en: '' }, org: { fr: '', en: '' }, period: '' }])} />
        </Section>

        {/* ── LANGUES ── */}
        <Section title="Langues">
          {c.languages.map((l, i) => (
            <Card key={i} onDel={() => set('languages', c.languages.filter((_, j) => j !== i))}>
              <BiField label="Langue" fr={l.name.fr} en={l.name.en}
                onFr={v => set('languages', c.languages.map((x, j) => j === i ? { ...x, name: { ...x.name, fr: v } } : x))}
                onEn={v => set('languages', c.languages.map((x, j) => j === i ? { ...x, name: { ...x.name, en: v } } : x))} />
              <BiField label="Niveau" fr={l.level.fr} en={l.level.en}
                onFr={v => set('languages', c.languages.map((x, j) => j === i ? { ...x, level: { ...x.level, fr: v } } : x))}
                onEn={v => set('languages', c.languages.map((x, j) => j === i ? { ...x, level: { ...x.level, en: v } } : x))} />
            </Card>
          ))}
          <AddBtn label="Ajouter une langue" onClick={() => set('languages', [...c.languages, { name: { fr: '', en: '' }, level: { fr: '', en: '' } }])} />
        </Section>

        {/* ── DISTINCTIONS ── */}
        <Section title="Distinctions / Highlights">
          {c.awards.map((a, i) => (
            <Card key={i} onDel={() => set('awards', c.awards.filter((_, j) => j !== i))}>
              <BiField label="Distinction" fr={a.fr} en={a.en} multiline
                onFr={v => set('awards', c.awards.map((x, j) => j === i ? { ...x, fr: v } : x))}
                onEn={v => set('awards', c.awards.map((x, j) => j === i ? { ...x, en: v } : x))} />
            </Card>
          ))}
          <AddBtn label="Ajouter une distinction" onClick={() => set('awards', [...c.awards, { fr: '', en: '' }])} />
        </Section>

        {/* ── STACK ── */}
        <Section title="Stack technique">
          {c.stack.map((g, i) => (
            <Card key={i} onDel={() => set('stack', c.stack.filter((_, j) => j !== i))}>
              <BiField label="Titre de catégorie" fr={g.title.fr} en={g.title.en}
                onFr={v => set('stack', c.stack.map((x, j) => j === i ? { ...x, title: { ...x.title, fr: v } } : x))}
                onEn={v => set('stack', c.stack.map((x, j) => j === i ? { ...x, title: { ...x.title, en: v } } : x))} />
              <BiField label="Badge (ex: exploration)" fr={g.tag.fr} en={g.tag.en}
                onFr={v => set('stack', c.stack.map((x, j) => j === i ? { ...x, tag: { ...x.tag, fr: v } } : x))}
                onEn={v => set('stack', c.stack.map((x, j) => j === i ? { ...x, tag: { ...x.tag, en: v } } : x))} />
              <Field label="Éléments (séparés par virgule)" value={g.items.join(', ')}
                onChange={v => set('stack', c.stack.map((x, j) => j === i ? { ...x, items: v.split(',').map(s => s.trim()).filter(Boolean) } : x))} />
            </Card>
          ))}
          <AddBtn label="Ajouter une catégorie" onClick={() => set('stack', [...c.stack, { title: { fr: 'Nouveau', en: 'New' }, tag: { fr: '', en: '' }, items: [] }])} />
        </Section>

        {/* ── BARRE D'ACTIONS ── */}
        {error && (
          <div style={{ marginTop: 24, fontSize: 13, color: '#D14343', fontFamily: "'IBM Plex Mono',monospace", background: 'color-mix(in srgb, #D14343 8%, transparent)', border: '1px solid color-mix(in srgb, #D14343 25%, transparent)', borderRadius: 8, padding: '10px 14px' }}>
            {error}
          </div>
        )}
        <div style={{
          position: 'sticky', bottom: 0, marginTop: 36, paddingTop: 16, paddingBottom: 16,
          background: 'color-mix(in srgb, var(--bg) 92%, transparent)',
          backdropFilter: 'blur(8px)', borderTop: '1px solid var(--line)',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <button onClick={save} disabled={saving} style={{
            background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 15,
            border: 'none', borderRadius: 11, padding: '13px 28px',
            cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.75 : 1,
          }}>
            {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </button>
          {saved && <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: '#16A34A' }}>Publié pour tous ✓</span>}
          <button onClick={() => { if (window.confirm('Réinitialiser tout le contenu aux valeurs par défaut ? (non enregistré tant que tu ne cliques pas sur Enregistrer)')) setC(JSON.parse(JSON.stringify(DEFAULTS))) }}
            style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: '#D14343', background: 'none', border: '1px solid var(--line)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer' }}>
            ↺ Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}
