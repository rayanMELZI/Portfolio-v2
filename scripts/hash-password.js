const bcrypt = require('bcryptjs')

const password = process.argv[2]
if (!password) {
  console.error('Usage: npm run hash -- <MonMotDePasse>')
  process.exit(1)
}

bcrypt.hash(password, 10).then(hash => {
  // Les $ dans le hash doivent être échappés avec \$ dans .env.local (dotenv-expand)
  const escaped = hash.replaceAll('$', String.raw`\$`)
  console.log(`\nAjoute cette ligne dans ton .env.local :\n`)
  console.log(`ADMIN_PASSWORD_HASH="${escaped}"\n`)
})
