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
  'magies-game': Gamepad2
}

const KEY_ICON: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.key, o.icon])
)

export function toolIcon(product?: { slug?: string; icon?: string }): LucideIcon {
  if (product?.icon && KEY_ICON[product.icon]) return KEY_ICON[product.icon]
  if (product?.slug && SLUG_ICON[product.slug]) return SLUG_ICON[product.slug]
  return LayoutGrid
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
    'magies-game': '#94a3b8'
  }
  if (product.slug && map[product.slug]) return map[product.slug]
  if (product.accentColor) return product.accentColor
  return '#a78bfa'
}

