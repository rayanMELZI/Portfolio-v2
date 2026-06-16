export type Lang = 'fr' | 'en'

export interface BiLang {
  fr: string
  en: string
}

// ─── Type of the full editable site content (stored in the DB) ──────────────
export interface SiteContentData {
  profile: {
    name: string
    family: string
    photo: string // URL de la photo (vide = pas de photo)
    roleTag: BiLang
    roleSub: BiLang
    avail: BiLang
    lead: BiLang
    intro: BiLang
  }
  glance: { k: BiLang; v: BiLang }[]
  stack: { title: BiLang; tag: BiLang; items: string[] }[]
  projects: { name: string; link: string; tags: string[]; desc: BiLang }[]
  work: { org: string; role: BiLang; period: BiLang; place: BiLang; tags: string[]; body: BiLang }[]
  education: { degree: BiLang; org: BiLang; period: string }[]
  languages: { name: BiLang; level: BiLang }[]
  awards: BiLang[]
  contact: { email: string; github: string; linkedin: string; site: string }
}

export const content: SiteContentData = {
  profile: {
    name: 'Rayane',
    family: 'MELZI',
    photo: '',
    roleTag: { fr: 'Développeur Full-Stack', en: 'Full-Stack Developer' } as BiLang,
    roleSub: { fr: 'Enthousiaste DevOps', en: 'DevOps enthusiast' } as BiLang,
    avail: {
      fr: 'Ouvert aux opportunités · alternance 2026–2027',
      en: 'Open to work · apprenticeship 2026–2027',
    } as BiLang,
    lead: {
      fr: 'Je construis des applications web avec React, Next.js & Node.js — des API propres, une auth solide et une expérience fluide.',
      en: 'I build web applications with React, Next.js & Node.js — clean APIs, solid auth, and a smooth user experience.',
    } as BiLang,
    intro: {
      fr: 'Étudiant en Master d\'ingénierie logicielle. J\'aime le code bien structuré et fiable — et j\'explore le DevOps et l\'auto-hébergement en parallèle.',
      en: "Master's student in Software Engineering. I care about well-structured, reliable code — and I'm exploring DevOps and self-hosting on the side.",
    } as BiLang,
  },
  glance: [
    { k: { fr: 'RÔLE', en: 'ROLE' } as BiLang, v: { fr: 'Dév. Full-Stack', en: 'Full-Stack Dev' } as BiLang },
    { k: { fr: 'FOCUS', en: 'FOCUS' } as BiLang, v: { fr: 'React · Next · Node', en: 'React · Next · Node' } as BiLang },
    { k: { fr: 'BASÉ À', en: 'BASED' } as BiLang, v: { fr: 'Lyon, France', en: 'Lyon, France' } as BiLang },
    { k: { fr: 'LANGUES', en: 'LANGUAGES' } as BiLang, v: { fr: 'FR · EN · AR', en: 'FR · EN · AR' } as BiLang },
  ],
  stack: [
    {
      title: { fr: 'Frontend', en: 'Frontend' } as BiLang,
      tag: { fr: '', en: '' } as BiLang,
      items: ['React', 'Next.js', 'JavaScript', 'HTML / CSS', 'REST APIs'],
    },
    {
      title: { fr: 'Backend', en: 'Backend' } as BiLang,
      tag: { fr: '', en: '' } as BiLang,
      items: ['Node.js', 'Express', 'MySQL', 'REST APIs', 'Auth'],
    },
    {
      title: { fr: 'DevOps', en: 'DevOps' } as BiLang,
      tag: { fr: 'exploration', en: 'exploring' } as BiLang,
      items: ['Git / GitHub', 'Linux', 'Docker', 'CI/CD', 'Nginx', 'Bash'],
    },
  ],
  projects: [
    {
      name: 'Projet personnel 1',
      link: '#',
      tags: ['React', 'Next.js'],
      desc: {
        fr: 'Courte description — à remplir depuis le panneau d\'administration.',
        en: 'Short description — fill this in from the admin panel.',
      } as BiLang,
    },
    {
      name: 'Projet personnel 2',
      link: '#',
      tags: ['Node.js', 'Express', 'MySQL'],
      desc: {
        fr: 'Courte description — à remplir depuis le panneau d\'administration.',
        en: 'Short description — fill this in from the admin panel.',
      } as BiLang,
    },
    {
      name: 'Projet personnel 3',
      link: '#',
      tags: ['Docker', 'CI/CD'],
      desc: {
        fr: 'Courte description — à remplir depuis le panneau d\'administration.',
        en: 'Short description — fill this in from the admin panel.',
      } as BiLang,
    },
  ],
  work: [
    {
      org: 'CodeIT',
      role: { fr: 'Développeur web', en: 'Web Developer' } as BiLang,
      period: { fr: 'Sept 2024 — Mars 2025', en: 'Sept 2024 — Mar 2025' } as BiLang,
      place: { fr: 'À distance', en: 'Remote' } as BiLang,
      tags: ['React', 'Next.js', 'REST API', 'Auth'],
      body: {
        fr: "Développement de solutions web avec React.js et Next.js, axées sur la performance, l'authentification et des API propres. Travail rapproché avec les clients pour livrer une expérience fluide et fiable.",
        en: 'Built web solutions with React.js and Next.js focused on performance, authentication and clean APIs. Worked closely with clients to deliver a smooth, reliable experience.',
      } as BiLang,
    },
    {
      org: 'SONATRACH',
      role: { fr: 'Développeur web — Stage', en: 'Web Developer — Internship' } as BiLang,
      period: { fr: 'Févr 2024 — Mai 2024', en: 'Feb 2024 — May 2024' } as BiLang,
      place: { fr: 'Alger, DZ', en: 'Algiers, DZ' } as BiLang,
      tags: ['React', 'Node.js', 'Express', 'MySQL'],
      body: {
        fr: "Développement d'une application centralisée de gestion des formations pour le suivi et l'évaluation — React.js côté front, Node.js & Express pour l'API, et MySQL pour les données.",
        en: 'Developed a centralized training-management app to track and evaluate programs — React.js on the front end, Node.js & Express for the API, MySQL for data.',
      } as BiLang,
    },
  ],
  education: [
    {
      degree: { fr: 'Master — Ingénierie logicielle', en: 'M.Sc. — Software Engineering' } as BiLang,
      org: { fr: 'USTHB, Alger · actuellement à Lyon', en: 'USTHB, Algiers · now in Lyon' } as BiLang,
      period: '2024 — 2026',
    },
    {
      degree: { fr: 'Licence — Systèmes informatiques & logiciels', en: 'B.Sc. — Computer & Software Systems' } as BiLang,
      org: { fr: 'USTHB (Houari Boumediene)', en: 'USTHB (Houari Boumediene)' } as BiLang,
      period: '2021 — 2024',
    },
  ],
  languages: [
    { name: { fr: 'Français', en: 'French' } as BiLang, level: { fr: 'TCF — B2', en: 'TCF — B2' } as BiLang },
    { name: { fr: 'Anglais', en: 'English' } as BiLang, level: { fr: 'Professionnel', en: 'Professional' } as BiLang },
    { name: { fr: 'Arabe', en: 'Arabic' } as BiLang, level: { fr: 'Maternelle', en: 'Native' } as BiLang },
  ],
  awards: [
    {
      fr: '2e place — Training Camp X 2024, club ETIC (Algérie)',
      en: '2nd place — Training Camp X 2024, ETIC Club (Algeria)',
    } as BiLang,
    {
      fr: '3e place — Mini Hackathon ITC HackWave, Blida (janv. 2022)',
      en: '3rd place — Mini Hackathon ITC HackWave, Blida (Jan 2022)',
    } as BiLang,
    {
      fr: 'Membre — ITCommunity (USDB1) & Micro Club (USTHB)',
      en: 'Member — ITCommunity (USDB1) & Micro Club (USTHB)',
    } as BiLang,
  ],
  contact: {
    email: 'rayanmelzi@outlook.com',
    github: 'https://github.com/rayanMELZI',
    linkedin: 'https://linkedin.com/in/rayane-melzi',
    site: 'https://www.rayanemelzi.dev',
  },
}

