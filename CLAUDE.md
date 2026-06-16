@AGENTS.md

# CLAUDE.md — Portfolio Rayane MELZI

Contexte projet pour Claude Code. Lis ce fichier en entier avant toute modification.
(Voir aussi AGENTS.md : ce Next.js est récent, consulter node_modules/next/dist/docs/ si besoin.)

---

## 1. Objectif

Portfolio personnel de **Rayane MELZI**, développeur Full-Stack, pour une recherche
d'**alternance 2026-2027**. Bilingue FR/EN, dark/light, avec un **panneau d'administration
protégé** permettant d'éditer tout le contenu sans toucher au code, et un **formulaire de
contact** réel par email.

---

## 2. Stack technique

| Domaine | Choix | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | RSC + routes API |
| Langage | TypeScript (strict) | |
| Base de données | **PostgreSQL** (Neon en prod) | |
| ORM | **Drizzle ORM** + driver `postgres` (porsager) | **PAS Prisma** — voir §8 |
| Auth | **Maison** : `jose` (JWT) + `bcryptjs` | Mono-utilisateur, cookie httpOnly |
| Email | `nodemailer` (SMTP) | Formulaire de contact |
| Upload images | `@vercel/blob` | Photo de profil |
| Thème | `next-themes` | attribut `data-theme` |
| Styles | **Inline styles + variables CSS** | Tailwind installé mais peu utilisé |

/!\ **Ne PAS réinstaller Prisma.** Drizzle a été choisi volontairement (cf. §8). Toute
"correction" qui réintroduit Prisma casse le projet.

---

## 3. Architecture (flux de données)

```
Visiteur -> app/page.tsx (Server Component)
               |  await getContent()  <- lit la BD
               v
         PostgreSQL (table site_content, 1 ligne JSON)
               ^
               |  updateContent()  +  revalidatePath('/')
               |
Admin -> /admin/login -> POST /api/admin/login -> cookie session signe
   \---> /admin (editeur) -> PUT /api/admin/content (protege)

middleware.ts -- bloque /admin/** et /api/admin/** sans session valide (cote SERVEUR)
```

Points cles :
- **Le contenu est un singleton en BD**, partage par tous les visiteurs.
- **La page publique lit la BD** (jamais de contenu code en dur servi aux visiteurs).
- **L'admin est protegee cote serveur** par le middleware, AVANT tout rendu/donnee.
- **A l'enregistrement, `revalidatePath('/')`** regenere la home pour tout le monde.

---

## 4. Structure des fichiers

```
app/
  layout.tsx              Root layout. Fonts Google, metadata, ThemeProvider.
                          /!\ <body suppressHydrationWarning> (extensions navigateur).
  page.tsx                SERVER component. getContent() -> <Portfolio>. export revalidate = 60.
  Portfolio.tsx           CLIENT. Etat `lang`. Distribue `content` aux sections.
  globals.css             Tokens CSS light/dark (:root et [data-theme="dark"]), fonts, .fld, .nav-link.
  data/content.ts         SiteContentData (type) + `content` (defauts) + `ui` (labels statiques FR/EN).
  components/
    ThemeProvider.tsx     Wrapper next-themes (attribute="data-theme").
    Nav.tsx               Nav sticky. Toggle FR/EN + theme. Bouton CV (-> /CV_dev.pdf). Contact.
    Hero.tsx              Affiche data.profile.photo (ou initiales "RM" si vide).
    Stack.tsx Projects.tsx Experience.tsx About.tsx Footer.tsx
    Contact.tsx           CLIENT. POST /api/contact. Honeypot anti-spam.
  admin/
    page.tsx              CLIENT. Editeur complet. GET /api/admin/content au load, PUT pour sauver.
                          Contient le composant PhotoUploader (upload Blob).
    login/page.tsx        Formulaire login. POST /api/admin/login.
  api/
    contact/route.ts          PUBLIC. nodemailer + rate-limit + honeypot.
    admin/login/route.ts      Verifie mot de passe (bcrypt), pose le cookie.
    admin/logout/route.ts     Efface le cookie.
    admin/content/route.ts    PROTEGE. GET (lecture) + PUT (sauve + revalidatePath('/')).
    admin/upload/route.ts     PROTEGE. POST image -> Vercel Blob -> renvoie l'URL.
lib/
  db.ts        Connexion Drizzle + schema table `siteContent` (pgTable). getDb().
  content.ts   getContent() (BD + fallback defauts) . updateContent() (upsert).
  auth.ts      createSessionToken / verifySessionToken (jose) . verifyPassword (bcrypt).
middleware.ts  Protege /admin/** et /api/admin/** (sauf login). Runtime Edge.
drizzle.config.ts
scripts/
  hash-password.js   Genere un hash bcrypt.   -> npm run hash -- MonMotDePasse
  seed.mjs           Insere le contenu defaut. -> npm run db:seed
next.config.ts       images.remotePatterns pour *.public.blob.vercel-storage.com
.env                 Placeholder DATABASE_URL="" (commite, sans secret).
.env.local           Vraie config (NON commite, voir .gitignore).
.env.local.example   Modele.
SETUP.md             Guide d'installation/deploiement detaille.
public/CV_dev.pdf    CV telechargeable (a remplacer par le CV a jour, meme nom).
```

---

## 5. Modele de contenu

Type source de verite : `SiteContentData` dans `app/data/content.ts`.

```
profile: { name, family, photo (URL), roleTag, roleSub, avail, lead, intro }
glance:    [{ k, v }]                       // mini-tableau de la carte profil
stack:     [{ title, tag, items[] }]
projects:  [{ name, link, tags[], desc }]
work:      [{ org, role, period, place, tags[], body }]
education: [{ degree, org, period }]
languages: [{ name, level }]
awards:    [BiLang]
contact:   { email, github, linkedin, site }
```

