/** The Magies domains. Hub is this site; the rest are separate deployments. */
export interface SiteLink {
  key: string
  href: string
  external: boolean
}

export const SITE_LINKS: SiteLink[] = [
  { key: 'hub', href: '/', external: false },
  { key: 'terminal', href: 'https://shell.magies.top', external: true },
  { key: 'nav', href: 'https://nav.magies.top', external: true },
  { key: 'game', href: 'https://tech.magies.top', external: true }
]

/** Primary public nav — keep ≤ 7 items (ecosystem plan §5.1). */
export const PAGE_LINKS = [
  { key: 'products', to: '/products' },
  { key: 'solutions', to: '/solutions' },
  { key: 'download', to: '/download' },
  { key: 'roadmap', to: '/roadmap' },
  { key: 'about', to: '/about' }
]

/** Footer resource links. */
export const RESOURCE_LINKS = [
  { key: 'download', to: '/download' },
  { key: 'roadmap', to: '/roadmap' },
  { key: 'changelog', to: '/changelog' },
  { key: 'contact', to: '/contact' }
]

/** Footer legal / trust links. */
export const LEGAL_LINKS = [
  { key: 'privacy', to: '/privacy' },
  { key: 'terms', to: '/terms' },
  { key: 'security', to: '/security' }
]
