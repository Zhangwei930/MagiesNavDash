<template>
  <div ref="root" class="home-v2">
    <!-- HERO -->
    <section class="hero-v2">
      <div class="hero-horizon" aria-hidden="true" />
      <div class="hero-stars" aria-hidden="true" />
      <div class="container hero-v2-grid">
        <div class="hero-copy">
          <div class="hero-badges" data-hero-in>
            <span>AI Native</span>
            <span>Data Driven</span>
            <span>{{ t('home.badgeFuture') }}</span>
          </div>
          <h1 class="hero-v2-title" data-hero-in>
            <span class="line">Build. Automate.</span>
            <span class="line accent">{{ t('home.titleAccent') }}</span>
          </h1>
          <p class="hero-v2-lead" data-hero-in>{{ t('home.lead') }}</p>
          <div class="hero-actions" data-hero-in>
            <NuxtLink class="btn btn-primary btn-glow" to="/products">
              {{ t('home.explore') }}
              <span class="btn-arrow">→</span>
            </NuxtLink>
            <NuxtLink class="btn btn-outline btn-glass" to="/about">
              <span class="play-dot" />
              {{ t('home.watch') }}
            </NuxtLink>
          </div>
          <div class="hero-trust" data-hero-in>
            <div class="trust-avatars" aria-hidden="true">
              <span v-for="i in 4" :key="i" class="trust-av" :style="{ '--i': i }" />
            </div>
            <p>{{ t('home.trust') }}</p>
          </div>
        </div>
        <div class="hero-visual" data-hero-visual>
          <HeroOrbit />
        </div>
      </div>
    </section>

    <!-- STATS (honest product metrics, not marketing vanity numbers) -->
    <section class="stats-wrap container">
      <div class="stats-bar" data-reveal>
        <div v-for="s in stats" :key="s.key" class="stat-item">
          <span class="stat-icon" :style="{ color: s.color }">{{ s.icon }}</span>
          <div>
            <strong class="stat-value">{{ s.value }}</strong>
            <span class="stat-label">{{ t(s.labelKey) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCTS -->
    <section class="section products-section">
      <div class="container">
        <div class="section-header" data-reveal>
          <h2>{{ t('home.productsTitle') }}</h2>
          <p>{{ t('home.productsDesc') }}</p>
        </div>

        <div v-if="loading" class="muted text-center">{{ t('home.loading') }}</div>
        <div v-else-if="error" class="err text-center">{{ error }}</div>
        <div v-else class="product-neon-grid" data-reveal-stagger>
          <NuxtLink
            v-for="card in productCards"
            :key="card.key"
            class="neon-card"
            :to="card.to"
            :style="{ '--neon': card.color }"
          >
            <div class="neon-icon">
              <component :is="card.icon" :size="22" :stroke-width="1.75" />
            </div>
            <h3>{{ card.name }}</h3>
            <p>{{ card.desc }}</p>
            <span class="neon-link">{{ t('action.learn') }} →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- SHOWCASE -->
    <section class="section section-alt showcase-section">
      <div class="container">
        <div class="section-header" data-reveal>
          <h2>{{ t('home.showcaseTitle') }}</h2>
          <p>{{ t('home.showcaseDesc') }}</p>
        </div>
        <HomeShowcase />
      </div>
    </section>

    <!-- WHY + ECOSYSTEM -->
    <section class="section why-eco-section">
      <div class="container why-eco-grid">
        <div class="why-block">
          <div class="section-header left" data-reveal>
            <h2>{{ t('home.whyTitle') }}</h2>
          </div>
          <div class="why-grid" data-reveal-stagger>
            <div v-for="w in whyItems" :key="w.key" class="why-card">
              <span class="why-icon" :style="{ color: w.color }">{{ w.icon }}</span>
              <h3>{{ t(w.titleKey) }}</h3>
              <p>{{ t(w.descKey) }}</p>
            </div>
          </div>
          <div class="galaxy-panel" data-reveal aria-hidden="true">
            <div class="galaxy-spiral" />
            <div class="galaxy-pills">
              <span>{{ t('home.pillPossibilities') }}</span>
              <span>{{ t('home.pillUniverse') }}</span>
              <span>{{ t('home.pillConnected') }}</span>
            </div>
          </div>
        </div>

        <div class="eco-block">
          <div class="section-header left" data-reveal>
            <h2>{{ t('home.ecoTitle') }}</h2>
          </div>
          <HomeEcosystem />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-panel" data-reveal>
          <h2>{{ t('home.ctaTitle') }}</h2>
          <p>{{ t('home.ctaLead') }}</p>
          <div class="hero-actions">
            <NuxtLink class="btn btn-primary btn-glow" to="/products">{{ t('home.ctaProducts') }}</NuxtLink>
            <NuxtLink class="btn btn-outline btn-glass" to="/roadmap">{{ t('home.ctaUpdates') }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Terminal,
  FileText,
  Database,
  Sparkles,
  Cloud,
  Compass,
  type LucideIcon
} from 'lucide-vue-next'
import { toolColor, toolIcon } from '~/utils/toolMeta'
import type { MsgKey } from '~/composables/useI18n'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
useReveal(root)

const products = useState<any[]>('hub-products', () => [])
const loading = ref(true)
const error = ref('')

const publicProductCount = computed(() => {
  return (products.value || []).filter((p) => p.status !== 'HIDDEN' && p.slug !== 'magies-hub').length
})

const stats = computed(() => [
  { key: 'lines', value: '4', labelKey: 'home.stat.lines' as MsgKey, icon: '◎', color: '#60a5fa' },
  {
    key: 'products',
    value: publicProductCount.value ? String(publicProductCount.value) : '—',
    labelKey: 'home.stat.products' as MsgKey,
    icon: '✦',
    color: '#a78bfa'
  },
  { key: 'locales', value: '2', labelKey: 'home.stat.locales' as MsgKey, icon: '文', color: '#34d399' },
  { key: 'platforms', value: '3', labelKey: 'home.stat.platforms' as MsgKey, icon: '▦', color: '#fb923c' }
])

const whyItems = [
  { key: 'ai', icon: '✦', color: '#a78bfa', titleKey: 'home.why.ai' as MsgKey, descKey: 'home.why.aiDesc' as MsgKey },
  { key: 'simple', icon: '◎', color: '#60a5fa', titleKey: 'home.why.simple' as MsgKey, descKey: 'home.why.simpleDesc' as MsgKey },
  { key: 'secure', icon: '▣', color: '#34d399', titleKey: 'home.why.secure' as MsgKey, descKey: 'home.why.secureDesc' as MsgKey },
  { key: 'open', icon: '⇄', color: '#fb923c', titleKey: 'home.why.open' as MsgKey, descKey: 'home.why.openDesc' as MsgKey }
]

/** Showcase grid: real catalog first, then brand matrix fillers for visual density. */
const FALLBACK_CARDS: { key: string; name: string; desc: string; color: string; icon: LucideIcon; to: string }[] = [
  {
    key: 'terminal',
    name: 'Magies Terminal',
    desc: 'Beautiful terminal for developers and teams.',
    color: '#22d3ee',
    icon: Terminal,
    to: '/products/magies-terminal'
  },
  {
    key: 'pdf',
    name: 'Magies PDF',
    desc: 'AI-powered PDF tools for productivity.',
    color: '#f472b6',
    icon: FileText,
    to: '/products/magies-pdf'
  },
  {
    key: 'studio',
    name: 'Magies Data Studio',
    desc: 'Collect, clean and visualize data with ease.',
    color: '#a78bfa',
    icon: Database,
    to: '/products/magies-data-studio'
  },
  {
    key: 'nav',
    name: 'Magies Nav',
    desc: 'Unified entry to systems and tools you use.',
    color: '#60a5fa',
    icon: Compass,
    to: '/products/magies-nav'
  },
  {
    key: 'ai',
    name: 'Magies AI',
    desc: 'Your intelligent assistant for every task.',
    color: '#818cf8',
    icon: Sparkles,
    to: '/roadmap'
  },
  {
    key: 'cloud',
    name: 'Magies Cloud',
    desc: 'Secure cloud services built for performance.',
    color: '#38bdf8',
    icon: Cloud,
    to: '/roadmap'
  }
]

const productCards = computed(() => {
  const list = (products.value || []).filter((p) => p.status !== 'HIDDEN' && p.slug !== 'magies-hub')
  if (!list.length) return FALLBACK_CARDS

  const fromApi = list.slice(0, 6).map((p) => ({
    key: p.slug,
    name: p.name,
    desc: p.tagline || shortDesc(p),
    color: toolColor(p),
    icon: toolIcon(p),
    to: `/products/${p.slug}`
  }))

  if (fromApi.length >= 6) return fromApi
  const used = new Set(fromApi.map((c) => c.key))
  const fillers = FALLBACK_CARDS.filter((c) => !used.has(c.key) && !fromApi.some((a) => a.name === c.name))
  return [...fromApi, ...fillers].slice(0, 6)
})

function shortDesc(p: { description?: string }) {
  const text = p.description || ''
  return text.length > 72 ? text.slice(0, 70) + '…' : text
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
.home-v2 {
  overflow: hidden;
}

/* —— HERO —— */
.hero-v2 {
  position: relative;
  padding: 48px 0 28px;
  min-height: min(92vh, 860px);
  display: flex;
  align-items: center;
}

.hero-horizon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8%;
  height: 42%;
  pointer-events: none;
  background:
    radial-gradient(ellipse 90% 70% at 50% 100%, rgba(56, 189, 248, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 50% 110%, rgba(167, 139, 250, 0.22) 0%, transparent 50%),
    linear-gradient(180deg, transparent 0%, rgba(8, 12, 28, 0.4) 40%, rgba(5, 8, 18, 0.85) 100%);
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 35%, #000 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 35%, #000 100%);
}

.hero-horizon::after {
  content: "";
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: 18%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(96, 165, 250, 0.15),
    rgba(251, 146, 60, 0.55),
    rgba(244, 114, 182, 0.35),
    rgba(96, 165, 250, 0.15),
    transparent
  );
  box-shadow: 0 0 40px rgba(251, 146, 60, 0.35);
}

.hero-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.7;
  background-image:
    radial-gradient(1px 1px at 8% 20%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1.2px 1.2px at 22% 60%, rgba(196, 181, 253, 0.7), transparent),
    radial-gradient(1px 1px at 40% 15%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1px 1px at 58% 45%, rgba(96, 165, 250, 0.65), transparent),
    radial-gradient(1.4px 1.4px at 75% 18%, rgba(251, 146, 60, 0.55), transparent),
    radial-gradient(1px 1px at 88% 55%, rgba(255, 255, 255, 0.45), transparent),
    radial-gradient(1px 1px at 15% 80%, rgba(244, 114, 182, 0.4), transparent);
  animation: starsDrift 40s linear infinite;
}

.hero-v2-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 32px 40px;
  align-items: center;
  width: 100%;
  max-width: 1180px;
}

