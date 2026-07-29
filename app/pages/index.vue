<template>
  <div ref="root" class="reference-home" :lang="locale === 'zh' ? 'zh-CN' : 'en'">
    <section class="hero-v2" data-testid="home-hero" aria-labelledby="hero-title">
      <div class="hero-nebula" aria-hidden="true" />
      <div class="hero-planet planet-left" aria-hidden="true" />
      <div class="hero-planet planet-right" aria-hidden="true" />
      <div class="hero-horizon" aria-hidden="true" />

      <div class="reference-container hero-reference-grid">
        <div class="hero-copy">
          <div class="hero-badges" data-hero-in>
            <span>{{ t('home.badgeAi') }}</span>
            <i aria-hidden="true" />
            <span>{{ t('home.badgeData') }}</span>
            <i aria-hidden="true" />
            <span>{{ t('home.badgeFuture') }}</span>
          </div>

          <h1 id="hero-title" class="hero-v2-title" data-hero-in>
            <span>{{ t('home.heroTitle') }}</span>
            <span class="hero-title-accent">{{ t('home.titleAccent') }}</span>
          </h1>

          <p class="hero-v2-lead" data-hero-in>{{ t('home.lead') }}</p>

          <div class="hero-actions" data-hero-in>
            <NuxtLink class="reference-button primary" to="/products">
              {{ t('home.explore') }}
              <ArrowRight :size="14" :stroke-width="1.8" />
            </NuxtLink>
            <NuxtLink class="reference-button secondary" to="/about">
              {{ t('home.watch') }}
              <CirclePlay :size="14" :stroke-width="1.8" />
            </NuxtLink>
          </div>

          <div class="hero-trust" data-hero-in>
            <div class="trust-avatars" aria-hidden="true">
              <span v-for="avatar in trustAvatars" :key="avatar" :style="{ '--avatar': avatar }" />
            </div>
            <p>{{ t('home.trust') }}</p>
          </div>
        </div>

        <div class="hero-art-wrap" data-hero-visual>
          <div class="hero-art-glow" aria-hidden="true" />
          <img class="hero-logo-art" src="/brand/magies-logo-hero.png" alt="Magies">
        </div>
      </div>
    </section>

    <section
      class="stats-wrap container"
      data-testid="home-metrics"
      :aria-label="t('home.metricsLabel')"
    >
      <ul class="stats-bar" data-reveal>
        <li v-for="stat in stats" :key="stat.label" class="stat-item">
          <span class="stat-icon" :style="{ '--stat-color': stat.color }">
            <component :is="stat.icon" :size="20" :stroke-width="1.7" />
          </span>
          <div>
            <strong class="stat-value">{{ stat.value }}</strong>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </li>
      </ul>
    </section>

    <section class="section products-section" data-testid="home-products" aria-labelledby="products-title">
      <div class="reference-container">
        <div class="reference-section-heading" data-reveal>
          <h2 id="products-title">{{ t('home.productsTitle') }}</h2>
          <p>{{ t('home.productsDesc') }}</p>
        </div>

        <div class="reference-products-grid">
          <NuxtLink
            v-for="product in products"
            :key="product.name"
            class="reference-product-card"
            :to="product.to"
            :style="{ '--product-color': product.color }"
          >
            <span class="product-card-glow" aria-hidden="true" />
            <span class="reference-product-icon">
              <component :is="product.icon" :size="25" :stroke-width="1.7" />
            </span>
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <span class="product-learn">{{ t('action.learn') }} <ArrowRight :size="10" /></span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section section-alt showcase-section" data-testid="home-showcase" aria-labelledby="showcase-title">
      <div class="reference-container showcase-shell">
        <div class="reference-section-heading" data-reveal>
          <h2 id="showcase-title">{{ t('home.showcaseTitle') }}</h2>
          <p>{{ t('home.showcaseDesc') }}</p>
        </div>
        <HomeShowcase />
      </div>
    </section>

    <section class="section why-eco-section" data-testid="home-why" aria-labelledby="why-title">
      <div class="reference-container why-eco-grid">
        <div class="why-block">
          <div class="why-copy">
            <div class="reference-section-heading align-left" data-reveal>
              <h2 id="why-title">{{ t('home.whyTitle') }}</h2>
            </div>
            <div class="why-grid" data-reveal-stagger>
              <article v-for="item in whyItems" :key="item.title" class="why-card">
                <span class="why-icon" :style="{ '--why-color': item.color }">
                  <component :is="item.icon" :size="17" :stroke-width="1.7" />
                </span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </article>
            </div>
          </div>

          <div class="galaxy-panel" data-reveal aria-hidden="true">
            <span class="galaxy-disk" />
            <div class="galaxy-pills">
              <span><Infinity :size="13" /> {{ t('home.pillPossibilities') }}</span>
              <span><MonitorUp :size="13" /> {{ t('home.pillUniverse') }}</span>
              <span><Sparkles :size="13" /> {{ t('home.pillConnected') }}</span>
            </div>
          </div>
        </div>

        <div class="eco-block">
          <div class="reference-section-heading" data-reveal>
            <h2>{{ t('home.ecoTitle') }}</h2>
          </div>
          <HomeEcosystem />
        </div>
      </div>
    </section>

    <section class="section cta-section" data-testid="home-cta" aria-labelledby="cta-title">
      <div class="reference-container">
        <div class="cta-panel" data-reveal>
          <h2 id="cta-title">{{ t('home.ctaTitle') }}</h2>
          <p>{{ t('home.ctaLead') }}</p>
          <div class="cta-actions">
            <NuxtLink class="reference-button primary compact" to="/products">
              {{ t('home.ctaProducts') }}
            </NuxtLink>
            <NuxtLink class="reference-button secondary compact" to="/roadmap">
              {{ t('home.ctaUpdates') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  CirclePlay,
  Cloud,
  Database,
  FileText,
  Globe2,
  Infinity,
  MonitorCog,
  MonitorUp,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Zap,
  type LucideIcon
} from 'lucide-vue-next'

const root = ref<HTMLElement | null>(null)
useReveal(root)
const { t, locale } = useI18n()

const trustAvatars = ['#f6c69f', '#d6a077', '#efc0ad', '#d8ae92', '#e8b995']

const stats = computed<{ value: string; label: string; color: string; icon: LucideIcon }[]>(
  () => [
    { value: '50K+', label: t('home.stat.activeUsers'), color: '#60a5fa', icon: Users },
    { value: '1M+', label: t('home.stat.tasksAutomated'), color: '#a78bfa', icon: Zap },
    { value: '99.99%', label: t('home.stat.uptime'), color: '#818cf8', icon: ShieldCheck },
    { value: '120+', label: t('home.stat.countries'), color: '#d946ef', icon: Globe2 }
  ]
)

const products = computed<{
  name: string
  description: string
  color: string
  icon: LucideIcon
  to: string
}[]>(() => [
  {
    name: 'Magies Terminal',
    description: t('home.product.terminalDesc'),
    color: '#22d3ee',
    icon: Terminal,
    to: '/products/magies-terminal'
  },
  {
    name: 'Magies PDF',
    description: t('home.product.pdfDesc'),
    color: '#f472b6',
    icon: FileText,
    to: '/products/magies-pdf'
  },
  {
    name: 'Magies Data Studio',
    description: t('home.product.studioDesc'),
    color: '#c084fc',
    icon: Database,
    to: '/products/magies-data-studio'
  },
  {
    name: 'Magies AI',
    description: t('home.product.aiDesc'),
    color: '#818cf8',
    icon: BrainCircuit,
    to: '/roadmap'
  },
  {
    name: 'Magies Cloud',
    description: t('home.product.cloudDesc'),
    color: '#22d3ee',
    icon: Cloud,
    to: '/roadmap'
  },
  {
    name: 'Magies SDK',
    description: t('home.product.sdkDesc'),
    color: '#fb923c',
    icon: Boxes,
    to: '/roadmap'
  }
])

const whyItems = computed<{
  title: string
  description: string
  color: string
  icon: LucideIcon
}[]>(() => [
  {
    title: t('home.why.ai'),
    description: t('home.why.aiDesc'),
    color: '#e879f9',
    icon: Sparkles
  },
  {
    title: t('home.why.simple'),
    description: t('home.why.simpleDesc'),
    color: '#818cf8',
    icon: MonitorCog
  },
  {
    title: t('home.why.secure'),
    description: t('home.why.secureDesc'),
    color: '#f472b6',
    icon: ShieldCheck
  },
  {
    title: t('home.why.open'),
    description: t('home.why.openDesc'),
    color: '#818cf8',
    icon: PlugZap
  }
])
</script>

<style scoped>
.reference-home {
  position: relative;
  overflow: hidden;
  color: #e8edf8;
  background:
    radial-gradient(ellipse 42% 16% at 7% 31%, rgba(30, 64, 175, 0.12), transparent 70%),
    radial-gradient(ellipse 45% 17% at 94% 53%, rgba(88, 28, 135, 0.14), transparent 72%),
    radial-gradient(ellipse 42% 14% at 16% 76%, rgba(30, 64, 175, 0.12), transparent 72%),
    radial-gradient(ellipse 40% 14% at 95% 89%, rgba(190, 24, 93, 0.1), transparent 72%),
    #02040d;
}

.reference-home::before,
.reference-home::after {
  content: "";
  position: absolute;
  z-index: 0;
  width: 180px;
  aspect-ratio: 1;
  border-radius: 50%;
  pointer-events: none;
  background:
    radial-gradient(circle at 35% 30%, rgba(120, 145, 255, 0.38), rgba(32, 33, 78, 0.9) 45%, #060714 70%);
  box-shadow: inset -22px -18px 30px rgba(0, 0, 0, 0.76), 0 0 60px rgba(79, 70, 229, 0.12);
  opacity: 0.68;
}

.reference-home::before {
  left: -126px;
  top: 390px;
}

.reference-home::after {
  right: -132px;
  top: 1040px;
}

.reference-container {
  position: relative;
  z-index: 2;
  width: min(100% - 48px, 820px);
  margin: 0 auto;
}

.hero-v2 {
  position: relative;
  z-index: 1;
  height: 390px;
  overflow: hidden;
}

.hero-nebula {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 40% 72% at 78% 40%, rgba(91, 33, 182, 0.19), transparent 68%),
    radial-gradient(ellipse 35% 65% at 18% 55%, rgba(30, 64, 175, 0.13), transparent 70%);
  pointer-events: none;
}

.hero-planet {
  position: absolute;
  z-index: 0;
  width: 88px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #24264b 0%, #0e1024 48%, #03040a 74%);
  box-shadow:
    inset -20px -15px 30px #000,
    0 0 30px rgba(99, 102, 241, 0.18);
  opacity: 0.85;
}

.planet-left {
  left: -54px;
  bottom: 12px;
}

.planet-right {
  right: -52px;
  bottom: 18px;
}

.hero-horizon {
  position: absolute;
  z-index: 0;
  left: -12%;
  right: -12%;
  bottom: -142px;
  height: 190px;
  border-radius: 50% 50% 0 0;
  border-top: 1px solid rgba(147, 197, 253, 0.7);
  background:
    radial-gradient(ellipse 22% 16% at 68% 0%, rgba(255, 255, 255, 0.95), rgba(244, 114, 182, 0.52) 16%, transparent 46%),
    radial-gradient(ellipse 62% 55% at 50% 0%, rgba(96, 165, 250, 0.28), transparent 58%),
    linear-gradient(180deg, rgba(31, 41, 85, 0.9), rgba(6, 8, 22, 0.98));
  box-shadow:
    0 -4px 26px rgba(96, 165, 250, 0.35),
    0 -10px 50px rgba(167, 139, 250, 0.16);
}

.hero-reference-grid {
  height: 100%;
  display: grid;
  grid-template-columns: 0.88fr 1.12fr;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
}

.hero-copy {
  position: relative;
  z-index: 2;
}

.hero-badges {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 12px;
  color: #a9b5d3;
  font-size: 0.61rem;
  line-height: 1;
}

.hero-badges span:first-child {
  color: #b9a5ff;
}

.hero-badges span:last-child {
  color: #ffd6b4;
}

.hero-badges i {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #7765ff;
  box-shadow: 0 0 6px #7765ff;
}

.hero-v2-title {
  margin: 0 0 13px;
  font-size: clamp(2.25rem, 4.3vw, 2.75rem);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.045em;
  color: #f3f5fb;
  text-shadow: 0 8px 40px rgba(167, 139, 250, 0.12);
}

.hero-v2-title span {
  display: block;
}

.hero-title-accent {
  margin-top: 6px;
  width: max-content;
  background: linear-gradient(95deg, #b638f3 0%, #e23a8b 48%, #ff8a35 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 16px rgba(217, 70, 239, 0.25));
}

.hero-v2-lead {
  max-width: 34ch;
  margin: 0 0 18px;
  color: #a4aec4;
  font-size: 0.73rem;
  line-height: 1.65;
}

.hero-actions,
.cta-actions {
  display: flex;
  align-items: center;
  gap: 11px;
}

.hero-actions {
  margin-bottom: 22px;
}

.reference-button {
  min-height: 36px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-size: 0.66rem;
  font-weight: 650;
  color: #fff;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.reference-button:hover {
  transform: translateY(-2px);
}

.reference-button.primary {
  background: linear-gradient(100deg, #536dff 0%, #8247f4 38%, #f0449f 68%, #ff9b45 100%);
  box-shadow:
    0 7px 22px rgba(100, 79, 255, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.reference-button.secondary {
  border-color: rgba(151, 162, 194, 0.27);
  background: rgba(5, 8, 18, 0.45);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.reference-button.secondary:hover {
  border-color: rgba(167, 139, 250, 0.55);
}

.hero-trust {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trust-avatars {
  display: flex;
  padding-left: 5px;
}

.trust-avatars span {
  width: 23px;
  height: 23px;
  margin-left: -5px;
  border: 1px solid #dbe5ff;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 33%, var(--avatar) 0 23%, transparent 25%),
    radial-gradient(ellipse at 50% 95%, var(--avatar) 0 42%, transparent 44%),
    linear-gradient(145deg, #303754, #121729);
  box-shadow: 0 0 0 1px #02040d;
}

.hero-trust p {
  margin: 0;
  color: #aab2c5;
  font-size: 0.58rem;
  line-height: 1.45;
}

.hero-art-wrap {
  position: relative;
  z-index: 1;
  min-width: 0;
  height: 360px;
  display: grid;
  place-items: center;
}

.hero-art-glow {
  position: absolute;
  inset: 16%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 34% 44%, rgba(14, 165, 233, 0.26), transparent 45%),
    radial-gradient(circle at 68% 52%, rgba(236, 72, 153, 0.25), transparent 48%);
  filter: blur(24px);
}

.hero-logo-art {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 450px;
  max-width: none;
  height: 450px;
  object-fit: contain;
  mix-blend-mode: screen;
  transform: translate(-50%, -50%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 0 45%, rgba(0, 0, 0, 0.96) 48%, transparent 52%);
  mask-image: radial-gradient(circle at 50% 50%, #000 0 45%, rgba(0, 0, 0, 0.96) 48%, transparent 52%);
  filter:
    saturate(1.08)
    contrast(1.08)
    drop-shadow(0 0 18px rgba(99, 102, 241, 0.24))
    drop-shadow(0 0 26px rgba(217, 70, 239, 0.14));
}

.stats-wrap {
  position: relative;
  z-index: 4;
  width: min(100% - 48px, 820px);
  max-width: none;
  padding: 0;
  margin: -15px auto 0;
}

.stats-bar {
  min-height: 68px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  list-style: none;
  border: 1px solid rgba(110, 122, 177, 0.24);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(10, 15, 36, 0.94), rgba(6, 9, 24, 0.9));
  box-shadow:
    0 16px 42px rgba(0, 0, 0, 0.42),
    0 0 36px rgba(76, 29, 149, 0.11),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(18px);
}

.stat-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 0;
}

.stat-item:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 22%;
  right: 0;
  bottom: 22%;
  width: 1px;
  background: linear-gradient(transparent, rgba(123, 139, 196, 0.25), transparent);
}

.stat-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--stat-color);
  border: 1px solid color-mix(in srgb, var(--stat-color) 45%, transparent);
  background: color-mix(in srgb, var(--stat-color) 8%, transparent);
  box-shadow: 0 0 15px color-mix(in srgb, var(--stat-color) 18%, transparent);
}

.stat-value {
  display: block;
  color: #f6f7fb;
  font-size: 1.18rem;
  line-height: 1.1;
  font-weight: 760;
}

.stat-label {
  display: block;
  margin-top: 3px;
  color: #8490aa;
  font-size: 0.55rem;
  line-height: 1;
}

.section {
  position: relative;
  z-index: 1;
}

.products-section {
  padding: 21px 0 16px;
}

.reference-section-heading {
  margin: 0 auto 11px;
  text-align: center;
}

.reference-section-heading h2 {
  margin: 0;
  color: #f3f5fb;
  font-size: 1.15rem;
  line-height: 1.2;
  font-weight: 730;
  letter-spacing: -0.025em;
}

.reference-section-heading p {
  margin: 4px 0 0;
  color: #8e98ae;
  font-size: 0.55rem;
  line-height: 1.4;
}

.reference-section-heading.align-left {
  text-align: left;
  margin-bottom: 13px;
}

.reference-products-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 7px;
}

.reference-product-card {
  position: relative;
  min-height: 149px;
  padding: 18px 10px 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--product-color) 32%, rgba(96, 109, 158, 0.25));
  background: linear-gradient(150deg, rgba(12, 18, 41, 0.92), rgba(6, 9, 23, 0.94));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 12px 28px rgba(0, 0, 0, 0.28);
  text-align: center;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.reference-product-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--product-color) 72%, transparent);
  box-shadow: 0 12px 34px color-mix(in srgb, var(--product-color) 15%, rgba(0, 0, 0, 0.4));
}

