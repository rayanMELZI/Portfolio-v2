import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { pgTable, text, serial } from 'drizzle-orm/pg-core'

export const siteContent = pgTable('site_content', {
  id: serial('id').primaryKey(),
  data: text('data').notNull(),
})

let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (_db) return _db
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL manquant dans .env.local')
  const client = postgres(url, { ssl: 'require' })
  _db = drizzle(client, { schema: { siteContent } })
  return _db
}
