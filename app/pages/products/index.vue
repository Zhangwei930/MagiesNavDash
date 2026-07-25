<template>
  <div class="page">
    <div class="container">
      <h1 class="page-title">{{ t('products.title') }}</h1>

      <div v-if="loading" class="muted">{{ t('products.loading') }}</div>
      <div v-else-if="error" class="err">{{ error }}</div>
      <div v-else-if="!list.length" class="empty">{{ t('products.empty') }}</div>
      <div v-else class="grid grid-3 p-grid">
        <NuxtLink v-for="p in list" :key="p.id" class="card p-card" :to="`/products/${p.slug}`">
          <div class="p-head">
            <div class="icon-circle" :style="{ '--tint': toolColor(p) }">
              <component :is="toolIcon(p)" :size="20" :stroke-width="2" />
            </div>
            <div class="p-id">
              <h3>{{ p.name }}</h3>
              <span class="p-tag">{{ p.tagline || categoryLabel(p.categoryId) }}</span>
            </div>
          </div>

          <p v-if="p.description" class="p-desc">{{ p.description }}</p>

          <div class="p-foot">
            <span class="p-more">{{ t('products.detail') }} →</span>
            <button
              v-if="p.homepageUrl"
              type="button"
              class="p-open"
              @click.stop.prevent="open(p.homepageUrl)"
            >{{ t('products.open') }} ↗</button>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { categoryLabel, toolColor, toolIcon } from '~/utils/toolMeta'

const { t } = useI18n()
const products = useState<any[]>('hub-products', () => [])
const loading = ref(true)
const error = ref('')

const list = computed(() =>
  [...products.value].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
)

function open(url: string) {
  window.open(url, '_blank', 'noopener')
}

onMounted(async () => {
  if (products.value.length) {
    loading.value = false
    return
  }
  try {
    const { api } = useApi()
    products.value = await api('/api/products')
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.p-grid {
  margin-top: 24px;
}

.p-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-decoration: none;
  color: inherit;
}

.p-card:hover {
  transform: translateY(-3px);
  border-color: rgba(167, 139, 250, 0.4);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(167, 139, 250, 0.12);
}

.p-head {
  display: flex;
  gap: 12px;
  align-items: center;
}

.p-id h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-heading);
}

.p-tag {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.p-desc {
  margin: 0;
  flex: 1;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-muted);
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
  color: var(--accent-hover);
  opacity: 0.75;
  transition: opacity 0.18s;
}

.p-card:hover .p-more {
  opacity: 1;
}

.p-open {
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
}

.p-open:hover {
  background: var(--surface-hover);
  border-color: rgba(167, 139, 250, 0.45);
  color: var(--accent-hover);
}
</style>
