<template>
  <div class="page">
    <div class="container">
      <h1 class="page-title">{{ t('download.title') }}</h1>
      <p class="page-desc">{{ t('download.desc') }}</p>

      <div v-if="loading" class="muted">{{ t('download.loading') }}</div>
      <div v-else-if="error" class="err">{{ error }}</div>
      <div v-else-if="!items.length" class="empty">{{ t('download.empty') }}</div>

      <div v-else class="dl-list">
        <div v-for="item in items" :key="item.release.id" class="dl-row">
          <div class="dl-icon" :style="{ '--tint': toolColor(item.product || {}) }">
            <component :is="toolIcon(item.product || {})" :size="20" :stroke-width="2" />
          </div>

          <div class="dl-info">
            <div class="dl-line">
              <NuxtLink v-if="item.product" class="dl-name" :to="`/products/${item.product.slug}`">
                {{ item.product.name }}
              </NuxtLink>
              <span v-else class="dl-name">—</span>
              <code class="dl-ver">v{{ item.release.version }}</code>
              <span class="dl-meta">{{ releaseMeta(item.release) }}</span>
            </div>
            <p v-if="item.release.changelog" class="dl-log">{{ item.release.changelog }}</p>
          </div>

          <button type="button" class="btn btn-primary" @click="download(item)">
            {{ t('download.btn') }}
          </button>
        </div>
      </div>

      <p v-if="toast" class="muted" style="margin-top:12px">{{ toast }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toolColor, toolIcon } from '~/utils/toolMeta'

const { t } = useI18n()
const loading = ref(true)
const error = ref('')
const toast = ref('')
const items = ref<any[]>([])

function releaseMeta(r: { fileSize?: number; platform?: string; publishedAt?: string }) {
  return [
    r.fileSize ? `${(r.fileSize / 1024 / 1024).toFixed(1)} MB` : '',
    r.platform,
    r.publishedAt ? String(r.publishedAt).slice(0, 10) : ''
  ]
    .filter(Boolean)
    .join(' · ')
}

async function download(item: any) {
  toast.value = ''
  try {
    const { api } = useApi()
    const res = await api('/api/downloads', {
      method: 'POST',
      body: JSON.stringify({ productId: item.product.id, releaseId: item.release.id })
    })
    if (res.downloadUrl) window.open(res.downloadUrl, '_blank', 'noopener')
    else toast.value = res.message
  } catch (e: any) {
    toast.value = e.message || '失败'
  }
}

onMounted(async () => {
  try {
    const { api } = useApi()
    const [products, releases] = await Promise.all([
      api<any[]>('/api/products'),
      api<any[]>('/api/releases/latest')
    ])
    const map = Object.fromEntries(products.map((p) => [p.id, p]))
    items.value = releases.map((r) => ({ release: r, product: map[r.productId] }))
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dl-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dl-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid var(--card-border);
  background: var(--card-bg);
}

.dl-icon {
  --tint: var(--accent);
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--tint);
  background: radial-gradient(
    circle at 30% 25%,
    color-mix(in srgb, var(--tint) 26%, transparent),
    color-mix(in srgb, var(--tint) 8%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--tint) 38%, transparent);
}

.dl-info {
  flex: 1;
  min-width: 200px;
}

.dl-line {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.dl-name {
  font-size: 1rem;
  font-weight: 650;
  color: var(--text-heading);
  text-decoration: none;
}

.dl-name:hover {
  color: var(--accent-hover);
}

.dl-ver {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.85rem;
  color: var(--text);
}

.dl-meta {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.dl-log {
  margin: 6px 0 0;
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--text-muted);
}
</style>
