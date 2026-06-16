import { eq } from 'drizzle-orm'
import { getDb, siteContent } from './db'
import { content as DEFAULT_CONTENT, type SiteContentData } from '../app/data/content'

export async function getContent(): Promise<SiteContentData> {
  try {
    const db = getDb()
    const rows = await db.select().from(siteContent).where(eq(siteContent.id, 1))
    if (rows.length === 0) return DEFAULT_CONTENT
    return JSON.parse(rows[0].data) as SiteContentData
  } catch {
    return DEFAULT_CONTENT
  }
}

export async function updateContent(data: SiteContentData): Promise<void> {
  const db = getDb()
  const json = JSON.stringify(data)
  const existing = await db.select({ id: siteContent.id }).from(siteContent).where(eq(siteContent.id, 1))
  if (existing.length === 0) {
    await db.insert(siteContent).values({ id: 1, data: json })
  } else {
    await db.update(siteContent).set({ data: json }).where(eq(siteContent.id, 1))
  }
}
