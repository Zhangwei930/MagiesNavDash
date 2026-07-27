export interface ProductCategory {
  id: number
  name: string
  slug: string
  sortOrder: number
}

/**
 * Categories are admin-managed data, not a constant. Everything that renders a
 * category name reads it from here so there is one source of truth.
 */
export function useCategories() {
  const categories = useState<ProductCategory[]>('hub-categories', () => [])
  const loaded = useState<boolean>('hub-categories-loaded', () => false)

  async function loadCategories() {
    if (loaded.value) return
    const { api } = useApi()
    categories.value = await api<ProductCategory[]>('/api/categories')
    loaded.value = true
  }

  function categoryLabel(categoryId?: number): string {
    if (!categoryId) return ''
    return categories.value.find((c) => c.id === categoryId)?.name || ''
  }

  return { categories, loadCategories, categoryLabel }
}
