<template>
  <div class="page download-page">
    <div class="container">
      <PageHero
        :eyebrow="t('nav.download')"
        :title="t('download.title')"
        :desc="t('download.desc')"
      />

      <div v-if="loading" class="muted text-center">{{ t('download.loading') }}</div>
      <div v-else-if="error" class="err text-center">{{ error }}</div>
      <div v-else-if="!items.length" class="empty">{{ t('download.empty') }}</div>

      <div v-else class="dl-list">
        <div v-for="item in items" :key="item.release.id" class="dl-card">
          <div class="dl-row">
            <div
              class="dl-icon"
              :style="{ '--tint': toolColor(item.product || {}) }"
              :data-logo="toolLogo(item.product || {}) ? '' : null"
              :data-logo-lg="toolLogoIsLarge(item.product || {}) || null"
            >
              <ProductIcon
                :product="item.product || {}"
                :size="
                  toolLogo(item.product || {})
                    ? toolLogoDisplaySize(item.product || {}, 'list')
                    : 20
                "
              />
            </div>

            <div class="dl-info">
              <div class="dl-line">
                <NuxtLink v-if="item.product" class="dl-name" :to="`/products/${item.product.slug}`">
                  {{ item.product.name }}
                </NuxtLink>
                <span v-else class="dl-name">—</span>
                <code v-if="item.release.version" class="dl-ver">v{{ item.release.version }}</code>
                <span
                  v-if="item.product?.status"
                  class="status-badge"
                  :data-tone="statusMeta(item.product.status).tone"
                >{{ statusLabel(item.product.status, locale) }}</span>
                <span class="dl-meta">{{ releaseMeta(item) }}</span>
              </div>
              <p v-if="item.release.changelog" class="dl-log">{{ item.release.changelog }}</p>
            </div>

            <div class="dl-actions">
              <a
                v-if="siteUrl(item)"
                class="btn btn-primary"
                :href="siteUrl(item)!"
                target="_blank"
                rel="noopener"
                @click="track(item)"
              >{{ t('download.btn') }}</a>
              <button v-else type="button" class="btn btn-primary" disabled>
                {{ t('download.btn') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p class="dl-note">{{ t('download.note') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toolColor, toolLogo, toolLogoDisplaySize, toolLogoIsLarge } from '~/utils/toolMeta'
import { statusLabel, statusMeta } from '~/utils/productStatus'

const { t, locale } = useI18n()
const loading = ref(true)
const error = ref('')
const items = ref<any[]>([])

/**
 * Official product download / site destinations.
 * Prefer product homepage; fall back to known download landing pages.
 */
const SITE_BY_SLUG: Record<string, string> = {
  'magies-terminal': 'https://shell.magies.top/#download',
  'magies-shell': 'https://shell.magies.top/#download',
  'magies-office': 'https://github.com/Zhangwei930/MagiesPdf/releases/latest',
  'magies-pdf': 'https://github.com/Zhangwei930/MagiesPdf/releases/latest',
  'magies-nav': 'https://nav.magies.top',
  'magies-game': 'https://tech.magies.top'
}

function siteUrl(item: any): string | null {
  const slug = item.product?.slug as string | undefined
  if (slug && SITE_BY_SLUG[slug]) return SITE_BY_SLUG[slug]
  if (item.product?.homepageUrl) return item.product.homepageUrl
  if (item.release?.downloadUrl) return item.release.downloadUrl
  return null
}

function mb(size: number): string {
  return size ? `${(size / 1024 / 1024).toFixed(1)} MB` : ''
}

function releaseMeta(item: any) {
  const r = item.release
  return [r.fileSize ? mb(r.fileSize) : '', r.platform, String(r.publishedAt || '').slice(0, 10)]
    .filter(Boolean)
    .join(' · ')
}

/** Best-effort download logging; the anchor navigates regardless. */
function track(item: any) {
  if (!item.product?.id || !item.release?.id) return
  const { api } = useApi()
  const { sessionId } = useHubTrack()
  api('/api/downloads', {
    method: 'POST',
    body: JSON.stringify({
      productId: item.product.id,
      releaseId: item.release.id,
      sessionId: sessionId()
    })
  }).catch((e) => console.warn('Failed to record download', e))
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
    error.value = e.message || t('common.loadFailed')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.text-center {
  text-align: center;
}

.empty {
  margin: 32px 0;
  text-align: center;
  color: var(--text-muted);
}

.err {
  color: var(--danger);
}

.dl-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 12px;
}

.dl-card {
  border-radius: 16px;
  border: 1px solid rgba(167, 139, 250, 0.16);
  background: rgba(12, 14, 24, 0.72);
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.32);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.dl-card:hover {
  border-color: rgba(167, 139, 250, 0.32);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.38), 0 0 28px rgba(167, 139, 250, 0.08);
}

.dl-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 20px;
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

.dl-icon[data-logo] {
  background: rgba(8, 10, 18, 0.4);
  box-shadow: none;
}

.dl-icon[data-logo-lg] {
  width: 48px;
  height: 48px;
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

.dl-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.dl-note {
  margin-top: 20px;
  font-size: 0.84rem;
  line-height: 1.65;
  color: var(--text-muted);
}
</style>
