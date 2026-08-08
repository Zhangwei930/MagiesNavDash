import type { MsgKey } from '~/composables/useI18n'

export interface ProductCategory {
  id: number
  name: string
  slug: string
  sortOrder: number
}

const CATEGORY_MSG: Record<string, MsgKey> = {
  'developer-tools': 'category.developer-tools',
  'data-automation': 'category.data-automation',
  business: 'category.business',
  online: 'category.online',
  labs: 'category.labs'
}

/**
 * Categories are admin-managed data, not a constant. Everything that renders a
 * category name reads it from here so there is one source of truth.
 * Known slugs are localized via i18n; unknown ones fall back to API name.
 */
export function useCategories() {
  const categories = useState<ProductCategory[]>('hub-categories', () => [])
  const loaded = useState<boolean>('hub-categories-loaded', () => false)
  const { t } = useI18n()

  async function loadCategories() {
    if (loaded.value) return
    const { api } = useApi()
    categories.value = await api<ProductCategory[]>('/api/categories')
    loaded.value = true
  }

  function categoryName(c?: ProductCategory | null): string {
    if (!c) return ''
    const key = CATEGORY_MSG[c.slug]
    return key ? t(key) : c.name
  }

  function categoryLabel(categoryId?: number): string {
    if (!categoryId) return ''
    return categoryName(categories.value.find((c) => c.id === categoryId) || null)
  }

  return { categories, loadCategories, categoryLabel, categoryName }
}