export const ui = {
  fr: {
    navProjects: 'projets',
    navExp: 'parcours',
    navAbout: 'à propos',
    navContact: 'Contact',
    resume: 'CV',
    viewWork: 'Voir mes projets',
    stackTitle: 'Stack technique',
    projectsTitle: 'Projets',
    expTitle: 'Expérience',
    aboutTitle: 'À propos',
    education: 'FORMATION',
    languages: 'LANGUES',
    highlights: 'DISTINCTIONS',
    contactKicker: 'TRAVAILLONS ENSEMBLE',
    contactTitle: 'Une idée ou\nune opportunité ?',
    contactBody: "Que ce soit pour une alternance, un projet freelance ou juste pour échanger — je suis disponible.",
    formTitle: 'Envoyer un message',
    formName: 'Votre nom',
    formEmail: 'Votre email',
    formMsg: 'Votre message…',
    formSend: 'Envoyer',
    formSending: 'Envoi…',
    sentTitle: 'Message envoyé !',
    sentBody: "Merci pour votre message. Je vous répondrai dans les plus brefs délais.",
    copyLabel: 'copier',
    copiedLabel: 'copié !',
    photoHint: 'Glissez une photo ici',
    siteLabel: 'Site web',
    footer: '© 2026 Rayane MELZI — Développeur Full-Stack basé à Lyon',
  },
  en: {
    navProjects: 'projects',
    navExp: 'experience',
    navAbout: 'about',
    navContact: 'Contact',
    resume: 'CV',
    viewWork: 'View my work',
    stackTitle: 'Tech stack',
    projectsTitle: 'Projects',
    expTitle: 'Experience',
    aboutTitle: 'About',
    education: 'EDUCATION',
    languages: 'LANGUAGES',
    highlights: 'HIGHLIGHTS',
    contactKicker: "LET'S WORK TOGETHER",
    contactTitle: 'Got an idea or\nan opportunity?',
    contactBody: 'Whether it\'s an apprenticeship, a freelance project, or just a chat — I\'m available.',
    formTitle: 'Send a message',
    formName: 'Your name',
    formEmail: 'Your email',
    formMsg: 'Your message…',
    formSend: 'Send',
    formSending: 'Sending…',
    sentTitle: 'Message sent!',
    sentBody: "Thanks for reaching out. I'll get back to you as soon as possible.",
    copyLabel: 'copy',
    copiedLabel: 'copied!',
    photoHint: 'Drop photo here',
    siteLabel: 'Website',
    footer: '© 2026 Rayane MELZI — Full-Stack Developer based in Lyon',
  },
}
