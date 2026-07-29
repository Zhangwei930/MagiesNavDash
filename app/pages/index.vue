<template>
  <div ref="root" class="home-v2">
    <!-- HERO -->
    <section class="hero-v2" data-testid="home-hero" aria-labelledby="hero-title">
      <div class="hero-horizon" aria-hidden="true" />
      <div class="hero-stars" aria-hidden="true" />
      <div class="container hero-v2-grid">
        <div class="hero-copy">
          <div class="hero-badges" data-hero-in>
            <span>AI Native</span>
            <span>Data Driven</span>
            <span>{{ t('home.badgeFuture') }}</span>
          </div>
          <h1 id="hero-title" class="hero-v2-title" data-hero-in>
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
            <div class="trust-galaxy" aria-hidden="true">
              <span class="tg-halo" />
              <span class="tg-disk" />
              <span class="tg-arms" />
              <span class="tg-core" />
              <span class="tg-star s1" />
              <span class="tg-star s2" />
              <span class="tg-star s3" />
              <span class="tg-star s4" />
              <span class="tg-star s5" />
            </div>
            <p>{{ t('home.trust') }}</p>
          </div>
        </div>
        <div class="hero-visual" data-hero-visual>
          <HeroSigil />
        </div>
      </div>
    </section>

    <!-- STATS (honest product metrics, not marketing vanity numbers) -->
    <section class="stats-wrap container" data-testid="home-metrics" aria-label="Magies product metrics">
      <ul class="stats-bar" data-reveal>
        <li v-for="s in stats" :key="s.key" class="stat-item">
          <span class="stat-icon" :style="{ color: s.color }">{{ s.icon }}</span>
          <div>
            <strong class="stat-value">{{ s.value }}</strong>
            <span class="stat-label">{{ t(s.labelKey) }}</span>
          </div>
        </li>
      </ul>
    </section>

    <!-- PRODUCTS -->
    <section class="section products-section" data-testid="home-products" aria-labelledby="products-title">
      <div class="container">
        <div class="section-header" data-reveal>
          <h2 id="products-title">{{ t('home.productsTitle') }}</h2>
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
    <section class="section section-alt showcase-section" data-testid="home-showcase" aria-labelledby="showcase-title">
      <div class="container">
        <div class="section-header" data-reveal>
          <h2 id="showcase-title">{{ t('home.showcaseTitle') }}</h2>
          <p>{{ t('home.showcaseDesc') }}</p>
        </div>
        <HomeShowcase />
      </div>
    </section>

    <!-- WHY + ECOSYSTEM -->
    <section class="section why-eco-section" data-testid="home-why" aria-labelledby="why-title">
      <div class="container why-eco-grid">
        <div class="why-block">
          <div class="section-header left" data-reveal>
            <h2 id="why-title">{{ t('home.whyTitle') }}</h2>
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
    <section class="section cta-section" data-testid="home-cta" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-panel" data-reveal>
          <h2 id="cta-title">{{ t('home.ctaTitle') }}</h2>
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
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse 52% 20% at 8% 29%, rgba(37, 99, 235, 0.11), transparent 70%),
    radial-gradient(ellipse 48% 19% at 92% 47%, rgba(126, 34, 206, 0.12), transparent 72%),
    radial-gradient(ellipse 48% 18% at 14% 73%, rgba(30, 64, 175, 0.1), transparent 72%),
    radial-gradient(ellipse 44% 16% at 88% 88%, rgba(190, 24, 93, 0.08), transparent 72%);
}

/* —— HERO —— */
.hero-v2 {
  position: relative;
  padding: 40px 0 46px;
  min-height: min(84vh, 780px);
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
  grid-template-columns: 0.94fr 1.06fr;
  gap: 32px 24px;
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
  letter-spacing: 0.05em;
  padding: 6px 13px;
  border-radius: 999px;
  color: #e9d5ff;
  background: linear-gradient(
    105deg,
    rgba(96, 165, 250, 0.16),
    rgba(167, 139, 250, 0.18),
    rgba(251, 146, 60, 0.12)
  );
  border: 1px solid rgba(196, 181, 253, 0.28);
  box-shadow: 0 0 20px rgba(167, 139, 250, 0.08);
  backdrop-filter: blur(8px);
}

