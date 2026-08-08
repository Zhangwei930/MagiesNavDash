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
            >
              <ProductIcon :product="item.product || {}" :size="toolLogo(item.product || {}) ? 28 : 20" />
            </div>

            <div class="dl-info">
              <div class="dl-line">
                <NuxtLink v-if="item.product" class="dl-name" :to="`/products/${item.product.slug}`">
                  {{ item.product.name }}
                </NuxtLink>
                <span v-else class="dl-name">—</span>
                <code class="dl-ver">v{{ feedFor(item)?.version || item.release.version }}</code>
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
                v-if="leadFile(item)"
                class="btn btn-primary"
                :href="leadFile(item)!.url"
                @click="track(item)"
              >{{ t('download.btn') }} {{ osName(current.os) }}</a>
              <button v-else type="button" class="btn btn-primary" @click="download(item)">
                {{ t('download.btn') }}
              </button>
              <span v-if="feedFor(item)" class="dl-source">{{ sourceNote(feedFor(item)!) }}</span>
            </div>
          </div>

          <div v-if="feedFor(item)" class="dl-platforms">
            <div
              v-for="column in groupByOs(feedFor(item)!.downloads)"
              :key="column.os"
              class="dl-plat"
              :data-current="column.os === current.os || null"
            >
              <div class="dl-plat-head">
                <span class="dl-plat-name">{{ osName(column.os) }}</span>
                <span v-if="column.os === current.os" class="dl-chip">
                  {{ t('download.yourSystem') }}
                </span>
              </div>

              <div v-for="variant in column.variants" :key="variant.arch" class="dl-variant">
                <span class="dl-plat-arch" :data-current="isCurrent(variant) || null">
                  {{ archName(variant.os, variant.arch) }}
                </span>
                <a
                  v-for="file in variant.files"
                  :key="file.url"
                  class="dl-file"
                  :href="file.url"
                  @click="track(item)"
                >
                  <span class="dl-file-kind">{{ fileKind(file.name) }}</span>
                  <span class="dl-file-size">{{ mb(file.size) }}</span>
                </a>
              </div>
            </div>
          </div>

          <p v-else-if="feedFailed(item)" class="dl-feed-err">
            {{ t('download.feedError') }}
          </p>
        </div>
      </div>

      <p class="dl-note">{{ t('download.note') }}</p>
      <p v-if="toast" class="muted" style="margin-top:12px">{{ toast }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toolColor, toolLogo } from '~/utils/toolMeta'
import { statusLabel, statusMeta } from '~/utils/productStatus'
import {
  detectPlatformHere,
  fetchLatestRelease,
  groupByOs,
  PRODUCT_RELEASE_SOURCES,
  releaseSourceFor,
  type Arch,
  type LatestRelease,
  type Os,
  type PlatformDownload
} from '~/utils/releaseFeed'

const { t, locale } = useI18n()
const loading = ref(true)
const error = ref('')
const toast = ref('')
const items = ref<any[]>([])
/** Live release feeds keyed by product slug (Terminal-style download mode). */
const feeds = ref<Record<string, LatestRelease>>({})
const feedErrors = ref<Record<string, boolean>>({})
const current = ref<{ os: Os; arch: Arch }>({ os: 'unknown', arch: 'x64' })

function feedFor(item: any): LatestRelease | null {
  const slug = item.product?.slug
  return slug && feeds.value[slug] ? feeds.value[slug] : null
}

function feedFailed(item: any): boolean {
  const slug = item.product?.slug
  return !!(slug && feedErrors.value[slug] && releaseSourceFor(slug))
}

/** The build matching the visitor's own machine, if this release ships one. */
function leadFile(item: any) {
  const feed = feedFor(item)
  if (!feed || current.value.os === 'unknown') return null
  const group =
    feed.downloads.find((d) => d.os === current.value.os && d.arch === current.value.arch) ||
    feed.downloads.find((d) => d.os === current.value.os)
  return group?.files[0] || null
}

function isCurrent(group: PlatformDownload): boolean {
  return group.os === current.value.os && group.arch === current.value.arch
}

