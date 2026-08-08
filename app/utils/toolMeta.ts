import {
  Boxes,
  Compass,
  Database,
  FileText,
  Gamepad2,
  LayoutGrid,
  Terminal,
  Users,
  Globe,
  Wrench,
  Server,
  type LucideIcon
} from 'lucide-vue-next'

/** 后台可选图标（存 product.icon） */
export const ICON_OPTIONS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: 'terminal', label: '终端', icon: Terminal },
  { key: 'compass', label: '导航', icon: Compass },
  { key: 'users', label: '用户', icon: Users },
  { key: 'gamepad', label: '游戏', icon: Gamepad2 },
  { key: 'boxes', label: '集合', icon: Boxes },
  { key: 'globe', label: '网站', icon: Globe },
  { key: 'wrench', label: '工具', icon: Wrench },
  { key: 'server', label: '服务', icon: Server },
  { key: 'database', label: '数据', icon: Database },
  { key: 'file-text', label: '文档', icon: FileText },
  { key: 'layout-grid', label: '默认', icon: LayoutGrid }
]

const SLUG_ICON: Record<string, LucideIcon> = {
  'magies-nav': Compass,
  'magies-hub': Boxes,
  'magies-shell': Terminal,
  'magies-terminal': Terminal,
  'magies-data-studio': Database,
  'magies-pdf': FileText,
  'magies-office': FileText,
  'magies-game': Gamepad2
}

/**
 * Custom 64×64 product marks. Only products with a finalized logo live here —
 * everything else keeps the Lucide fallback until a mark is ready.
 */
const PRODUCT_LOGOS: Record<string, string> = {
  'magies-office': '/brand/product-office-64.png',
  'magies-pdf': '/brand/product-office-64.png',
  'magies-terminal': '/brand/product-terminal-64.png',
  'magies-shell': '/brand/product-terminal-64.png',
  'magies-game': '/brand/product-game-64.png'
}

const KEY_ICON: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.key, o.icon])
)

export function toolIcon(product?: { slug?: string; icon?: string }): LucideIcon {
  if (product?.icon && KEY_ICON[product.icon]) return KEY_ICON[product.icon]
  if (product?.slug && SLUG_ICON[product.slug]) return SLUG_ICON[product.slug]
  return LayoutGrid
}

/** Returns a public PNG path when the product has a custom mark, else null. */
export function toolLogo(product?: { slug?: string } | string | null): string | null {
  const slug = typeof product === 'string' ? product : product?.slug
  if (!slug) return null
  return PRODUCT_LOGOS[slug] || null
}

function productSlug(product?: { slug?: string } | string | null): string | null {
  if (!product) return null
  return typeof product === 'string' ? product : product.slug || null
}

/**
 * Dense app marks (Office / Game) read small at card size — bump CSS box.
 * Source assets stay 64×64.
 */
export function toolLogoDisplaySize(
  product?: { slug?: string } | string | null,
  slot: 'list' | 'detail' | 'const' = 'list'
): number {
  const slug = productSlug(product)
  const large = slug === 'magies-office' || slug === 'magies-pdf' || slug === 'magies-game'
  if (slot === 'detail') return large ? 56 : 40
  if (slot === 'const') return large ? 30 : 22
  return large ? 38 : 28
}

/** True when the product mark should use the larger icon slot. */
export function toolLogoIsLarge(product?: { slug?: string } | string | null): boolean {
  const slug = productSlug(product)
  return slug === 'magies-office' || slug === 'magies-pdf' || slug === 'magies-game'
}

export function toolColor(product: { slug?: string; accentColor?: string }): string {
  // Prefer palette aligned with star-ring logo (blue / violet / orange)
  const map: Record<string, string> = {
    'magies-nav': '#60a5fa',
    'magies-hub': '#c084fc',
    'magies-shell': '#2ad4c8',
    'magies-terminal': '#2ad4c8',
    'magies-data-studio': '#22d3ee',
    'magies-pdf': '#6366f1',
    'magies-office': '#6366f1',
    'magies-game': '#94a3b8'
  }
  if (product.slug && map[product.slug]) return map[product.slug]
  if (product.accentColor) return product.accentColor
  return '#a78bfa'
}

