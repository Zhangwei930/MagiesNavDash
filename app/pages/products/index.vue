<template>
  <div ref="root" class="page products-page">
    <div class="container">
      <PageHero
        :eyebrow="t('home.productsTitle')"
        :title="t('products.title')"
        :desc="t('products.desc')"
      />

      <div v-if="loading" class="muted text-center">{{ t('products.loading') }}</div>
      <div v-else-if="error" class="err text-center">{{ error }}</div>
      <template v-else>
        <div class="filters" data-reveal>
          <div class="filter-block">
            <span class="filter-label">{{ t('products.filterLine') }}</span>
            <div class="cat-bar">
              <button
                type="button"
                class="cat-chip"
                :class="{ active: !activeCategorySlug }"
                @click="setCategory(null)"
              >{{ t('products.all') }}</button>
              <button
                v-for="c in usedCategories"
                :key="c.id"
                type="button"
                class="cat-chip"
                :class="{ active: activeCategorySlug === c.slug }"
                @click="setCategory(c.slug)"
              >{{ c.name }}</button>
            </div>
          </div>

          <div class="filter-block">
            <span class="filter-label">{{ t('products.filterStatus') }}</span>
            <div class="cat-bar">
              <button
                type="button"
                class="cat-chip"
                :class="{ active: !activeStatus }"
                @click="setStatus(null)"
              >{{ t('products.all') }}</button>
              <button
                v-for="s in usedStatuses"
                :key="s"
                type="button"
                class="cat-chip"
                :class="{ active: activeStatus === s }"
                @click="setStatus(s)"
              >{{ statusLabel(s, locale) }}</button>
            </div>
          </div>
        </div>

        <div v-if="!list.length" class="empty">{{ t('products.empty') }}</div>
        <div v-else class="grid grid-3 p-grid" data-reveal-stagger>
          <NuxtLink
            v-for="p in list"
            :key="p.id"
            class="neon-tile p-card"
            :to="`/products/${p.slug}`"
            :style="{ '--neon': toolColor(p) }"
          >
            <div class="p-head">
              <div
                class="icon-circle"
                :style="{ '--tint': toolColor(p) }"
                :data-logo="toolLogo(p) ? '' : null"
                :data-logo-lg="toolLogo(p) && toolLogoDisplaySize(p, 'list') > 32 ? '' : null"
              >
                <ProductIcon
                  :product="p"
                  :size="toolLogo(p) ? toolLogoDisplaySize(p, 'list') : 20"
                />
              </div>
              <div class="p-id">
                <h3>{{ p.name }}</h3>
                <span class="p-tag">{{ p.tagline }}</span>
              </div>
            </div>

            <div class="p-meta">
              <span v-if="categoryLabel(p.categoryId)" class="p-cat">{{ categoryLabel(p.categoryId) }}</span>
              <span class="status-badge" :data-tone="statusMeta(p.status).tone">
                {{ statusLabel(p.status, locale) }}
              </span>
            </div>

            <p v-if="p.description" class="p-desc">{{ p.description }}</p>

            <div class="p-foot">
              <span class="p-more">{{ t('products.detail') }} →</span>
              <span class="p-action">{{ actionLabel(p) }}</span>
            </div>
          </NuxtLink>
        </div>

        <div class="page-cta" data-reveal>
          <h2>{{ t('home.ctaTitle') }}</h2>
          <p>{{ t('home.ctaLead') }}</p>
          <div class="hero-actions">
            <NuxtLink class="btn btn-primary" to="/download">{{ t('nav.download') }}</NuxtLink>
            <NuxtLink class="btn btn-outline" to="/contact">{{ t('footer.contact') }}</NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toolColor, toolLogo, toolLogoDisplaySize } from '~/utils/toolMeta'
import { primaryAction, statusLabel, statusMeta, statusSortRank } from '~/utils/productStatus'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const root = ref<HTMLElement | null>(null)
useReveal(root)

const { categories, loadCategories, categoryLabel } = useCategories()
const products = useState<any[]>('hub-products', () => [])
const loading = ref(true)
const error = ref('')

const activeCategorySlug = computed(() => {
  const q = route.query.category
  return typeof q === 'string' && q ? q : null
})

const activeStatus = computed(() => {
  const q = route.query.status
  return typeof q === 'string' && q ? q.toUpperCase() : null
})

const usedCategories = computed(() => {
  const inUse = new Set(products.value.map((p) => p.categoryId))
  return categories.value.filter((c) => inUse.has(c.id))
})

const usedStatuses = computed(() => {
  const set = new Set(products.value.map((p) => (p.status || '').toUpperCase()).filter(Boolean))
  return [...set].sort((a, b) => statusSortRank(a) - statusSortRank(b))
})

const list = computed(() => {
  const catId = activeCategorySlug.value
    ? categories.value.find((c) => c.slug === activeCategorySlug.value)?.id
    : null

  return products.value
    .filter((p) => {
      if (catId != null && p.categoryId !== catId) return false
      if (activeStatus.value && (p.status || '').toUpperCase() !== activeStatus.value) return false
      return true
    })
    .sort((a, b) => {
      const rank = statusSortRank(a.status) - statusSortRank(b.status)
      if (rank !== 0) return rank
      return (a.sortOrder ?? 99) - (b.sortOrder ?? 99)
    })
})

function setCategory(slug: string | null) {
  const query = { ...route.query } as Record<string, string>
  if (slug) query.category = slug
  else delete query.category
  router.replace({ query })
}

function setStatus(status: string | null) {
  const query = { ...route.query } as Record<string, string>
  if (status) query.status = status
  else delete query.status
  router.replace({ query })
}

function actionLabel(p: any) {
  const a = primaryAction(p)
  if (a === 'download') return t('action.download')
  if (a === 'use') return t('action.use')
  if (a === 'preview') return t('action.preview')
  if (a === 'contact') return t('action.contact')
  return t('action.learn')
}

onMounted(async () => {
  try {
    const { api } = useApi()
    await Promise.all([
      loadCategories(),
      products.value.length ? Promise.resolve() : api('/api/products').then((r: any) => (products.value = r))
    ])
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.filters {
  display: grid;
  gap: 18px;
  margin: 28px 0 8px;
  padding: 20px;
  border-radius: 16px;
  background: rgba(12, 14, 24, 0.55);
  border: 1px solid rgba(167, 139, 250, 0.12);
  backdrop-filter: blur(12px);
}

.filter-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.cat-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.p-grid {
  margin-top: 24px;
}

.p-card {
  min-height: 240px;
}

.p-head {
  display: flex;
  gap: 12px;
  align-items: center;
}

.p-id {
  flex: 1;
  min-width: 0;
}

.p-id h3 {
  margin: 0;
  font-size: 1.02rem;
  color: var(--text-heading);
}

.p-tag {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.p-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.p-cat {
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 0.72rem;
}

.p-desc {
  margin: 0;
  flex: 1;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.p-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 4px;
  font-size: 0.82rem;
}

.p-more {
  color: color-mix(in srgb, var(--neon, #a78bfa) 85%, #fff);
  font-weight: 600;
}

.p-action {
  color: var(--text-muted);
  font-weight: 550;
}

.empty {
  margin: 40px 0;
  text-align: center;
  color: var(--text-muted);
}

.err {
  color: var(--danger);
}

.text-center {
  text-align: center;
}
</style>
