# Portfolio Rayane MELZI — Guide complet

Stack : **Next.js 16** · **PostgreSQL (Neon)** · **Drizzle ORM** · **Auth maison (JWT + bcrypt)** · **Nodemailer**

---

## Architecture

```
Visiteur ──► page /  (server component)
                │ lit le contenu en BD (getContent)
                ▼
          PostgreSQL (Neon)  ◄──── PUT /api/admin/content (protégé)
                ▲                          │
                │                          │ revalidatePath('/')  → MAJ instantanée pour tous
          Admin /admin ──► login ──► éditeur
                │
          middleware.ts  ◄─ bloque /admin et /api/admin sans session valide (côté serveur)
```

- **Le contenu est partagé** : stocké en BD, identique pour tous les visiteurs.
- **L'admin est réellement protégée** : le `middleware.ts` vérifie une session signée (JWT httpOnly) côté serveur AVANT de laisser passer. Impossible d'y accéder sans le mot de passe.
- **Mise à jour instantanée** : quand tu enregistres dans l'admin, la page publique est régénérée pour tout le monde.

---

## 1. Installation
```bash
npm install
```

## 2. Base de données — Neon (gratuit)
1. Crée un compte et un projet sur https://neon.tech
2. Copie la **Connection string** (format `postgresql://...sslmode=require`)
3. Colle-la dans `.env.local` → `DATABASE_URL="..."`
4. Crée la table et insère le contenu de départ :
```bash
npm run db:push    # crée la table site_content
npm run db:seed    # insère ton contenu par défaut
```

## 3. Mot de passe admin
Le mot de passe par défaut est `admin1234`. **Change-le :**
```bash
npm run hash -- MonNouveauMotDePasse
```
Copie la ligne `ADMIN_PASSWORD_HASH="..."` affichée dans `.env.local`.

> `AUTH_SECRET` est déjà généré. Tu peux le régénérer avec :
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 4. Email du formulaire de contact
Dans `.env.local`, configure le SMTP (Gmail recommandé) :
1. https://myaccount.google.com/apppasswords → génère un mot de passe d'application
2. Remplis `SMTP_USER` et `SMTP_PASS`

## 5. Lancer
```bash
npm run dev
```
- Portfolio public : http://localhost:3000
- Admin : http://localhost:3000/admin (→ redirige vers /admin/login)

---

## Déploiement sur Vercel
1. Push le projet sur GitHub (le `.env.local` n'est PAS commité — normal)
2. Importe le repo sur https://vercel.com
3. **Settings → Environment Variables** : ajoute les variables de `.env.local`
   (`DATABASE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD_HASH`, `SMTP_*`, `CONTACT_EMAIL`).
   Pour la photo : **Storage → Create → Blob** (le `BLOB_READ_WRITE_TOKEN` est ajouté tout seul).
4. Avant le 1er déploiement, lance une fois en local pointé sur la BD de prod :
   ```bash
   npm run db:push && npm run db:seed
   ```
5. Deploy ✓

---

## Photo de profil
La photo s'upload **directement depuis l'admin** (section Profil → « Choisir une image »).
Elle est stockée sur **Vercel Blob** et son URL est enregistrée en base — donc visible par tous.

Pour l'activer :
1. Sur Vercel : **Storage → Create → Blob**, puis connecte le store au projet.
2. En production, le token `BLOB_READ_WRITE_TOKEN` est injecté automatiquement.
3. En local, copie ce token depuis Vercel dans `.env.local`.

Tant que Blob n'est pas configuré, l'admin affiche un message clair et la carte profil montre les initiales « RM ».

## CV
Le PDF est dans `public/CV_dev.pdf`. Remplace-le par ton CV à jour (garde le même nom, ou change le lien dans `app/components/Nav.tsx`).

---

## Sécurité — ce qui a changé
| Avant (maquette) | Maintenant (réel) |
|---|---|
| Contenu en localStorage (par navigateur) | Contenu en PostgreSQL (partagé) |
| Page publique = contenu codé en dur | Page publique = lit la BD |
| Mot de passe vérifié en JS côté client | Vérifié côté serveur (bcrypt + JWT signé) |
| `/admin` accessible à tous | `/admin` bloquée par middleware serveur |
| Session = flag localStorage | Session = cookie httpOnly signé, expire 7j |
