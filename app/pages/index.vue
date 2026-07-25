<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="container" style="text-align:center">
        <span class="hero-badge">{{ t('home.badge') }}</span>
        <div class="hero-avatar-wrap">
          <PlanetLogo />
        </div>
        <h1 class="hero-title">Build. Connect. Ship.</h1>
        <p class="subtitle">{{ t('home.lead') }}</p>
        <div class="hero-actions">
          <NuxtLink class="btn btn-primary" to="/products">{{ t('home.browse') }}</NuxtLink>
          <a class="btn btn-outline" href="https://shell.magies.top" target="_blank" rel="noopener">
            {{ t('home.openTerminal') }}
          </a>
          <a class="btn btn-outline" href="https://nav.magies.top" target="_blank" rel="noopener">
            {{ t('site.nav') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Products -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">{{ t('home.productsLabel') }}</span>
          <h2>{{ t('home.productsTitle') }}</h2>
          <p>{{ t('home.productsDesc') }}</p>
        </div>

        <div v-if="loading" class="muted text-center">{{ t('home.loading') }}</div>
        <div v-else-if="error" class="err text-center">{{ error }}</div>
        <div v-else class="grid grid-3">
          <a
            v-for="p in displayProducts"
            :key="p.id"
            class="card product-card-m"
            :href="p.homepageUrl || `/products/${p.slug}`"
            :target="p.homepageUrl ? '_blank' : undefined"
            :rel="p.homepageUrl ? 'noopener' : undefined"
            @click="onProductClick(p, $event)"
          >
            <div class="card-top">
              <div class="icon-circle" :style="{ '--tint': toolColor(p) }">
                <component :is="toolIcon(p)" :size="20" :stroke-width="2" />
              </div>
              <div>
                <h3>{{ displayName(p) }}</h3>
                <div class="tag">{{ p.tagline }}</div>
              </div>
            </div>
            <p class="desc">{{ shortDesc(p) }}</p>
          </a>
        </div>
      </div>
    </section>

    <!-- Featured: Terminal -->
    <section class="section section-alt">
      <div class="container">
        <div class="feature-split">
          <div class="feature-visual card">
            <div class="feature-mark">
              <BrandLogo size="lg" :show-wordmark="false" glow />
            </div>
            <h3 class="feature-name">MagiesTerminal</h3>
            <p class="muted">{{ t('home.terminalTag') }}</p>
          </div>
          <div class="feature-body">
            <span class="section-label">{{ t('home.featured') }}</span>
            <h2 class="feature-title">Terminal</h2>
            <p class="feature-desc">{{ t('home.terminalDesc') }}</p>
            <ul class="feature-list">
              <li>{{ t('home.terminalF1') }}</li>
              <li>{{ t('home.terminalF2') }}</li>
              <li>{{ t('home.terminalF3') }}</li>
            </ul>
            <div class="hero-actions" style="justify-content:flex-start;margin-top:20px">
              <a class="btn btn-primary" href="https://shell.magies.top" target="_blank" rel="noopener">
                {{ t('home.openTerminal') }}
              </a>
              <NuxtLink class="btn btn-outline" to="/download">{{ t('home.download') }}</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Magies sites in one place -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">{{ t('home.sitesLabel') }}</span>
          <h2>{{ t('home.sitesTitle') }}</h2>
          <p>{{ t('home.sitesDesc') }}</p>
        </div>
        <div class="site-row">
          <NuxtLink
            v-for="s in SITE_LINKS"
            :key="s.key"
            class="site-entry"
            :to="s.href"
            :target="s.external ? '_blank' : undefined"
            :rel="s.external ? 'noopener' : undefined"
          >
            <span class="site-name">{{ t(`site.${s.key}`) }}</span>
            <span class="site-host">{{ hostOf(s.href) }}</span>
            <span class="site-desc">{{ t(`site.${s.key}Desc`) }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Philosophy -->
    <section class="section">
      <div class="container" style="max-width:640px;text-align:center">
        <span class="section-label">{{ t('home.philosophyLabel') }}</span>
        <h2 style="margin:12px 0 14px">{{ t('home.philosophyTitle') }}</h2>
        <p class="muted" style="font-size:1.05rem;line-height:1.8">
          {{ t('home.philosophyBody') }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { toolColor, toolIcon } from '~/utils/toolMeta'
import { SITE_LINKS } from '~/utils/siteLinks'

const { t } = useI18n()
const products = useState<any[]>('hub-products', () => [])
const loading = ref(true)
const error = ref('')

const ORDER = ['magies-terminal', 'magies-shell', 'magies-nav', 'magies-hub']

const NAME_ALIAS: Record<string, string> = {
  // Sub-brand with its own site — keep the official one-word spelling.
  'magies-terminal': 'MagiesTerminal',
  'magies-shell': 'MagiesTerminal',
  'magies-nav': 'Nav',
  'magies-hub': 'Hub'
}

const displayProducts = computed(() => {
  const list = [...products.value]
  list.sort((a, b) => {
    const ia = ORDER.indexOf(a.slug)
    const ib = ORDER.indexOf(b.slug)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })
  return list.slice(0, 6)
})

function hostOf(href: string) {
  return href.startsWith('http') ? new URL(href).host : 'dash.magies.top'
}

function displayName(p: { slug?: string; name?: string }) {
  return (p.slug && NAME_ALIAS[p.slug]) || p.name || 'Product'
}

/** Description, not tagline — the tagline already renders as the card's tag line. */
function shortDesc(p: { description?: string; tagline?: string }) {
  const text = p.description || ''
  return text.length > 72 ? text.slice(0, 70) + '…' : text
}

function onProductClick(p: any, e: Event) {
  if (!p.homepageUrl) {
    e.preventDefault()
    navigateTo(`/products/${p.slug}`)
  }
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
.site-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
}

.site-entry {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid var(--card-border);
  background: var(--card-bg);
  text-decoration: none;
  transition: transform 0.18s, border-color 0.18s, box-shadow 0.18s;
}

.site-entry:hover {
  transform: translateY(-3px);
  border-color: rgba(167, 139, 250, 0.42);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.35);
}

.site-name {
  font-size: 0.98rem;
  font-weight: 650;
  color: var(--text-heading);
}

.site-host {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.74rem;
  color: var(--accent-hover);
  opacity: 0.85;
}

.site-desc {
  margin-top: 4px;
  font-size: 0.84rem;
  line-height: 1.6;
  color: var(--text-muted);
}
</style>
