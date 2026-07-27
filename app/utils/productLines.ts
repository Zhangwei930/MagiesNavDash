/** Four product lines + Labs — brand architecture from the ecosystem plan. */
export interface ProductLine {
  key: string
  slug: string
  index: string
  color: string
  href: string
}

export const PRODUCT_LINES: ProductLine[] = [
  {
    key: 'developer',
    slug: 'developer-tools',
    index: '01',
    color: '#818cf8',
    href: '/products?category=developer-tools'
  },
  {
    key: 'data',
    slug: 'data-automation',
    index: '02',
    color: '#22d3ee',
    href: '/products?category=data-automation'
  },
  {
    key: 'business',
    slug: 'business',
    index: '03',
    color: '#6366f1',
    href: '/products?category=business'
  },
  {
    key: 'online',
    slug: 'online',
    index: '04',
    color: '#c4b5fd',
    href: '/products?category=online'
  }
]

export const LABS_LINE: ProductLine = {
  key: 'labs',
  slug: 'labs',
  index: '··',
  color: '#94a3b8',
  href: '/products?category=labs'
}