.product-card-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--product-color) 14%, transparent), transparent 52%),
    radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--product-color) 7%, transparent), transparent 45%);
  pointer-events: none;
}

.reference-product-icon {
  position: relative;
  z-index: 1;
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--product-color);
  border: 1px solid color-mix(in srgb, var(--product-color) 80%, transparent);
  background: color-mix(in srgb, var(--product-color) 8%, rgba(3, 6, 18, 0.6));
  box-shadow:
    0 0 14px color-mix(in srgb, var(--product-color) 36%, transparent),
    inset 0 0 12px color-mix(in srgb, var(--product-color) 8%, transparent);
}

.reference-product-card h3 {
  position: relative;
  z-index: 1;
  margin: 0 0 5px;
  color: #f0f3f9;
  font-size: 0.65rem;
  line-height: 1.2;
  font-weight: 650;
}

.reference-product-card p {
  position: relative;
  z-index: 1;
  flex: 1;
  margin: 0;
  color: #8f99ad;
  font-size: 0.48rem;
  line-height: 1.45;
}

.product-learn {
  position: relative;
  z-index: 1;
  margin-top: 7px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: color-mix(in srgb, var(--product-color) 72%, #fff);
  font-size: 0.49rem;
  font-weight: 620;
}

.showcase-section {
  padding: 0 0 4px;
}

.showcase-shell {
  padding: 7px 22px 6px;
  border: 1px solid rgba(91, 104, 159, 0.2);
  border-radius: 17px;
  background:
    radial-gradient(ellipse 45% 38% at 83% 0%, rgba(88, 28, 135, 0.12), transparent 70%),
    linear-gradient(180deg, rgba(4, 7, 19, 0.64), rgba(3, 5, 14, 0.82));
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
}

.showcase-shell > .reference-section-heading {
  margin-bottom: 4px;
}

.showcase-shell :deep(.showcase) {
  border-radius: 11px;
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.4);
}

