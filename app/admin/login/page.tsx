'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Identifiant incorrect.'); setLoading(false); return }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Erreur de connexion.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <form onSubmit={submit} style={{
        width: '100%', maxWidth: 360, padding: '36px 32px',
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8, background: 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--bg)', letterSpacing: '-.02em' }}>RM</span>
          </span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 15 }}>Admin</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--faint)', letterSpacing: '.06em' }}>
            MOT DE PASSE
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
            style={{
              background: 'var(--bg)', border: '1px solid var(--line)',
              borderRadius: 9, padding: '10px 13px', fontSize: 14,
              color: 'var(--ink)', outline: 'none', fontFamily: "'Public Sans',sans-serif",
            }}
          />
        </div>

        {error && (
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: '#D14343' }}>
            {error}
          </span>
        )}

        <button type="submit" disabled={loading} style={{
          background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 14,
          border: 'none', borderRadius: 10, padding: '12px', cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.75 : 1,
        }}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
