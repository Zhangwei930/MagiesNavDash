/**
 * Client-side analytics beacon for Magies Hub stats board.
 * Mirrors Terminal's page_view tracking against /api/stats/track.
 */

const SESSION_KEY = 'magies_hub_sid'

function sessionId(): string {
  if (!import.meta.client) return ''
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

/** Paths that should never pollute product analytics. */
function shouldSkip(path: string): boolean {
  return (
    path.startsWith('/stats') ||
    path.startsWith('/admin') ||
    path.startsWith('/account') ||
    path.startsWith('/api')
  )
}

export function useHubTrack() {
  function trackPageView(path?: string) {
    if (!import.meta.client) return
    const p = path || window.location.pathname
    if (shouldSkip(p)) return

    const body = {
      eventType: 'page_view',
      path: p,
      referrer: document.referrer || '',
      sessionId: sessionId(),
      ua: navigator.userAgent
    }

    // fire-and-forget; never block navigation
    const { base } = useApi()
    fetch(`${base}/api/stats/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true
    }).catch(() => {})
  }

  return { trackPageView, sessionId }
}
