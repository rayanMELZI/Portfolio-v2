const bcrypt = require('bcryptjs')

const password = process.argv[2]
if (!password) {
  console.error('Usage: npm run hash -- <MonMotDePasse>')
  process.exit(1)
}

bcrypt.hash(password, 10).then(hash => {
  const escaped = hash.replaceAll('$', String.raw`\$`)
  console.log('\n── .env.local (local dev) ──────────────────────────')
  console.log(`ADMIN_PASSWORD_HASH="${escaped}"`)
  console.log('\n── Vercel dashboard (production) ───────────────────')
  console.log(`ADMIN_PASSWORD_HASH=${hash}`)
  console.log('')
})
