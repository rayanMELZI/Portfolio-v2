'use client'

import { useState } from 'react'
import type { Lang, SiteContentData } from './data/content'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Stack from './components/Stack'
import Projects from './components/Projects'
import Experience from './components/Experience'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

interface PortfolioProps {
  content: SiteContentData
}

export default function Portfolio({ content }: PortfolioProps) {
  const [lang, setLang] = useState<Lang>('fr')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Nav lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} data={content} />
        <Stack lang={lang} data={content} />
        <Projects lang={lang} data={content} />
        <Experience lang={lang} data={content} />
        <About lang={lang} data={content} />
        <Contact lang={lang} data={content} />
      </main>
      <Footer lang={lang} />
    </div>
  )
}
