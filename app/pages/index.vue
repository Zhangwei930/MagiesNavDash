<template>
  <div class="home">
    <!-- 1. Brand Hero -->
    <section class="hero">
      <div class="container" style="text-align:center">
        <span class="hero-badge">{{ t('home.badge') }}</span>
        <div class="hero-avatar-wrap">
          <PlanetLogo />
        </div>
        <h1 class="hero-title">Build. Connect. Ship.</h1>
        <p class="hero-claim">{{ t('home.claim') }}</p>
        <p class="subtitle">{{ t('home.lead') }}</p>
        <div class="hero-actions">
          <NuxtLink class="btn btn-primary" to="/products">{{ t('home.explore') }}</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/about">{{ t('home.learn') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- 2. Four product lines -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">{{ t('home.linesLabel') }}</span>
          <h2>{{ t('home.linesTitle') }}</h2>
          <p>{{ t('home.linesDesc') }}</p>
        </div>
        <div class="grid grid-4 line-grid">
          <NuxtLink
            v-for="line in PRODUCT_LINES"
            :key="line.key"
            class="card line-card"
            :to="line.href"
          >
            <span class="line-index" :style="{ color: line.color }">{{ line.index }}</span>
            <h3>{{ t(`home.line.${line.key}`) }}</h3>
            <p>{{ t(`home.line.${line.key}Desc`) }}</p>
            <span class="card-link">{{ t('action.learn') }} →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 3. Featured products by maturity -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-label">{{ t('home.featuredLabel') }}</span>
          <h2>{{ t('home.featuredTitle') }}</h2>
          <p>{{ t('home.featuredDesc') }}</p>
        </div>

        <div v-if="loading" class="muted text-center">{{ t('home.loading') }}</div>
        <div v-else-if="error" class="err text-center">{{ error }}</div>
        <div v-else class="grid grid-3">
          <article
            v-for="p in featuredProducts"
            :key="p.id"
            class="card featured-card"
          >
            <div class="card-top">
              <div class="icon-circle" :style="{ '--tint': toolColor(p) }">
                <component :is="toolIcon(p)" :size="20" :stroke-width="2" />
              </div>
              <div class="featured-id">
                <h3>{{ p.name }}</h3>
                <span class="status-badge" :data-tone="statusMeta(p.status).tone">
                  {{ statusLabel(p.status, locale) }}
                </span>
              </div>
            </div>
            <p class="tagline">{{ p.tagline }}</p>
            <p class="desc">{{ shortDesc(p) }}</p>
            <div class="featured-actions">
              <a
                v-if="actionHref(p)"
                class="btn btn-primary btn-sm"
                :href="actionHref(p)"
                :target="isExternal(actionHref(p)!) ? '_blank' : undefined"
                :rel="isExternal(actionHref(p)!) ? 'noopener' : undefined"
                @click="onPrimary(p, $event)"
              >{{ actionLabel(p) }}</a>
              <NuxtLink class="btn btn-outline btn-sm" :to="`/products/${p.slug}`">
                {{ t('action.learn') }}
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 4. Scenarios -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">{{ t('home.scenariosLabel') }}</span>
          <h2>{{ t('home.scenariosTitle') }}</h2>
          <p>{{ t('home.scenariosDesc') }}</p>
        </div>
        <div class="grid grid-2 scenario-grid">
          <NuxtLink
            v-for="s in scenarios"
            :key="s.to"
            class="card scenario-card"
            :to="s.to"
          >
            <h3>{{ t(s.titleKey) }}</h3>
            <p>{{ t(s.descKey) }}</p>
            <span class="card-link">{{ t('action.learn') }} →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 5. Unified experience (honest stages) -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-label">{{ t('home.experienceLabel') }}</span>
          <h2>{{ t('home.experienceTitle') }}</h2>
          <p>{{ t('home.experienceDesc') }}</p>
        </div>
        <div class="grid grid-3 exp-grid">
          <div class="card exp-card">
            <span class="section-label">{{ t('home.exp.done') }}</span>
            <ul class="exp-list">
              <li v-for="k in doneKeys" :key="k">{{ t(k) }}</li>
            </ul>
          </div>
          <div class="card exp-card">
            <span class="section-label">{{ t('home.exp.doing') }}</span>
            <ul class="exp-list">
              <li v-for="k in doingKeys" :key="k">{{ t(k) }}</li>
            </ul>
          </div>
          <div class="card exp-card">
            <span class="section-label">{{ t('home.exp.next') }}</span>
            <ul class="exp-list">
              <li v-for="k in nextKeys" :key="k">{{ t(k) }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. CTA -->
    <section class="section">
      <div class="container" style="max-width:640px;text-align:center">
        <span class="section-label">{{ t('home.ctaLabel') }}</span>
        <h2 style="margin:12px 0 20px">{{ t('home.ctaTitle') }}</h2>
        <div class="hero-actions">
          <NuxtLink class="btn btn-primary" to="/products">{{ t('home.ctaProducts') }}</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/roadmap">{{ t('home.ctaUpdates') }}</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/contact">{{ t('home.ctaContact') }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { toolColor, toolIcon } from '~/utils/toolMeta'
import { PRODUCT_LINES } from '~/utils/productLines'
import { primaryAction, statusLabel, statusMeta } from '~/utils/productStatus'
import type { MsgKey } from '~/composables/useI18n'

const { t, locale } = useI18n()
const products = useState<any[]>('hub-products', () => [])
const loading = ref(true)
const error = ref('')

const FEATURED_ORDER = ['magies-terminal', 'magies-shell', 'magies-data-studio', 'magies-nav']

const scenarios = [
  { to: '/solutions/remote-servers', titleKey: 'home.scenario.remote' as MsgKey, descKey: 'home.scenario.remoteDesc' as MsgKey },
  { to: '/solutions/data-automation', titleKey: 'home.scenario.data' as MsgKey, descKey: 'home.scenario.dataDesc' as MsgKey },
  { to: '/solutions/enterprise', titleKey: 'home.scenario.biz' as MsgKey, descKey: 'home.scenario.bizDesc' as MsgKey },
  { to: '/solutions/personal', titleKey: 'home.scenario.personal' as MsgKey, descKey: 'home.scenario.personalDesc' as MsgKey }
]

const doneKeys: MsgKey[] = ['home.exp.done1', 'home.exp.done2', 'home.exp.done3', 'home.exp.done4']
const doingKeys: MsgKey[] = ['home.exp.doing1', 'home.exp.doing2', 'home.exp.doing3', 'home.exp.doing4']
const nextKeys: MsgKey[] = ['home.exp.next1', 'home.exp.next2', 'home.exp.next3', 'home.exp.next4']

const featuredProducts = computed(() => {
  const list = [...products.value]
  list.sort((a, b) => {
    const ia = FEATURED_ORDER.indexOf(a.slug)
    const ib = FEATURED_ORDER.indexOf(b.slug)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })
  // Prefer Terminal / Data Studio / Nav; fall back to first 3 catalog items
  const picked = list.filter((p) => FEATURED_ORDER.includes(p.slug)).slice(0, 3)
  if (picked.length >= 3) return picked
  return list.slice(0, 3)
})

function shortDesc(p: { description?: string }) {
  const text = p.description || ''
  return text.length > 96 ? text.slice(0, 94) + '…' : text
}

function actionLabel(p: any) {
  const a = primaryAction(p)
  if (a === 'download') return t('action.download')
  if (a === 'use') return t('action.use')
  if (a === 'preview') return t('action.preview')
  if (a === 'contact') return t('action.contact')
  return t('action.learn')
}

function actionHref(p: any): string | null {
  const a = primaryAction(p)
  if (a === 'download') return '/download'
  if (a === 'use' && p.homepageUrl) return p.homepageUrl
  if (a === 'preview') return `/products/${p.slug}`
  if (a === 'contact') return '/contact'
  return `/products/${p.slug}`
}

function isExternal(href: string) {
  return href.startsWith('http')
}

function onPrimary(p: any, e: Event) {
  const href = actionHref(p)
  if (href && !isExternal(href) && href.startsWith('/')) {
    e.preventDefault()
    navigateTo(href)
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
.hero-claim {
  margin: 0 auto 10px;
  font-size: clamp(1.05rem, 2.2vw, 1.25rem);
  font-weight: 600;
  color: var(--text-heading);
  letter-spacing: 0.01em;
}

.line-card {
  text-decoration: none;
  color: inherit;
  min-height: 100%;
}

.line-index {
  display: block;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  opacity: 0.9;
}

.featured-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.featured-id {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.featured-id h3 {
  margin: 0;
}

.tagline {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 550;
  color: var(--text);
}

.desc {
  margin: 0;
  flex: 1;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-muted);
}

.featured-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.scenario-card {
  text-decoration: none;
  color: inherit;
}

.scenario-card h3 {
  margin-bottom: 6px;
}

.exp-list {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.exp-list li {
  position: relative;
  padding-left: 18px;
  font-size: 0.92rem;
  color: var(--text);
}

.exp-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ring-gradient);
}
</style>
