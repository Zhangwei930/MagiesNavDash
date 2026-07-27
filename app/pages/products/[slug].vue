<template>
  <div class="page">
    <div class="container">
      <NuxtLink to="/products" class="back">← {{ t('detail.back') }}</NuxtLink>

      <div v-if="loading" class="muted">{{ t('products.loading') }}</div>
      <div v-else-if="error" class="err">{{ error }}</div>

      <template v-else-if="detail">
        <header class="d-head">
          <div class="product-icon" :style="{ '--tint': color }">
            <component :is="icon" :size="22" :stroke-width="2" />
          </div>
          <div class="d-id">
            <div class="d-title-row">
              <h1>{{ detail.product.name }}</h1>
              <span class="status-badge" :data-tone="statusMeta(detail.product.status).tone">
                {{ statusLabel(detail.product.status, locale) }}
              </span>
            </div>
            <p class="d-tag">{{ detail.product.tagline }}</p>
            <p v-if="lineName" class="d-line">{{ lineName }}</p>
          </div>
          <div class="d-actions">
            <a
              v-if="primaryHref"
              class="btn btn-primary"
              :href="primaryHref"
              :target="primaryExternal ? '_blank' : undefined"
              :rel="primaryExternal ? 'noopener' : undefined"
              @click="onPrimary($event)"
            >{{ primaryLabel }}</a>
            <a
              v-if="detail.product.homepageUrl && primaryActionKey !== 'use'"
              class="btn btn-outline"
              :href="detail.product.homepageUrl"
              target="_blank"
              rel="noopener"
            >{{ t('detail.open') }}</a>
          </div>
        </header>

        <p
          v-if="isDev"
          class="note note-dev"
        >{{ t('detail.previewNote') }}</p>
        <p
          v-else-if="isEnterprise"
          class="note note-ent"
        >{{ t('detail.enterpriseNote') }}</p>

        <p v-if="detail.product.description" class="d-desc">{{ detail.product.description }}</p>

        <section v-if="detail.features?.length" class="d-section">
          <h2>{{ t('detail.features') }}</h2>
          <div class="f-grid">
            <div v-for="f in detail.features" :key="f.id" class="f-item">
              <strong>{{ f.title }}</strong>
              <span v-if="f.description">{{ f.description }}</span>
            </div>
          </div>
        </section>

        <section v-if="latest" class="d-section">
          <h2>{{ t('detail.release') }}</h2>
          <div class="r-latest">
            <div class="r-info">
              <div class="r-line">
                <code class="r-ver">v{{ latest.version }}</code>
                <span class="r-meta">{{ releaseMeta(latest) }}</span>
              </div>
              <p v-if="latest.changelog" class="r-log">{{ latest.changelog }}</p>
            </div>
            <button type="button" class="btn btn-primary" @click="download(latest.id)">
              {{ t('detail.download') }}
            </button>
          </div>

          <ul v-if="older.length" class="r-older">
            <li v-for="r in older" :key="r.id">
              <code>v{{ r.version }}</code>
              <span class="r-log">{{ r.changelog }}</span>
              <button type="button" class="r-link" @click="download(r.id)">
                {{ t('detail.download') }}
              </button>
            </li>
          </ul>

          <p v-if="msg" class="muted r-msg">{{ msg }}</p>
        </section>

        <section class="d-section">
          <h2>{{ t('detail.related') }}</h2>
          <div class="related-row">
            <NuxtLink class="btn btn-outline btn-sm" to="/solutions">{{ t('nav.solutions') }}</NuxtLink>
            <NuxtLink class="btn btn-outline btn-sm" to="/download">{{ t('nav.download') }}</NuxtLink>
            <NuxtLink class="btn btn-outline btn-sm" to="/contact">{{ t('detail.contact') }}</NuxtLink>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toolColor, toolIcon } from '~/utils/toolMeta'
import { primaryAction, statusLabel, statusMeta } from '~/utils/productStatus'

const { t, locale } = useI18n()
const route = useRoute()
const { loadCategories, categoryLabel } = useCategories()
const detail = ref<any>(null)
const loading = ref(true)
const error = ref('')
const msg = ref('')

const icon = computed(() => toolIcon(detail.value?.product || {}))
const color = computed(() => toolColor(detail.value?.product || {}))
const lineName = computed(() => categoryLabel(detail.value?.product?.categoryId))

const releases = computed<any[]>(() => detail.value?.releases || [])
const latest = computed(
  () => detail.value?.latestRelease || releases.value.find((r) => r.isLatest) || releases.value[0] || null
)
const older = computed(() => releases.value.filter((r) => r.id !== latest.value?.id))

