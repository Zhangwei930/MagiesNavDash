/** Product lifecycle status — aligned with the ecosystem plan. */
export type ProductStatus =
  | 'RELEASED'
  | 'PUBLISHED'
  | 'PUBLIC_BETA'
  | 'PRIVATE_BETA'
  | 'ONLINE'
  | 'IN_DEVELOPMENT'
  | 'COMING_SOON'
  | 'ENTERPRISE'
  | 'EXPERIMENTAL'
  | 'MAINTENANCE'
  | 'DISCONTINUED'
  | 'HIDDEN'

export interface StatusMeta {
  key: ProductStatus | string
  labelZh: string
  labelEn: string
  /** CSS modifier on .status-badge */
  tone: 'ok' | 'beta' | 'dev' | 'enterprise' | 'lab' | 'muted'
  /** Whether "download now" is appropriate */
  downloadable: boolean
}

const STATUS_MAP: Record<string, StatusMeta> = {
  RELEASED: { key: 'RELEASED', labelZh: '正式发布', labelEn: 'Released', tone: 'ok', downloadable: true },
  PUBLISHED: { key: 'PUBLISHED', labelZh: '正式发布', labelEn: 'Released', tone: 'ok', downloadable: true },
  PUBLIC_BETA: { key: 'PUBLIC_BETA', labelZh: '公开测试', labelEn: 'Public Beta', tone: 'beta', downloadable: true },
  PRIVATE_BETA: { key: 'PRIVATE_BETA', labelZh: '邀请测试', labelEn: 'Private Beta', tone: 'beta', downloadable: false },
  ONLINE: { key: 'ONLINE', labelZh: '在线服务', labelEn: 'Online', tone: 'ok', downloadable: false },
  IN_DEVELOPMENT: {
    key: 'IN_DEVELOPMENT',
    labelZh: '开发中',
    labelEn: 'In Development',
    tone: 'dev',
    downloadable: false
  },
  COMING_SOON: { key: 'COMING_SOON', labelZh: '即将推出', labelEn: 'Coming Soon', tone: 'dev', downloadable: false },
  ENTERPRISE: {
    key: 'ENTERPRISE',
    labelZh: '企业方案',
    labelEn: 'Enterprise',
    tone: 'enterprise',
    downloadable: false
  },
  EXPERIMENTAL: {
    key: 'EXPERIMENTAL',
    labelZh: '实验项目',
    labelEn: 'Experimental',
    tone: 'lab',
    downloadable: false
  },
  MAINTENANCE: {
    key: 'MAINTENANCE',
    labelZh: '维护模式',
    labelEn: 'Maintenance',
    tone: 'muted',
    downloadable: true
  },
  DISCONTINUED: {
    key: 'DISCONTINUED',
    labelZh: '停止维护',
    labelEn: 'Discontinued',
    tone: 'muted',
    downloadable: false
  },
  HIDDEN: { key: 'HIDDEN', labelZh: '隐藏', labelEn: 'Hidden', tone: 'muted', downloadable: false }
}

export const FILTERABLE_STATUSES = [
  'RELEASED',
  'PUBLIC_BETA',
  'ONLINE',
  'IN_DEVELOPMENT',
  'ENTERPRISE',
  'EXPERIMENTAL'
] as const

export function statusMeta(status?: string | null): StatusMeta {
  if (!status) return STATUS_MAP.RELEASED
  return STATUS_MAP[status.toUpperCase()] || {
    key: status,
    labelZh: status,
    labelEn: status,
    tone: 'muted',
    downloadable: false
  }
}

export function statusLabel(status: string | null | undefined, locale: 'zh' | 'en'): string {
  const m = statusMeta(status)
  return locale === 'en' ? m.labelEn : m.labelZh
}

/** Sort rank for catalog default order (lower first). */
export function statusSortRank(status?: string | null): number {
  const order = [
    'RELEASED',
    'PUBLISHED',
    'ONLINE',
    'PUBLIC_BETA',
    'PRIVATE_BETA',
    'IN_DEVELOPMENT',
    'COMING_SOON',
    'ENTERPRISE',
    'EXPERIMENTAL',
    'MAINTENANCE',
    'DISCONTINUED',
    'HIDDEN'
  ]
  const i = order.indexOf((status || '').toUpperCase())
  return i === -1 ? 50 : i
}

export type PrimaryAction = 'download' | 'use' | 'preview' | 'contact' | 'learn'

export function primaryAction(product: {
  status?: string
  homepageUrl?: string | null
  slug?: string
}): PrimaryAction {
  const s = (product.status || '').toUpperCase()
  if (s === 'ENTERPRISE') return 'contact'
  if (s === 'IN_DEVELOPMENT' || s === 'COMING_SOON') return 'preview'
  if (s === 'ONLINE' || (product.homepageUrl && !statusMeta(s).downloadable && s !== 'PUBLIC_BETA')) {
    if (product.homepageUrl) return 'use'
  }
  if (statusMeta(s).downloadable && (s === 'PUBLIC_BETA' || s === 'RELEASED' || s === 'PUBLISHED')) {
    // Terminal-style products: prefer download when we have a download surface
    if (product.slug?.includes('terminal') || product.slug?.includes('shell')) return 'download'
    if (product.homepageUrl) return 'use'
    return 'download'
  }
  if (product.homepageUrl) return 'use'
  return 'learn'
}
