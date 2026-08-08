/** Solutions center content — user-problem paths from the ecosystem plan. */
export interface Solution {
  slug: string
  products: string[]
  primaryAction: 'download' | 'preview' | 'contact' | 'use'
  primaryHref: string
}

export const SOLUTIONS: Solution[] = [
  {
    slug: 'remote-servers',
    products: ['Magies Terminal'],
    primaryAction: 'download',
    primaryHref: '/download'
  },
  {
    slug: 'data-automation',
    products: ['Magies Data Studio'],
    primaryAction: 'preview',
    primaryHref: '/products/magies-data-studio'
  },
  {
    slug: 'enterprise',
    products: ['Magies Office', 'WMS / MES / BI'],
    primaryAction: 'contact',
    primaryHref: '/contact'
  },
  {
    slug: 'healthcare',
    products: ['Industry solutions'],
    primaryAction: 'contact',
    primaryHref: '/contact'
  },
  {
    slug: 'personal',
    products: ['Magies Nav'],
    primaryAction: 'use',
    primaryHref: 'https://nav.magies.top'
  }
]

export function getSolution(slug: string) {
  return SOLUTIONS.find((s) => s.slug === slug) || null
}