.showcase-shell :deep(.showcase-chrome) {
  min-height: 287px;
  grid-template-columns: 117px 1fr;
  border-radius: 10px;
}

.showcase-shell :deep(.showcase-sidebar) {
  padding: 11px 9px;
}

.showcase-shell :deep(.sb-brand) {
  margin-bottom: 10px;
  font-size: 0.5rem;
}

.showcase-shell :deep(.sb-item) {
  padding: 4px 7px;
  font-size: 0.5rem;
  border-radius: 5px;
}

.showcase-shell :deep(.showcase-main) {
  gap: 7px;
  padding: 8px 10px 7px;
}

.showcase-shell :deep(.showcase-top h3) {
  font-size: 0.64rem;
}

.showcase-shell :deep(.pill) {
  padding: 2px 6px;
  font-size: 0.45rem;
}

.showcase-shell :deep(.avatar) {
  width: 17px;
  height: 17px;
}

.showcase-shell :deep(.kpi-row),
.showcase-shell :deep(.panel-row) {
  gap: 6px;
}

.showcase-shell :deep(.kpi) {
  gap: 2px;
  padding: 7px;
  border-radius: 7px;
}

.showcase-shell :deep(.kpi-label),
.showcase-shell :deep(.panel-head) {
  font-size: 0.46rem;
}

