import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Charger les variables d'environnement depuis .env.local
const require = createRequire(import.meta.url)
const dotenv = require('dotenv')
dotenv.config({ path: '.env.local' })

const postgres = require('postgres')

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL manquant dans .env.local')
  process.exit(1)
}

// Contenu par défaut (doit rester cohérent avec app/data/content.ts)
const defaultContent = {
  profile: {
    name: 'Rayane',
    family: 'MELZI',
    photo: '',
    roleTag: { fr: 'Développeur Full-Stack', en: 'Full-Stack Developer' },
    roleSub: { fr: 'Enthousiaste DevOps', en: 'DevOps enthusiast' },
    avail: {
      fr: 'Ouvert aux opportunités · alternance 2026–2027',
      en: 'Open to work · apprenticeship 2026–2027',
    },
    lead: {
      fr: 'Je construis des applications web avec React, Next.js & Node.js — des API propres, une auth solide et une expérience fluide.',
      en: 'I build web applications with React, Next.js & Node.js — clean APIs, solid auth, and a smooth user experience.',
    },
    intro: {
      fr: "Étudiant en Master d'ingénierie logicielle. J'aime le code bien structuré et fiable — et j'explore le DevOps et l'auto-hébergement en parallèle.",
      en: "Master's student in Software Engineering. I care about well-structured, reliable code — and I'm exploring DevOps and self-hosting on the side.",
    },
  },
  glance: [
    { k: { fr: 'RÔLE', en: 'ROLE' }, v: { fr: 'Dév. Full-Stack', en: 'Full-Stack Dev' } },
    { k: { fr: 'FOCUS', en: 'FOCUS' }, v: { fr: 'React · Next · Node', en: 'React · Next · Node' } },
    { k: { fr: 'BASÉ À', en: 'BASED' }, v: { fr: 'Lyon, France', en: 'Lyon, France' } },
    { k: { fr: 'LANGUES', en: 'LANGUAGES' }, v: { fr: 'FR · EN · AR', en: 'FR · EN · AR' } },
  ],
  stack: [
    { title: { fr: 'Frontend', en: 'Frontend' }, tag: { fr: '', en: '' }, items: ['React', 'Next.js', 'JavaScript', 'HTML / CSS', 'REST APIs'] },
    { title: { fr: 'Backend', en: 'Backend' }, tag: { fr: '', en: '' }, items: ['Node.js', 'Express', 'MySQL', 'REST APIs', 'Auth'] },
    { title: { fr: 'DevOps', en: 'DevOps' }, tag: { fr: 'exploration', en: 'exploring' }, items: ['Git / GitHub', 'Linux', 'Docker', 'CI/CD', 'Nginx', 'Bash'] },
  ],
  projects: [
    { name: 'Projet personnel 1', link: '#', tags: ['React', 'Next.js'], desc: { fr: "Courte description — à remplir depuis le panneau d'administration.", en: 'Short description — fill this in from the admin panel.' } },
    { name: 'Projet personnel 2', link: '#', tags: ['Node.js', 'Express', 'MySQL'], desc: { fr: "Courte description — à remplir depuis le panneau d'administration.", en: 'Short description — fill this in from the admin panel.' } },
    { name: 'Projet personnel 3', link: '#', tags: ['Docker', 'CI/CD'], desc: { fr: "Courte description — à remplir depuis le panneau d'administration.", en: 'Short description — fill this in from the admin panel.' } },
  ],
  work: [
    {
      org: 'CodeIT',
      role: { fr: 'Développeur web', en: 'Web Developer' },
      period: { fr: 'Sept 2024 — Mars 2025', en: 'Sept 2024 — Mar 2025' },
      place: { fr: 'À distance', en: 'Remote' },
      tags: ['React', 'Next.js', 'REST API', 'Auth'],
      body: {
        fr: "Développement de solutions web avec React.js et Next.js, axées sur la performance, l'authentification et des API propres.",
        en: 'Built web solutions with React.js and Next.js focused on performance, authentication and clean APIs.',
      },
    },
    {
      org: 'SONATRACH',
      role: { fr: 'Développeur web — Stage', en: 'Web Developer — Internship' },
      period: { fr: 'Févr 2024 — Mai 2024', en: 'Feb 2024 — May 2024' },
      place: { fr: 'Alger, DZ', en: 'Algiers, DZ' },
      tags: ['React', 'Node.js', 'Express', 'MySQL'],
      body: {
        fr: "Développement d'une application centralisée de gestion des formations — React.js, Node.js & Express, MySQL.",
        en: 'Developed a centralized training-management app — React.js on the front end, Node.js & Express for the API, MySQL for data.',
      },
    },
  ],
  education: [
    { degree: { fr: 'Master — Ingénierie logicielle', en: 'M.Sc. — Software Engineering' }, org: { fr: 'USTHB, Alger · actuellement à Lyon', en: 'USTHB, Algiers · now in Lyon' }, period: '2024 — 2026' },
    { degree: { fr: 'Licence — Systèmes informatiques & logiciels', en: 'B.Sc. — Computer & Software Systems' }, org: { fr: 'USTHB (Houari Boumediene)', en: 'USTHB (Houari Boumediene)' }, period: '2021 — 2024' },
  ],
  languages: [
    { name: { fr: 'Français', en: 'French' }, level: { fr: 'TCF — B2', en: 'TCF — B2' } },
    { name: { fr: 'Anglais', en: 'English' }, level: { fr: 'Professionnel', en: 'Professional' } },
    { name: { fr: 'Arabe', en: 'Arabic' }, level: { fr: 'Maternelle', en: 'Native' } },
  ],
  awards: [
    { fr: '2e place — Training Camp X 2024, club ETIC (Algérie)', en: '2nd place — Training Camp X 2024, ETIC Club (Algeria)' },
    { fr: '3e place — Mini Hackathon ITC HackWave, Blida (janv. 2022)', en: '3rd place — Mini Hackathon ITC HackWave, Blida (Jan 2022)' },
    { fr: 'Membre — ITCommunity (USDB1) & Micro Club (USTHB)', en: 'Member — ITCommunity (USDB1) & Micro Club (USTHB)' },
  ],
  contact: {
    email: 'rayanmelzi@outlook.com',
    github: 'https://github.com/rayanMELZI',
    linkedin: 'https://linkedin.com/in/rayane-melzi',
    site: 'https://www.rayanemelzi.dev',
  },
}

const sql = postgres(DATABASE_URL, { ssl: 'require' })

try {
  // S'assurer que la table existe
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id serial PRIMARY KEY,
      data text NOT NULL
    )
  `

  const json = JSON.stringify(defaultContent)

  // Upsert : insère si absent, met à jour si id=1 existe déjà
  await sql`
    INSERT INTO site_content (id, data) VALUES (1, ${json})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `

  console.log('✓ Contenu par défaut inséré en base.')
} catch (err) {
  console.error('❌ Erreur lors du seed :', err)
  process.exit(1)
} finally {
  await sql.end()
}