function osName(os: Os): string {
  if (os === 'mac') return 'macOS'
  if (os === 'win') return 'Windows'
  if (os === 'linux') return 'Linux'
  if (os === 'android') return 'Android'
  return ''
}

function archName(os: Os, arch: Arch): string {
  if (os === 'mac') return arch === 'arm64' ? 'Apple Silicon' : 'Intel'
  if (os === 'android') return 'APK'
  return arch === 'arm64' ? 'ARM64' : 'x64'
}

function fileKind(name: string): string {
  const n = name.toLowerCase()
  if (n.endsWith('.dmg')) return 'DMG'
  if (n.endsWith('.appimage')) return 'AppImage'
  if (n.endsWith('.deb')) return 'DEB'
  if (n.endsWith('.apk')) return 'APK'
  if (n.endsWith('.zip')) return 'ZIP'
  if (n.endsWith('.exe')) return n.includes('portable') ? t('download.portable') : 'EXE'
  return name
}

function mb(size: number): string {
  return size ? `${(size / 1024 / 1024).toFixed(1)} MB` : ''
}

function sourceNote(feed: LatestRelease): string {
  return feed.source === 'mirror' ? t('download.sourceMirror') : t('download.sourceGithub')
}

function releaseMeta(item: any) {
  const feed = feedFor(item)
  const r = item.release
  const platforms = feed
    ? [...new Set(feed.downloads.map((d) => osName(d.os)).filter(Boolean))].join(' · ')
    : r.platform
  return [
    feed ? '' : r.fileSize ? mb(r.fileSize) : '',
    platforms,
    String(feed?.publishedAt || r.publishedAt || '').slice(0, 10)
  ]
    .filter(Boolean)
    .join(' · ')
}

/** Best-effort download logging; the anchor navigates regardless. */
function track(item: any) {
  const { api } = useApi()
  api('/api/downloads', {
    method: 'POST',
    body: JSON.stringify({ productId: item.product.id, releaseId: item.release.id })
  }).catch((e) => console.warn('Failed to record download', e))
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

/** Load live feeds for every product that has Terminal-style release sources. */
async function loadFeeds() {
  const present = new Set(
    items.value.map((i) => i.product?.slug).filter((s): s is string => !!s)
  )
  const sources = PRODUCT_RELEASE_SOURCES.filter((s) => present.has(s.slug))
  if (!sources.length) return

  await Promise.all(
    sources.map(async (source) => {
      try {
        feeds.value[source.slug] = await fetchLatestRelease(source)
      } catch (e) {
        feedErrors.value[source.slug] = true
        console.warn(`${source.label} release feed unavailable`, e)
      }
    })
  )
}

onMounted(async () => {
  current.value = await detectPlatformHere()
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
    return
  } finally {
    loading.value = false
  }

  await loadFeeds()
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

.dl-source {
  font-size: 0.72rem;
  text-align: center;
  color: var(--text-muted);
}

.dl-platforms {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1px;
  background: var(--card-border);
  border-top: 1px solid var(--card-border);
}

.dl-plat {
  padding: 14px 16px 16px;
  background: var(--card-bg);
}

.dl-plat[data-current] {
  background: color-mix(in srgb, var(--accent) 7%, var(--card-bg));
}

.dl-plat-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.dl-plat-name {
  font-size: 0.9rem;
  font-weight: 650;
  color: var(--text-heading);
}

.dl-variant + .dl-variant {
  margin-top: 12px;
}

.dl-plat-arch {
  display: block;
  margin-bottom: 4px;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.dl-plat-arch[data-current] {
  color: var(--accent);
}

.dl-chip {
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 999px;
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}

.dl-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 10px;
  margin-top: 4px;
  border-radius: 8px;
  font-size: 0.82rem;
  text-decoration: none;
  color: var(--text);
  border: 1px solid transparent;
}

.dl-file:hover {
  color: var(--accent-hover);
  border-color: color-mix(in srgb, var(--accent) 32%, transparent);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}

.dl-file-kind {
  font-weight: 600;
}

.dl-file-size {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.dl-feed-err {
  margin: 0;
  padding: 0 20px 16px;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.dl-note {
  margin-top: 20px;
  font-size: 0.84rem;
  line-height: 1.65;
  color: var(--text-muted);
}
</style>