.showcase-shell :deep(.kpi-value) {
  font-size: 0.78rem;
}

.showcase-shell :deep(.kpi-delta),
.showcase-shell :deep(.chip) {
  font-size: 0.4rem;
}

.showcase-shell :deep(.panel-row) {
  min-height: 123px;
  grid-template-columns: 1.3fr 1fr 0.85fr;
}

.showcase-shell :deep(.panel) {
  padding: 7px;
  border-radius: 7px;
}

.showcase-shell :deep(.panel-head) {
  margin-bottom: 5px;
}

.showcase-shell :deep(.chart) {
  height: 68px;
}

.showcase-shell :deep(.chart-axis),
.showcase-shell :deep(.task-meta span),
.showcase-shell :deep(.workflow-cap) {
  font-size: 0.38rem;
}

.showcase-shell :deep(.task-list) {
  gap: 5px;
}

.showcase-shell :deep(.task-list li) {
  grid-template-columns: 5px 1fr 30px 19px;
  gap: 4px;
}

.showcase-shell :deep(.task-meta strong) {
  font-size: 0.42rem;
}

.showcase-shell :deep(.task-list em) {
  font-size: 0.39rem;
}

.showcase-shell :deep(.workflow) {
  height: 74px;
}

.showcase-shell :deep(.feature-strip) {
  gap: 5px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.showcase-shell :deep(.feat) {
  gap: 5px;
  padding: 6px;
  border-radius: 6px;
}

.showcase-shell :deep(.feat strong) {
  font-size: 0.43rem;
}

.showcase-shell :deep(.feat span) {
  font-size: 0.37rem;
}

.why-eco-section {
  padding: 0 0 12px;
}

.why-eco-grid {
  display: grid;
  grid-template-columns: 1.62fr 0.92fr;
  gap: 15px;
  align-items: start;
}

.why-block {
  min-height: 248px;
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(84, 98, 153, 0.17);
  border-radius: 14px;
  background: rgba(3, 6, 17, 0.5);
}

.why-copy {
  min-width: 0;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.why-card {
  min-height: 86px;
  padding: 10px 9px 8px;
  border: 1px solid rgba(80, 95, 151, 0.2);
  border-radius: 7px;
  background: linear-gradient(145deg, rgba(10, 15, 36, 0.88), rgba(5, 8, 21, 0.9));
}

.why-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 6px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  color: var(--why-color);
  border: 1px solid color-mix(in srgb, var(--why-color) 48%, transparent);
  background: color-mix(in srgb, var(--why-color) 8%, transparent);
  box-shadow: 0 0 11px color-mix(in srgb, var(--why-color) 18%, transparent);
}

.why-card h3 {
  margin: 0 0 3px;
  color: #edf1f8;
  font-size: 0.5rem;
  line-height: 1.25;
}

.why-card p {
  margin: 0;
  color: #8a95aa;
  font-size: 0.4rem;
  line-height: 1.45;
}

.galaxy-panel {
  position: relative;
  min-height: 222px;
  overflow: hidden;
  border-radius: 9px;
  background:
    radial-gradient(ellipse 46% 25% at 50% 44%, rgba(255, 255, 255, 0.8), transparent 7%),
    radial-gradient(ellipse 52% 29% at 50% 44%, rgba(244, 114, 182, 0.66), transparent 20%),
    radial-gradient(ellipse 78% 42% at 50% 44%, rgba(139, 92, 246, 0.65), transparent 45%),
    radial-gradient(ellipse 100% 55% at 50% 44%, rgba(37, 99, 235, 0.34), transparent 58%),
    #03050d;
}

.galaxy-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 12% 15%, #fff, transparent),
    radial-gradient(1px 1px at 82% 20%, #c4b5fd, transparent),
    radial-gradient(1px 1px at 75% 68%, #93c5fd, transparent),
    radial-gradient(1px 1px at 21% 75%, #fff, transparent),
    radial-gradient(1px 1px at 92% 84%, #f9a8d4, transparent);
}

.galaxy-disk {
  position: absolute;
  left: 12%;
  top: 15%;
  width: 76%;
  aspect-ratio: 1.8;
  border-radius: 50%;
  border-top: 1px solid rgba(196, 181, 253, 0.55);
  border-bottom: 1px solid rgba(96, 165, 250, 0.28);
  transform: rotate(-12deg);
  box-shadow:
    0 -8px 24px rgba(244, 114, 182, 0.22),
    0 10px 34px rgba(59, 130, 246, 0.18);
}

.galaxy-pills {
  position: absolute;
  z-index: 1;
  left: 9px;
  right: 9px;
  bottom: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.galaxy-pills span {
  display: grid;
  justify-items: center;
  gap: 3px;
  color: #9ca6bc;
  font-size: 0.37rem;
  text-align: center;
}

.galaxy-pills svg {
  color: #818cf8;
}

.eco-block {
  height: 259px;
  min-height: 0;
  padding: 12px 8px 4px;
  overflow: hidden;
  border: 1px solid rgba(84, 98, 153, 0.17);
  border-radius: 14px;
  background: rgba(3, 6, 17, 0.42);
}

.eco-block :deep(.eco) {
  width: 235px;
  max-width: 100%;
  margin-top: -8px;
}

.eco-block :deep(.eco-node) {
  min-width: 91px;
  gap: 5px;
  padding: 5px 7px 5px 5px;
  border-radius: 9px;
}

.eco-block :deep(.node-icon) {
  width: 22px;
  height: 22px;
  border-radius: 6px;
}

.eco-block :deep(.node-text strong) {
  font-size: 0.43rem;
}

.eco-block :deep(.node-text span) {
  font-size: 0.35rem;
}

.eco-block :deep(.eco-core) {
  width: 44px;
  height: 44px;
}

.cta-section {
  padding: 0 0 4px;
}

.cta-panel {
  min-height: 84px;
  padding: 8px 20px 7px;
  display: grid;
  justify-items: center;
  align-content: center;
  border: 1px solid rgba(126, 97, 205, 0.28);
  border-radius: 10px;
  background:
    radial-gradient(ellipse 36% 100% at 87% 100%, rgba(190, 24, 93, 0.12), transparent 70%),
    radial-gradient(ellipse 42% 100% at 55% 0%, rgba(88, 28, 135, 0.12), transparent 74%),
    linear-gradient(180deg, rgba(9, 12, 29, 0.94), rgba(5, 8, 20, 0.94));
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.3);
}

.cta-panel h2 {
  margin: 0;
  color: #f3f5fb;
  font-size: 1rem;
  line-height: 1.2;
}

.cta-panel p {
  margin: 4px 0 8px;
  color: #929caf;
  font-size: 0.48rem;
  line-height: 1.3;
}

.reference-button.compact {
  min-height: 25px;
  padding: 0 19px;
  font-size: 0.49rem;
}

@media (min-width: 1200px) {
  .reference-container,
  .stats-wrap {
    width: min(100% - 96px, 1180px);
  }
}

@media (max-width: 900px) {
  .reference-container,
  .stats-wrap {
    width: min(100% - 32px, 760px);
  }

  .hero-reference-grid {
    grid-template-columns: 0.95fr 1.05fr;
  }

  .hero-logo-art {
    width: 410px;
    height: 410px;
  }

  .reference-products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .reference-product-card {
    min-height: 142px;
  }

  .why-eco-grid {
    grid-template-columns: 1fr;
  }

  .eco-block {
    display: grid;
    justify-items: center;
  }
}

@media (max-width: 680px) {
  .hero-v2 {
    height: auto;
    min-height: 680px;
  }

  .hero-reference-grid {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 52px 0 22px;
    text-align: center;
  }

  .hero-copy {
    order: 1;
  }

  .hero-badges,
  .hero-actions,
  .hero-trust {
    justify-content: center;
  }

  .hero-v2-lead {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-title-accent {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-art-wrap {
    order: 2;
    height: 330px;
    margin-top: -2px;
  }

  .hero-logo-art {
    width: 350px;
    height: 350px;
  }

  .hero-horizon {
    bottom: -116px;
  }

  .stats-wrap {
    margin-top: -8px;
  }

  .stats-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 8px 0;
  }

  .stat-item {
    min-height: 58px;
  }

  .stat-item:nth-child(2)::after {
    display: none;
  }

  .reference-products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .showcase-shell {
    padding: 12px 10px 10px;
  }

  .showcase-shell :deep(.showcase-chrome) {
    grid-template-columns: 1fr;
  }

  .showcase-shell :deep(.showcase-sidebar) {
    display: none;
  }

  .showcase-shell :deep(.kpi-row) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .showcase-shell :deep(.panel-row) {
    grid-template-columns: 1fr;
  }

  .showcase-shell :deep(.tasks-panel),
  .showcase-shell :deep(.workflow-panel) {
    display: none;
  }

  .showcase-shell :deep(.feature-strip) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .why-block {
    grid-template-columns: 1fr;
  }

  .galaxy-panel {
    min-height: 210px;
  }
}

@media (max-width: 420px) {
  .reference-container,
  .stats-wrap {
    width: min(100% - 24px, 390px);
  }

  .hero-v2 {
    min-height: 635px;
  }

  .hero-reference-grid {
    padding-top: 42px;
  }

  .hero-v2-title {
    font-size: 2.28rem;
  }

  .hero-v2-lead {
    max-width: 37ch;
    padding: 0 6px;
  }

  .hero-art-wrap {
    height: 296px;
  }

  .hero-logo-art {
    width: 310px;
    height: 310px;
  }

  .hero-trust {
    display: none;
  }

  .stat-item {
    gap: 7px;
    justify-content: flex-start;
    padding-left: 13px;
  }

  .stat-value {
    font-size: 1rem;
  }

  .reference-products-grid {
    gap: 7px;
  }

  .why-grid {
    grid-template-columns: 1fr 1fr;
  }

  .cta-panel {
    padding-inline: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reference-button,
  .reference-product-card {
    transition: none;
  }
}
</style>
