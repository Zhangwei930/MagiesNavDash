/**
 * Same-origin proxy for product changelogs.
 *
 * Terminal markdown is hosted on shell.magies.top without CORS headers, so the
 * browser cannot fetch it directly. This route runs on the Nuxt server and is
 * not under /api (nginx sends /api to Spring Boot).
 */
import { fetchProductChangelogs } from '~/utils/changelogFeed'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const locale = q.locale === 'en' ? 'en' : 'zh'
  const products = await fetchProductChangelogs(locale)
  setHeader(event, 'Cache-Control', 'public, max-age=120, s-maxage=300')
  return products
})