const primaryActionKey = computed(() => primaryAction(detail.value?.product || {}))
const isDev = computed(() => {
  const s = (detail.value?.product?.status || '').toUpperCase()
  return s === 'IN_DEVELOPMENT' || s === 'COMING_SOON'
})
const isEnterprise = computed(() => (detail.value?.product?.status || '').toUpperCase() === 'ENTERPRISE')

const primaryLabel = computed(() => {
  const a = primaryActionKey.value
  if (a === 'download') return t('action.download')
  if (a === 'use') return t('action.use')
  if (a === 'preview') return t('action.subscribe')
  if (a === 'contact') return t('action.contact')
  return t('action.learn')
})

const primaryHref = computed(() => {
  const p = detail.value?.product
  if (!p) return null
  const a = primaryActionKey.value
  if (a === 'download') return '/download'
  if (a === 'use' && p.homepageUrl) return p.homepageUrl
  if (a === 'preview') return '/roadmap'
  if (a === 'contact') return '/contact'
  return null
})

const primaryExternal = computed(() => !!primaryHref.value?.startsWith('http'))

function releaseMeta(r: { fileSize?: number; platform?: string; publishedAt?: string }) {
  return [
    r.fileSize ? `${(r.fileSize / 1024 / 1024).toFixed(1)} MB` : '',
    r.platform,
    r.publishedAt ? String(r.publishedAt).slice(0, 10) : ''
  ]
    .filter(Boolean)
    .join(' · ')
}

function onPrimary(e: Event) {
  const href = primaryHref.value
  if (href && !href.startsWith('http')) {
    e.preventDefault()
    navigateTo(href)
  }
}

async function download(releaseId: number) {
  msg.value = ''
  try {
    const { api } = useApi()
    const res = await api('/api/downloads', {
      method: 'POST',
      body: JSON.stringify({ productId: detail.value.product.id, releaseId })
    })
    if (res.downloadUrl) window.open(res.downloadUrl, '_blank', 'noopener')
    else msg.value = res.message
  } catch (e: any) {
    msg.value = e.message || '下载失败'
  }
}

onMounted(async () => {
  try {
    const { api } = useApi()
    await loadCategories().catch(() => {})
    detail.value = await api(`/api/products/${route.params.slug}`)
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 24px;
  font-size: 0.88rem;
  color: var(--text-muted);
  text-decoration: none;
}

.back:hover {
  color: var(--accent-hover);
}

.d-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex-wrap: wrap;
}

.product-icon {
  --tint: var(--accent);
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--tint);
  background: radial-gradient(
    circle at 30% 25%,
    color-mix(in srgb, var(--tint) 28%, transparent),
    color-mix(in srgb, var(--tint) 9%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--tint) 38%, transparent);
}

.d-id {
  flex: 1;
  min-width: 0;
}

.d-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.d-id h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 750;
  letter-spacing: -0.02em;
  color: var(--text-heading);
}

.d-tag {
  margin: 6px 0 0;
  font-size: 0.95rem;
  color: var(--text);
}

.d-line {
  margin: 6px 0 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.d-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.note {
  margin: 18px 0 0;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.88rem;
  line-height: 1.65;
}

.note-dev {
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.28);
  color: var(--text);
}

.note-ent {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.28);
  color: var(--text);
}

.d-desc {
  margin: 18px 0 0;
  max-width: 66ch;
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--text-muted);
}

.d-section {
  margin-top: 40px;
}

.d-section h2 {
  margin: 0 0 16px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.f-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.f-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.f-item strong {
  font-size: 0.92rem;
  font-weight: 650;
  color: var(--text-heading);
}

.f-item span {
  font-size: 0.84rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.r-latest {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid var(--card-border);
  background: var(--card-bg);
}

.r-info {
  min-width: 0;
}

.r-line {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.r-ver {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 1rem;
  font-weight: 650;
  color: var(--text-heading);
}

.r-meta {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.r-log {
  margin: 6px 0 0;
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.r-older {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
}

.r-older li {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
}

.r-older li:last-child {
  border-bottom: 0;
}

.r-older code {
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: var(--text);
  flex-shrink: 0;
}

.r-older .r-log {
  margin: 0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.r-link {
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  color: var(--accent-hover);
  cursor: pointer;
  flex-shrink: 0;
}

.r-link:hover {
  text-decoration: underline;
}

.r-msg {
  margin-top: 12px;
  font-size: 0.85rem;
}

.related-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
