/** The Magies domains. Hub is this site; the rest are separate deployments. */
export interface SiteLink {
  key: string
  href: string
  external: boolean
}

export const SITE_LINKS: SiteLink[] = [
  { key: 'hub', href: '/', external: false },
  { key: 'terminal', href: 'https://shell.magies.top', external: true },
  { key: 'nav', href: 'https://nav.magies.top', external: true }
]

/** Pages that belong to the product site itself. */
export const PAGE_LINKS = [
  { key: 'home', to: '/' },
  { key: 'products', to: '/products' },
  { key: 'download', to: '/download' },
  { key: 'about', to: '/about' }
]