- `BiLang = { fr: string; en: string }`. Les champs bilingues se lisent `champ[lang]`.
- Les **labels d'interface** (texte des boutons, titres de sections, libelles de formulaire)
  sont dans l'objet **`ui`** de `content.ts` — **statiques, PAS en BD**. Bilingues aussi.
- Seul l'objet **`content` / `SiteContentData`** est stocke et editable en BD.

---

## 6. Authentification & securite

- **Mono-utilisateur**, pas d'inscription. Le mot de passe n'existe que sous forme de
  **hash bcrypt** dans `ADMIN_PASSWORD_HASH` (env).
- Login -> `verifyPassword` (bcrypt) -> `createSessionToken` (JWT signe HS256, 7j) -> cookie
  **httpOnly, sameSite=lax, secure en prod**, nomme `rm_admin_session`.
- `middleware.ts` verifie le token sur `/admin/**` et `/api/admin/**` (sauf routes login).
  Page non autorisee -> redirect `/admin/login`. API non autorisee -> 401 JSON.
- /!\ **Le middleware tourne en Edge runtime** : seul `jose` y est utilisable.
  **`bcryptjs` ne doit JAMAIS etre importe dans le middleware** (uniquement dans la route
  login, qui est en runtime Node).
- Rate-limit en memoire : login (5 essais / 15 min), contact (3 msg / h).

---

## 7. Variables d'environnement (.env.local)

```
DATABASE_URL            Connection string Neon (postgresql://...sslmode=require)
AUTH_SECRET             32+ caracteres aleatoires (signature JWT)
ADMIN_PASSWORD_HASH     Hash bcrypt du mot de passe admin (npm run hash -- ...)
SMTP_HOST               ex: smtp.gmail.com
SMTP_PORT               ex: 587
SMTP_USER               compte SMTP
SMTP_PASS               mot de passe d'application (Gmail App Password)
CONTACT_EMAIL           destinataire des messages du formulaire
BLOB_READ_WRITE_TOKEN   token Vercel Blob (auto-injecte en prod, a copier en local)
```

`.env.local` est gitignore. `.env` ne contient qu'un placeholder vide (pas de secret),
il permet au build de tourner sans BD (fallback sur le contenu par defaut).

---

## 8. Decisions & pieges importants

1. **Drizzle, pas Prisma.** Prisma telecharge des binaires moteur qui etaient bloques dans
   l'environnement de build. Drizzle est 100% JS, plus leger, parfait avec Neon serverless.
   -> Ne pas reintroduire Prisma.

2. **`getContent()` ne leve jamais d'exception.** Si la BD est indisponible/vide, elle
   retourne `DEFAULT_CONTENT` (depuis `data/content.ts`). C'est volontaire : le portfolio
   reste affichable meme sans BD. Consequence : le build passe meme sans `DATABASE_URL`.

3. **Duplication du contenu par defaut.** Les valeurs par defaut existent a DEUX endroits :
   - `app/data/content.ts` (utilise par l'app et le fallback)
   - `scripts/seed.mjs` (utilise pour peupler la BD — fichier .mjs autonome)
   /!\ **Si tu modifies les defauts dans `content.ts`, mets aussi a jour `seed.mjs`.**
   Ils doivent rester coherents.

4. **Page publique = Server Component.** `app/page.tsx` est async et fait `getContent()`.
   Ne pas y mettre de hooks client. La partie interactive est dans `Portfolio.tsx` ('use client').

5. **`revalidatePath('/')`** est appele dans `PUT /api/admin/content` apres sauvegarde :
   c'est ce qui rend les modifs visibles immediatement pour tous. Ne pas l'enlever.

6. **Styles via variables CSS.** Couleurs/typo via `var(--bg)`, `var(--ink)`, `var(--accent)`...
   definies dans `globals.css` (`:root` et `[data-theme="dark"]`). Garder ce systeme pour
   que le dark mode continue de marcher. Eviter d'ajouter des couleurs en dur.

7. **Photo de profil** = URL stockee dans `content.profile.photo`, uploadee via
   `/api/admin/upload` -> Vercel Blob. Affichee par `Hero.tsx` avec un `<img>` simple.
   Si vide -> fallback initiales "RM".

8. **Hydration.** `<body suppressHydrationWarning>` dans `layout.tsx` neutralise les faux
   warnings causes par des extensions navigateur. Ne pas retirer.

---

## 9. Commandes

```bash
npm install            # dependances
npm run dev            # dev (http://localhost:3000, admin: /admin)
npm run build          # build prod
npm run start          # serveur prod
npm run lint           # eslint

npm run hash -- <pw>   # genere ADMIN_PASSWORD_HASH
npm run db:push        # cree/maj la table (drizzle-kit push) — lit DATABASE_URL
npm run db:seed        # insere le contenu par defaut en BD
```

Mise en route complete (BD, mot de passe, email, Blob, deploiement Vercel) : voir **SETUP.md**.

---

## 10. Conventions de code

- TypeScript strict, pas de `any` non justifie.
- Commentaires en francais (coherent avec l'existant).
- Composants : `'use client'` seulement si interactivite/hooks. Sinon Server Component.
- Routes API : valider l'entree, renvoyer des codes HTTP corrects (400/401/429/500) avec
  `{ error: string }` en JSON. Les routes admin sont deja protegees par le middleware.
- Ne pas committer de secret. Toute nouvelle cle -> `.env.local` + documenter dans
  `.env.local.example` et SETUP.md.
