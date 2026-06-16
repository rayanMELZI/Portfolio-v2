import Portfolio from './Portfolio'
import { getContent } from '@/lib/content'

// Revalidation : la page est régénérée à la sauvegarde admin (revalidatePath)
// et au maximum toutes les 60s.
export const revalidate = 60

export default async function Page() {
  const content = await getContent()
  return <Portfolio content={content} />
}