.hero-v2-title {
  margin: 0 0 18px;
  font-size: clamp(2.55rem, 5.8vw, 3.9rem);
  font-weight: 820;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: #f8fafc;
  text-shadow: 0 0 60px rgba(167, 139, 250, 0.15);
}

.hero-v2-title .line {
  display: block;
}

.hero-v2-title .accent {
  background: linear-gradient(105deg, #c4b5fd 0%, #e879f9 32%, #fb923c 68%, #fbbf24 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 28px rgba(232, 121, 249, 0.35));
}

.hero-v2-lead {
  margin: 0 0 28px;
  font-size: clamp(1rem, 1.9vw, 1.14rem);
  color: #a8b4cc;
  line-height: 1.8;
  max-width: 46ch;
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
  gap: 14px;
}

/* Mini Milky Way mark next to trust copy */
.trust-galaxy {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 50% 50%, rgba(20, 18, 42, 0.2), rgba(5, 6, 12, 0.92) 72%);
  box-shadow:
    0 0 0 1px rgba(196, 181, 253, 0.22),
    0 0 22px rgba(139, 92, 246, 0.28),
    inset 0 0 16px rgba(96, 165, 250, 0.08);
}

.tg-halo {
  position: absolute;
  inset: -4%;
  border-radius: 50%;
  background:
    radial-gradient(ellipse 70% 42% at 50% 50%, rgba(167, 139, 250, 0.22), transparent 70%);
  transform: rotate(-28deg);
  pointer-events: none;
}

.tg-disk {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background:
    radial-gradient(ellipse 88% 34% at 50% 50%, rgba(196, 181, 253, 0.35), transparent 72%),
    radial-gradient(ellipse 72% 28% at 50% 50%, rgba(96, 165, 250, 0.22), transparent 70%);
  transform: rotate(-32deg);
  filter: blur(0.3px);
}

.tg-arms {
  position: absolute;
  inset: -12%;
  border-radius: 50%;
  background: conic-gradient(
    from 20deg,
    transparent 0deg,
    rgba(96, 165, 250, 0.32) 22deg,
    transparent 55deg,
    rgba(167, 139, 250, 0.38) 95deg,
    transparent 135deg,
    rgba(251, 146, 60, 0.16) 175deg,
    transparent 215deg,
    rgba(244, 114, 182, 0.22) 255deg,
    transparent 295deg,
    rgba(125, 211, 252, 0.28) 330deg,
    transparent 360deg
  );
  mask-image: radial-gradient(circle at 50% 50%, transparent 14%, #000 28%, #000 62%, transparent 78%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, transparent 14%, #000 28%, #000 62%, transparent 78%);
  animation: trustGalaxySpin 28s linear infinite;
  opacity: 0.95;
}

.tg-core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 9px;
  margin: -4.5px 0 0 -4.5px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 38% 34%, #fff 0%, #e9d5ff 28%, #a78bfa 55%, transparent 78%);
  box-shadow:
    0 0 10px 3px rgba(196, 181, 253, 0.7),
    0 0 18px 6px rgba(139, 92, 246, 0.35);
  z-index: 2;
}

.tg-star {
  position: absolute;
  width: 1.5px;
  height: 1.5px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 3px 0.5px rgba(255, 255, 255, 0.85);
  z-index: 1;
  opacity: 0.85;
}

.tg-star.s1 { left: 18%; top: 28%; width: 1px; height: 1px; opacity: 0.7; }
.tg-star.s2 { left: 72%; top: 22%; width: 2px; height: 2px; }
.tg-star.s3 { left: 78%; top: 62%; width: 1px; height: 1px; opacity: 0.6; }
.tg-star.s4 { left: 24%; top: 70%; width: 1.5px; height: 1.5px; }
.tg-star.s5 { left: 58%; top: 76%; width: 1px; height: 1px; opacity: 0.55; }