.hero-copy {
  max-width: 560px;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.hero-badges span {
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  padding: 5px 12px;
  border-radius: 999px;
  color: #ddd6fe;
  background: linear-gradient(
    90deg,
    rgba(96, 165, 250, 0.14),
    rgba(167, 139, 250, 0.16),
    rgba(251, 146, 60, 0.1)
  );
  border: 1px solid rgba(167, 139, 250, 0.22);
}

.hero-v2-title {
  margin: 0 0 18px;
  font-size: clamp(2.4rem, 5.6vw, 3.75rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.08;
  color: #f8fafc;
}

.hero-v2-title .line {
  display: block;
}

.hero-v2-title .accent {
  background: linear-gradient(105deg, #c4b5fd 0%, #e879f9 35%, #fb923c 70%, #fbbf24 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 24px rgba(232, 121, 249, 0.25));
}

.hero-v2-lead {
  margin: 0 0 28px;
  font-size: clamp(0.98rem, 1.8vw, 1.12rem);
  color: var(--text-muted);
  line-height: 1.75;
  max-width: 48ch;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
}

.btn-glow {
  box-shadow:
    0 4px 24px rgba(167, 139, 250, 0.4),
    0 0 40px rgba(96, 165, 250, 0.15) !important;
}

.btn-arrow {
  margin-left: 2px;
  transition: transform 0.2s;
}

.btn-glow:hover .btn-arrow {
  transform: translateX(3px);
}

.btn-glass {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.04) !important;
}

.play-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.6);
}