.hero-trust p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--text-muted);
  letter-spacing: 0.01em;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 440px;
}

/* —— STATS —— */
.stats-wrap {
  position: relative;
  z-index: 2;
  margin-top: -30px;
  margin-bottom: 24px;
  max-width: 1180px;
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 20px 12px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(16, 18, 32, 0.88), rgba(8, 10, 18, 0.72));
  border: 1px solid rgba(196, 181, 253, 0.2);
  backdrop-filter: blur(20px) saturate(1.25);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.4),
    0 0 50px rgba(167, 139, 250, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  list-style: none;
  margin-bottom: 0;
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
  font-size: 1.45rem;
  font-weight: 820;
  letter-spacing: -0.03em;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(180deg, #fff 20%, #c4b5fd 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

/* —— PRODUCTS —— */
.products-section .section-header {
  margin-bottom: 30px;
}

.products-section h2,
.showcase-section h2,
.why-eco-section h2 {
  font-size: clamp(1.65rem, 3.1vw, 2.2rem);
  letter-spacing: -0.03em;
}

.products-section :deep(.section-header p),
.showcase-section :deep(.section-header p) {
  color: #9aa8c2;
}

.product-neon-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}

.neon-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 22px 14px 20px;
  border-radius: 16px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(160deg, rgba(18, 20, 36, 0.92), rgba(8, 10, 18, 0.78));
  border: 1px solid color-mix(in srgb, var(--neon, #a78bfa) 26%, transparent);
  box-shadow:
    0 14px 40px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.22s, box-shadow 0.22s;
  min-height: 218px;
  backdrop-filter: blur(12px);
}

.neon-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      120% 90% at 0% 0%,
      color-mix(in srgb, var(--neon, #a78bfa) 22%, transparent),
      transparent 55%
    ),
    radial-gradient(
      80% 60% at 100% 100%,
      color-mix(in srgb, var(--neon, #a78bfa) 8%, transparent),
      transparent 50%
    );
  opacity: 0.9;
  pointer-events: none;
}

.neon-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--neon, #a78bfa) 45%, transparent),
    transparent 40%,
    transparent 70%,
    color-mix(in srgb, var(--neon, #a78bfa) 25%, transparent)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.55;
  pointer-events: none;
  transition: opacity 0.22s;
}

.neon-card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--neon, #a78bfa) 58%, transparent);
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.45),
    0 0 40px color-mix(in srgb, var(--neon, #a78bfa) 28%, transparent);
}

.neon-card:hover::after {
  opacity: 1;
}

.neon-icon {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  color: var(--neon, #a78bfa);
  background: radial-gradient(
    circle at 30% 25%,
    color-mix(in srgb, var(--neon, #a78bfa) 34%, transparent),
    color-mix(in srgb, var(--neon, #a78bfa) 8%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--neon, #a78bfa) 48%, transparent);
  box-shadow:
    0 0 26px color-mix(in srgb, var(--neon, #a78bfa) 28%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 1;
}

.neon-card h3 {
  margin: 4px 0 0;
  font-size: 0.98rem;
  font-weight: 720;
  color: var(--text-heading);
  position: relative;
  z-index: 1;
}

.neon-card p {
  margin: 0;
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.55;
  flex: 1;
  position: relative;
  z-index: 1;
}

.neon-link {
  font-size: 0.78rem;
  font-weight: 650;
  color: color-mix(in srgb, var(--neon, #a78bfa) 85%, #fff);
  position: relative;
  z-index: 1;
}

/* —— SHOWCASE —— */
.showcase-section .container {
  max-width: 1180px;
}

.products-section {
  padding-top: 50px;
}

.showcase-section,
.why-eco-section {
  padding-top: 62px;
  padding-bottom: 62px;
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
  padding: 20px 18px;
  border-radius: 16px;
  background: linear-gradient(160deg, rgba(16, 18, 32, 0.88), rgba(8, 10, 18, 0.7));
  border: 1px solid rgba(167, 139, 250, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.why-card:hover {
  transform: translateY(-4px);
  border-color: rgba(196, 181, 253, 0.4);
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.32),
    0 0 24px rgba(167, 139, 250, 0.12);
}

.why-icon {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  margin-bottom: 12px;
  background: radial-gradient(circle at 30% 25%, rgba(167, 139, 250, 0.22), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(167, 139, 250, 0.22);
  font-size: 0.95rem;
  box-shadow: 0 0 16px rgba(167, 139, 250, 0.12);
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
  border-radius: 18px;
  overflow: hidden;
  min-height: 168px;
  border: 1px solid rgba(196, 181, 253, 0.18);
  background:
    radial-gradient(ellipse at 50% 42%, rgba(109, 40, 217, 0.38), transparent 55%),
    radial-gradient(ellipse at 70% 70%, rgba(37, 99, 235, 0.18), transparent 50%),
    linear-gradient(180deg, rgba(10, 12, 24, 0.4), rgba(5, 6, 12, 0.95));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 16px 40px rgba(0, 0, 0, 0.3);
}

.galaxy-spiral {
  position: absolute;
  inset: -18%;
  background:
    radial-gradient(ellipse 16% 9% at 50% 50%, rgba(255, 255, 255, 0.65), transparent 55%),
    conic-gradient(
      from 40deg,
      transparent 0deg,
      rgba(96, 165, 250, 0.16) 30deg,
      transparent 70deg,
      rgba(167, 139, 250, 0.22) 120deg,
      transparent 180deg,
      rgba(251, 146, 60, 0.12) 230deg,
      transparent 300deg,
      rgba(244, 114, 182, 0.14) 330deg,
      transparent 360deg
    );
  filter: blur(0.4px);
  animation: galaxySpin 56s linear infinite;
  opacity: 0.9;
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
  font-weight: 650;
  letter-spacing: 0.03em;
  color: #e2e8f0;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(8, 10, 18, 0.78);
  border: 1px solid rgba(196, 181, 253, 0.28);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

/* —— CTA —— */
.cta-panel {
  text-align: center;
  max-width: none;
  margin: 0 auto;
  padding: 44px 32px;
  border-radius: 26px;
  background:
    radial-gradient(ellipse 90% 80% at 50% 0%, rgba(167, 139, 250, 0.28), transparent 55%),
    radial-gradient(ellipse 50% 40% at 80% 100%, rgba(251, 146, 60, 0.1), transparent 50%),
    linear-gradient(180deg, rgba(16, 18, 34, 0.9), rgba(8, 10, 18, 0.75));
  border: 1px solid rgba(196, 181, 253, 0.24);
  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.42),
    0 0 50px rgba(167, 139, 250, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.cta-panel h2 {
  margin: 0 0 12px;
  font-size: clamp(1.5rem, 3.1vw, 2rem);
  letter-spacing: -0.03em;
  background: linear-gradient(105deg, #f8fafc 10%, #c4b5fd 55%, #fdba74 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
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

@keyframes trustGalaxySpin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .product-neon-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .neon-card {
    min-height: 196px;
    padding-inline: 20px;
  }
}

@media (max-width: 960px) {
  .hero-v2 {
    min-height: auto;
    padding-top: 44px;
  }

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
    min-height: 360px;
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 12px 6px;
  }

  .stat-item {
    justify-content: flex-start;
    gap: 8px;
    padding: 10px 8px;
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
    padding-bottom: 38px;
  }

  .hero-visual {
    min-height: 270px;
  }

  .cta-panel {
    padding: 38px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-stars,
  .galaxy-spiral,
  .tg-arms {
    animation: none;
  }

  .neon-card:hover,
  .why-card:hover {
    transform: none;
  }
}
</style>