.hero-trust {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trust-avatars {
  display: flex;
}

.trust-av {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(5, 6, 10, 0.9);
  margin-left: calc(var(--i, 1) * -6px + 6px);
  background:
    linear-gradient(
      135deg,
      hsl(calc(210 + var(--i) * 28), 75%, 62%),
      hsl(calc(280 + var(--i) * 20), 70%, 58%)
    );
  box-shadow: 0 0 0 1px rgba(167, 139, 250, 0.15);
}

.hero-trust p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px;
  filter: drop-shadow(0 0 60px rgba(167, 139, 250, 0.2));
}

/* —— STATS —— */
.stats-wrap {
  position: relative;
  z-index: 2;
  margin-top: -8px;
  margin-bottom: 24px;
  max-width: 1180px;
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 18px 10px;
  border-radius: 18px;
  background: rgba(10, 12, 22, 0.72);
  border: 1px solid rgba(167, 139, 250, 0.16);
  backdrop-filter: blur(16px);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.35),
    0 0 40px rgba(167, 139, 250, 0.06);
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 12px;
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 18%;
  bottom: 18%;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(167, 139, 250, 0.25), transparent);
}

.stat-icon {
  font-size: 1.1rem;
  opacity: 0.9;
}

.stat-value {
  display: block;
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.02em;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

/* —— PRODUCTS —— */
.products-section .section-header {
  margin-bottom: 36px;
}

.products-section h2 {
  font-size: clamp(1.6rem, 3vw, 2.1rem);
}

.product-neon-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.neon-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 22px;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  background: rgba(12, 14, 24, 0.72);
  border: 1px solid color-mix(in srgb, var(--neon, #a78bfa) 22%, transparent);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
  min-height: 196px;
}

.neon-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    120% 80% at 0% 0%,
    color-mix(in srgb, var(--neon, #a78bfa) 16%, transparent),
    transparent 55%
  );
  opacity: 0.85;
  pointer-events: none;
}

.neon-card:hover {
  transform: translateY(-5px);
  border-color: color-mix(in srgb, var(--neon, #a78bfa) 55%, transparent);
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.4),
    0 0 32px color-mix(in srgb, var(--neon, #a78bfa) 22%, transparent);
}

.neon-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: var(--neon, #a78bfa);
  background: radial-gradient(
    circle at 30% 25%,
    color-mix(in srgb, var(--neon, #a78bfa) 28%, transparent),
    color-mix(in srgb, var(--neon, #a78bfa) 8%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--neon, #a78bfa) 40%, transparent);
  box-shadow: 0 0 22px color-mix(in srgb, var(--neon, #a78bfa) 22%, transparent);
  position: relative;
  z-index: 1;
}

.neon-card h3 {
  margin: 4px 0 0;
  font-size: 1.05rem;
  font-weight: 720;
  color: var(--text-heading);
  position: relative;
  z-index: 1;
}

.neon-card p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.55;
  flex: 1;
  position: relative;
  z-index: 1;
}

.neon-link {
  font-size: 0.85rem;
  font-weight: 650;
  color: color-mix(in srgb, var(--neon, #a78bfa) 85%, #fff);
  position: relative;
  z-index: 1;
}

/* —— SHOWCASE —— */
.showcase-section .container {
  max-width: 1180px;
}

/* —— WHY + ECO —— */
.why-eco-section .container {
  max-width: 1180px;
}

.why-eco-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px 48px;
  align-items: start;
}

.section-header.left {
  text-align: left;
  margin: 0 0 24px;
  max-width: none;
}

.section-header.left h2 {
  margin-bottom: 0;
}

.why-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.why-card {
  padding: 18px 16px;
  border-radius: 14px;
  background: rgba(12, 14, 24, 0.65);
  border: 1px solid rgba(167, 139, 250, 0.14);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.why-card:hover {
  transform: translateY(-3px);
  border-color: rgba(167, 139, 250, 0.35);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
}

.why-icon {
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(167, 139, 250, 0.16);
  font-size: 0.9rem;
}

.why-card h3 {
  margin: 0 0 6px;
  font-size: 0.95rem;
  color: var(--text-heading);
}

.why-card p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.55;
}

.galaxy-panel {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  min-height: 160px;
  border: 1px solid rgba(167, 139, 250, 0.14);
  background: radial-gradient(ellipse at 50% 45%, rgba(88, 28, 135, 0.35), rgba(5, 6, 12, 0.9));
}

.galaxy-spiral {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(ellipse 18% 10% at 50% 50%, rgba(255, 255, 255, 0.55), transparent 55%),
    conic-gradient(
      from 40deg,
      transparent 0deg,
      rgba(96, 165, 250, 0.12) 30deg,
      transparent 70deg,
      rgba(167, 139, 250, 0.18) 120deg,
      transparent 180deg,
      rgba(251, 146, 60, 0.1) 230deg,
      transparent 300deg,
      rgba(244, 114, 182, 0.12) 330deg,
      transparent 360deg
    );
  filter: blur(0.5px);
  animation: galaxySpin 48s linear infinite;
  opacity: 0.85;
}

.galaxy-pills {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 12px;
  z-index: 1;
}

.galaxy-pills span {
  font-size: 0.7rem;
  font-weight: 600;
  color: #cbd5e1;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(8, 10, 18, 0.7);
  border: 1px solid rgba(167, 139, 250, 0.2);
  backdrop-filter: blur(8px);
}

/* —— CTA —— */
.cta-panel {
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 28px;
  border-radius: 24px;
  background:
    radial-gradient(ellipse 80% 80% at 50% 0%, rgba(167, 139, 250, 0.18), transparent 55%),
    rgba(12, 14, 24, 0.65);
  border: 1px solid rgba(167, 139, 250, 0.18);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.cta-panel h2 {
  margin: 0 0 12px;
  font-size: clamp(1.45rem, 3vw, 1.9rem);
  color: var(--text-heading);
  letter-spacing: -0.02em;
}

.cta-panel p {
  margin: 0 0 24px;
  color: var(--text-muted);
  font-size: 0.98rem;
}

.cta-panel .hero-actions {
  justify-content: center;
  margin-bottom: 0;
}

.err {
  color: var(--danger);
}

@keyframes starsDrift {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-24px);
  }
}

@keyframes galaxySpin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 960px) {
  .hero-v2-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-copy {
    max-width: none;
  }

  .hero-v2-lead {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions,
  .hero-badges,
  .hero-trust {
    justify-content: center;
  }

  .hero-visual {
    order: -1;
    min-height: 260px;
  }

  .stats-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-item:nth-child(2)::after {
    display: none;
  }

  .product-neon-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .why-eco-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .product-neon-grid {
    grid-template-columns: 1fr;
  }

  .stats-bar {
    grid-template-columns: 1fr;
  }

  .stat-item::after {
    display: none !important;
  }

  .why-grid {
    grid-template-columns: 1fr;
  }

  .hero-v2 {
    min-height: auto;
    padding-top: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-stars,
  .galaxy-spiral {
    animation: none;
  }

  .neon-card:hover,
  .why-card:hover {
    transform: none;
  }
}
</style>
