<template>
  <div ref="root" class="reference-home" :lang="locale === 'zh' ? 'zh-CN' : 'en'">
    <section class="hero-v2" data-testid="home-hero" aria-labelledby="hero-title">
      <picture>
        <source srcset="/brand/magies-reference-hero.avif" type="image/avif">
        <img
          class="hero-backdrop"
          src="/brand/magies-reference-hero.jpg"
          alt=""
          aria-hidden="true"
          fetchpriority="high"
        >
      </picture>
      <div class="hero-shade" aria-hidden="true" />
      <span class="hero-core-spark" aria-hidden="true" />

      <div class="reference-container hero-content">
        <div class="hero-copy">
          <h1 id="hero-title" class="hero-v2-title" data-hero-in>
            <span class="hero-title-line hero-title-build">{{ t('home.heroBuild') }}</span>
            <span class="hero-title-line hero-title-automate">{{ t('home.heroAutomate') }}</span>
            <span class="hero-title-line hero-title-ship">{{ t('home.heroShip') }}</span>
          </h1>

          <p class="hero-kicker" data-hero-in>{{ t('home.heroKicker') }}</p>
          <p class="hero-claim" data-hero-in>{{ t('home.claim') }}</p>
          <p class="hero-description" data-hero-in>{{ t('home.heroDescription') }}</p>

          <div class="hero-actions" data-hero-in>
            <NuxtLink class="reference-button primary" to="/products">
              {{ t('home.explore') }}
              <ArrowRight :size="14" :stroke-width="1.8" />
            </NuxtLink>
            <NuxtLink class="reference-button secondary" to="/about">
              {{ t('home.learn') }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <a class="hero-scroll-cue" href="#products" :aria-label="t('home.scrollExplore')">
        <span>{{ t('home.scrollExplore') }}</span>
        <i aria-hidden="true" />
      </a>
    </section>

    <section
      class="stats-wrap reference-container"
      data-testid="home-metrics"
      :aria-label="t('home.metricsLabel')"
    >
      <ul class="stats-bar" data-reveal>
        <li v-for="stat in stats" :key="stat.label" class="stat-item">
          <span class="stat-icon" :style="{ '--stat-color': stat.color }">
            <component :is="stat.icon" :size="30" :stroke-width="1.65" />
          </span>
          <div>
            <strong class="stat-value">{{ stat.value }}</strong>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </li>
      </ul>
    </section>

    <section
      id="products"
      class="section products-section"
      data-testid="home-products"
      aria-labelledby="products-title"
    >
      <div class="reference-container">
        <div class="reference-section-heading" data-reveal>
          <span class="section-eyebrow">{{ t('home.productsEyebrow') }}</span>
          <h2 id="products-title">{{ t('home.productsTitle') }}</h2>
          <p>{{ t('home.productsDesc') }}</p>
        </div>

        <div class="product-universe" data-reveal>
          <picture>
            <source srcset="/brand/magies-reference-products.avif" type="image/avif">
            <img
              class="universe-backdrop"
              src="/brand/magies-reference-products.jpg"
              alt=""
              aria-hidden="true"
            >
          </picture>
          <span class="universe-twinkle" aria-hidden="true" />
          <picture>
            <source srcset="/brand/magies-reference-products.avif" type="image/avif">
            <img
              class="universe-core"
              src="/brand/magies-reference-products.jpg"
              alt=""
              aria-hidden="true"
            >
          </picture>

          <NuxtLink
            v-for="product in products"
            :key="product.name"
            class="product-planet"
            :class="product.position"
            :to="product.to"
          >
            <strong>{{ product.name }}</strong>
            <span>{{ product.description }}</span>
            <i><ArrowRight :size="14" :stroke-width="1.7" /></i>
          </NuxtLink>

          <NuxtLink class="all-products" to="/products">
            {{ t('home.allProducts') }}
            <ArrowRight :size="13" :stroke-width="1.8" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <section
      class="section why-section"
      data-testid="home-why"
      aria-labelledby="why-title"
    >
      <div class="reference-container why-shell">
        <div class="reference-section-heading" data-reveal>
          <span class="section-eyebrow">{{ t('home.whyEyebrow') }}</span>
          <h2 id="why-title">{{ t('home.whyTitle') }}</h2>
        </div>

        <div class="benefit-grid" data-reveal-stagger>
          <article v-for="benefit in benefits" :key="benefit.title" class="benefit-card">
            <span class="benefit-icon" :style="{ '--benefit-color': benefit.color }">
              <component :is="benefit.icon" :size="38" :stroke-width="1.6" />
            </span>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section
      class="section testimonials-section"
      data-testid="home-testimonials"
      aria-labelledby="testimonials-title"
    >
      <div class="reference-container">
        <div class="reference-section-heading" data-reveal>
          <span class="section-eyebrow">{{ t('home.testimonialsEyebrow') }}</span>
          <h2 id="testimonials-title">{{ t('home.testimonialsTitle') }}</h2>
        </div>

        <div class="testimonials-wrap" data-reveal>
          <button type="button" class="testimonial-arrow prev" :aria-label="t('home.previousReview')">
            <ChevronLeft :size="18" />
          </button>

          <div class="testimonial-grid">
            <article
              v-for="testimonial in testimonials"
              :key="testimonial.author"
              class="testimonial-card"
            >
              <span class="quote-mark" aria-hidden="true">“</span>
              <p>{{ testimonial.quote }}</p>
              <footer>
                <span
                  class="testimonial-avatar"
                  :style="{ '--avatar-position': testimonial.avatarPosition }"
                  aria-hidden="true"
                />
                <span>
                  <strong>{{ testimonial.author }}</strong>
                  <small>{{ testimonial.role }}</small>
                </span>
              </footer>
            </article>
          </div>

          <button type="button" class="testimonial-arrow next" :aria-label="t('home.nextReview')">
            <ChevronRight :size="18" />
          </button>
        </div>

        <div class="testimonial-dots" aria-hidden="true">
          <i />
          <i class="active" />
          <i />
        </div>
      </div>
    </section>

    <section
      class="section cta-section"
      data-testid="home-cta"
      aria-labelledby="cta-title"
    >
      <picture>
        <source srcset="/brand/magies-reference-cta.avif" type="image/avif">
        <img
          class="cta-backdrop"
          src="/brand/magies-reference-cta.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
        >
      </picture>
      <div class="cta-shade" aria-hidden="true" />
      <div class="reference-container cta-panel" data-reveal>
        <h2 id="cta-title">{{ t('home.ctaTitle') }}</h2>
        <p>{{ t('home.ctaLead') }}</p>
        <div class="cta-actions">
          <NuxtLink class="reference-button primary compact" to="/products">
            {{ t('home.ctaProducts') }}
          </NuxtLink>
          <NuxtLink class="reference-button secondary compact" to="/contact">
            {{ t('home.ctaContact') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Code2,
  Globe2,
  Headphones,
  Rocket,
  ShieldCheck,
  Users,
  type LucideIcon
} from 'lucide-vue-next'

const root = ref<HTMLElement | null>(null)
useReveal(root)
const { t, locale } = useI18n()

const stats = computed<{ value: string; label: string; color: string; icon: LucideIcon }[]>(
  () => [
    { value: '10K+', label: t('home.stat.developers'), color: '#b15cff', icon: Users },
    { value: '200+', label: t('home.stat.regions'), color: '#29bfff', icon: Globe2 },
    { value: '99.99%', label: t('home.stat.uptime'), color: '#24e6e0', icon: ShieldCheck },
    { value: '7×24', label: t('home.stat.support'), color: '#ff9944', icon: Headphones }
  ]
)

const products = computed(() => [
  {
    name: 'Magies Terminal',
    description: t('home.product.terminalDescShort'),
    position: 'terminal',
    to: '/products/magies-terminal'
  },
  {
    name: 'Magies PDF',
    description: t('home.product.pdfDescShort'),
    position: 'pdf',
    to: '/products/magies-pdf'
  },
  {
    name: 'Magies Data Studio',
    description: t('home.product.studioDescShort'),
    position: 'studio',
    to: '/products/magies-data-studio'
  },
  {
    name: 'Magies Future',
    description: t('home.product.futureDesc'),
    position: 'future',
    to: '/roadmap'
  }
])

const benefits = computed<{
  title: string
  description: string
  color: string
  icon: LucideIcon
}[]>(() => [
  {
    title: t('home.benefit.simple'),
    description: t('home.benefit.simpleDesc'),
    color: '#c05cff',
    icon: Rocket
  },
  {
    title: t('home.benefit.automation'),
    description: t('home.benefit.automationDesc'),
    color: '#35e7f6',
    icon: Code2
  },
  {
    title: t('home.benefit.secure'),
    description: t('home.benefit.secureDesc'),
    color: '#1ccfff',
    icon: ShieldCheck
  },
  {
    title: t('home.benefit.global'),
    description: t('home.benefit.globalDesc'),
    color: '#ff9d3d',
    icon: Globe2
  },
  {
    title: t('home.benefit.evolve'),
    description: t('home.benefit.evolveDesc'),
    color: '#cf63ff',
    icon: ChartNoAxesCombined
  }
])

const testimonials = computed(() => [
  {
    quote: t('home.testimonial.one'),
    author: t('home.testimonial.oneAuthor'),
    role: t('home.testimonial.oneRole'),
    avatarPosition: '0%'
  },
  {
    quote: t('home.testimonial.two'),
    author: t('home.testimonial.twoAuthor'),
    role: t('home.testimonial.twoRole'),
    avatarPosition: '50%'
  },
  {
    quote: t('home.testimonial.three'),
    author: t('home.testimonial.threeAuthor'),
    role: t('home.testimonial.threeRole'),
    avatarPosition: '100%'
  }
])
</script>

<style scoped>
/* AVIF sources wrap the backdrops in <picture>; generate no box so the
   absolutely-positioned <img> inside keeps positioning against its section. */
picture {
  display: contents;
}

.reference-home {
  position: relative;
  overflow: hidden;
  color: #f5f7ff;
  background: #020511;
}

.reference-home::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 7% 59%, rgba(67, 36, 180, 0.22), transparent 18%),
    radial-gradient(circle at 94% 77%, rgba(201, 56, 210, 0.16), transparent 17%);
}

.reference-container {
  position: relative;
  z-index: 2;
  width: min(100% - 48px, 1180px);
  margin: 0 auto;
}

.section {
  position: relative;
  z-index: 1;
}

.hero-v2 {
  position: relative;
  z-index: 1;
  height: 670px;
  overflow: hidden;
}

.hero-v2::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(circle at 54% 22%, rgba(112, 211, 255, 0.96) 0 1.1px, transparent 2.3px),
    radial-gradient(circle at 63% 14%, rgba(217, 151, 255, 0.92) 0 1.2px, transparent 2.5px),
    radial-gradient(circle at 78% 18%, rgba(255, 255, 255, 0.98) 0 1px, transparent 2.2px),
    radial-gradient(circle at 86% 31%, rgba(125, 193, 255, 0.94) 0 1.2px, transparent 2.5px),
    radial-gradient(circle at 60% 55%, rgba(238, 132, 255, 0.9) 0 1.2px, transparent 2.5px),
    radial-gradient(circle at 83% 64%, rgba(255, 255, 255, 0.96) 0 1.1px, transparent 2.3px),
    radial-gradient(circle at 92% 47%, rgba(109, 210, 255, 0.94) 0 1.2px, transparent 2.5px),
    radial-gradient(circle at 70% 72%, rgba(190, 133, 255, 0.92) 0 1.2px, transparent 2.5px),
    radial-gradient(circle at 95% 19%, rgba(255, 160, 217, 0.9) 0 1.1px, transparent 2.3px),
    radial-gradient(circle at 88% 78%, rgba(99, 173, 255, 0.94) 0 1px, transparent 2.2px);
  mix-blend-mode: screen;
  animation: heroGalaxyTwinkle 3.4s ease-in-out infinite alternate;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right center;
  filter: saturate(1.08) contrast(1.03);
}

.hero-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(1, 4, 15, 0.22) 0%, transparent 44%),
    linear-gradient(180deg, rgba(1, 4, 15, 0.12), transparent 66%, rgba(1, 4, 15, 0.48));
}

.hero-core-spark {
  position: absolute;
  left: 72.3%;
  top: 43.2%;
  z-index: 2;
  width: 190px;
  height: 190px;
  pointer-events: none;
  /* Bright core stops unchanged from the original circular spark; the arms get
     only a faint tail so they glint rather than reading as a solid slab. */
  background: radial-gradient(
    circle,
    #fff 0 4%,
    rgba(245, 208, 254, 0.98) 5%,
    rgba(192, 132, 252, 0.34) 13%,
    rgba(167, 139, 250, 0.1) 30%,
    rgba(167, 139, 250, 0.035) 55%,
    transparent 100%
  );
  /* Same 8-point construction as .universe-core so the scale pulse reads as a
     star, not a breathing circle. Waist is kept narrow to match the slender
     arms painted into the hero art instead of thickening them. Expressed in
     percentages, not px, so the proportions hold when the breakpoints below
     shrink this element to 126px / clamp(120px, 24vw, 160px). */
  clip-path: polygon(
    50% 0%,
    54.7% 45.3%,
    100% 50%,
    54.7% 54.7%,
    50% 100%,
    45.3% 54.7%,
    0% 50%,
    45.3% 45.3%
  );
  mix-blend-mode: screen;
  transform: translate(-50%, -50%);
  transform-origin: center;
  animation: heroCoreSparkle 2.8s ease-in-out infinite;
}

.hero-core-spark::before,
.hero-core-spark::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(167, 139, 250, 0.58),
    #fff,
    rgba(244, 114, 182, 0.58),
    transparent
  );
  filter: blur(0.2px);
  transform: translate(-50%, -50%);
}

.hero-core-spark::before {
  width: 100%;
  height: 2px;
}

.hero-core-spark::after {
  width: 2px;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(96, 165, 250, 0.58),
    #fff,
    rgba(216, 180, 254, 0.62),
    transparent
  );
}

.hero-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 58px;
}

.hero-copy {
  width: 35%;
  min-width: 360px;
}

.hero-v2-title {
  margin: 0 0 24px;
  font-size: clamp(4rem, 6.3vw, 6rem);
  font-weight: 780;
  line-height: 0.92;
  letter-spacing: -0.055em;
}

.hero-title-line {
  display: block;
  width: max-content;
}

.hero-title-build {
  background: linear-gradient(92deg, #81c4ff, #a974ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-title-automate {
  margin-top: 11px;
  background: linear-gradient(92deg, #a57aff, #e843c0 58%, #ff6f72);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-title-ship {
  margin-top: 11px;
  background: linear-gradient(92deg, #c45af0, #ff4f88 57%, #ff9644);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-kicker {
  margin: 0 0 18px;
  color: #fff;
  font-size: 1.18rem;
  line-height: 1.5;
}

.hero-claim {
  max-width: 18ch;
  margin: 0 0 16px;
  color: #f2f3f7;
  font-size: 1.35rem;
  line-height: 1.55;
  font-weight: 520;
}

.hero-description {
  max-width: 35ch;
  margin: 0 0 24px;
  color: #aab2c9;
  font-size: 0.86rem;
  line-height: 1.72;
}

.hero-actions,
.cta-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.reference-button {
  min-width: 158px;
  min-height: 46px;
  padding: 0 24px;
  border: 1px solid transparent;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 650;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.reference-button:hover {
  transform: translateY(-2px);
}

.reference-button.primary {
  color: #1e123a;
  background: linear-gradient(105deg, #80adff 0%, #c46aff 46%, #ff638f 74%, #ff9854 100%);
  box-shadow:
    0 7px 26px rgba(110, 83, 255, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.46);
}

.reference-button.secondary {
  border-color: rgba(132, 149, 213, 0.55);
  background: rgba(3, 7, 20, 0.48);
}

.reference-button.secondary:hover {
  border-color: rgba(180, 133, 255, 0.82);
}

.hero-scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 38px;
  z-index: 3;
  display: grid;
  justify-items: center;
  gap: 9px;
  color: #8791af;
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transform: translateX(-50%);
}

.hero-scroll-cue i {
  position: relative;
  width: 17px;
  height: 29px;
  border: 1px solid rgba(125, 152, 255, 0.8);
  border-radius: 999px;
}

.hero-scroll-cue i::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 5px;
  width: 3px;
  height: 6px;
  border-radius: 999px;
  background: #8aa9ff;
  transform: translateX(-50%);
  animation: scrollDot 1.8s ease-in-out infinite;
}

.stats-wrap {
  z-index: 5;
  margin-top: -28px;
}

.stats-bar {
  min-height: 112px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  list-style: none;
  border: 1px solid rgba(117, 98, 211, 0.5);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(7, 13, 33, 0.94), rgba(3, 8, 23, 0.94));
  box-shadow:
    0 22px 54px rgba(0, 0, 0, 0.45),
    0 0 38px rgba(87, 66, 214, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.stat-item {
  position: relative;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.stat-item:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 23%;
  right: 0;
  bottom: 23%;
  width: 1px;
  background: linear-gradient(transparent, rgba(116, 126, 177, 0.28), transparent);
}

.stat-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  color: var(--stat-color);
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--stat-color) 55%, transparent));
}

.stat-value {
  display: block;
  color: var(--stat-color, #fff);
  font-size: 1.65rem;
  line-height: 1.08;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  display: block;
  margin-top: 7px;
  color: #c1c8db;
  font-size: 0.78rem;
}

.reference-section-heading {
  margin: 0 auto 30px;
  text-align: center;
}

.section-eyebrow {
  display: block;
  margin-bottom: 12px;
  color: #8891af;
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.reference-section-heading h2 {
  margin: 0;
  color: #f7f8fc;
  font-size: clamp(1.85rem, 3vw, 2.55rem);
  line-height: 1.2;
  font-weight: 520;
  letter-spacing: -0.03em;
}

.reference-section-heading p {
  margin: 11px 0 0;
  color: #9aa4bb;
  font-size: 0.82rem;
  line-height: 1.6;
}

.products-section {
  padding: 54px 0 46px;
}

.product-universe {
  position: relative;
  height: 560px;
  overflow: hidden;
  border-radius: 18px;
  background: #020511;
  isolation: isolate;
}

.universe-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* average tone of the art — lazy decode lands without a visible pop.
     Hidden once loaded: object-fit cover leaves no gap. */
  background-color: #14112d;
}

.product-universe::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(2, 5, 17, 0.08), transparent 45%, rgba(2, 5, 17, 0.18)),
    radial-gradient(circle at 50% 50%, transparent 38%, rgba(1, 4, 14, 0.08) 80%);
}

.universe-twinkle,
.universe-twinkle::before,
.universe-twinkle::after {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  mix-blend-mode: screen;
}

.universe-twinkle {
  background:
    radial-gradient(circle at 11% 18%, #b8f1ff 0 1.8px, transparent 4px),
    radial-gradient(circle at 24% 43%, #e9b4ff 0 2px, transparent 4.5px),
    radial-gradient(circle at 38% 23%, #fff 0 1.7px, transparent 3.8px),
    radial-gradient(circle at 43% 78%, #86b8ff 0 2px, transparent 4.5px),
    radial-gradient(circle at 57% 18%, #a2efff 0 1.8px, transparent 4px),
    radial-gradient(circle at 62% 66%, #f6adff 0 2px, transparent 4.5px),
    radial-gradient(circle at 73% 40%, #fff 0 1.8px, transparent 4px),
    radial-gradient(circle at 86% 26%, #c99cff 0 2px, transparent 4.5px),
    radial-gradient(circle at 90% 74%, #ffbd82 0 2px, transparent 4.5px),
    radial-gradient(circle at 16% 79%, #8acbff 0 1.8px, transparent 4px);
  animation: galaxyTwinkle 1.9s ease-in-out infinite alternate;
}

.universe-twinkle::before {
  content: "";
  background:
    radial-gradient(circle at 18% 31%, #fff 0 1.6px, transparent 3.6px),
    radial-gradient(circle at 31% 64%, #b38cff 0 2px, transparent 4.4px),
    radial-gradient(circle at 47% 35%, #96e8ff 0 1.7px, transparent 3.8px),
    radial-gradient(circle at 54% 82%, #fff 0 1.8px, transparent 4px),
    radial-gradient(circle at 68% 22%, #d3a8ff 0 2px, transparent 4.4px),
    radial-gradient(circle at 78% 58%, #9adfff 0 1.8px, transparent 4px),
    radial-gradient(circle at 94% 42%, #fff 0 1.6px, transparent 3.6px),
    radial-gradient(circle at 7% 67%, #95b9ff 0 1.8px, transparent 4px);
  animation: galaxyTwinkle 2.8s ease-in-out -1.2s infinite alternate;
}

.universe-twinkle::after {
  content: "";
  background:
    radial-gradient(circle at 15% 52%, #ddafff 0 1.8px, transparent 4px),
    radial-gradient(circle at 35% 15%, #a5e9ff 0 1.6px, transparent 3.6px),
    radial-gradient(circle at 52% 55%, #fff 0 2px, transparent 4.5px),
    radial-gradient(circle at 66% 76%, #ca94ff 0 1.8px, transparent 4px),
    radial-gradient(circle at 81% 16%, #9cd9ff 0 1.8px, transparent 4px),
    radial-gradient(circle at 93% 63%, #fff 0 1.7px, transparent 3.8px);
  animation: galaxyTwinkle 3.7s ease-in-out -2.1s infinite alternate;
}

.universe-core {
  position: absolute;
  inset: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
  pointer-events: none;
  object-fit: cover;
  clip-path: polygon(
    50% calc(50% - 72px),
    calc(50% + 16px) calc(50% - 16px),
    calc(50% + 72px) 50%,
    calc(50% + 16px) calc(50% + 16px),
    50% calc(50% + 72px),
    calc(50% - 16px) calc(50% + 16px),
    calc(50% - 72px) 50%,
    calc(50% - 16px) calc(50% - 16px)
  );
  transform-origin: 50% 50%;
  animation: universeCoreSparkle 2.8s ease-in-out infinite;
}

.product-planet {
  position: absolute;
  z-index: 4;
  width: 185px;
  aspect-ratio: 1;
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.85);
  transform: translate(-50%, -50%);
  transition: transform 0.22s;
}

.product-planet:hover {
  transform: translate(-50%, -50%) scale(1.04);
}

.product-planet strong {
  max-width: 10ch;
  font-size: 1.2rem;
  line-height: 1.12;
  font-weight: 600;
}

.product-planet strong,
.product-planet span {
  width: 100%;
  text-align: center;
}

.product-planet span {
  margin-top: 9px;
  color: #d4daea;
  font-size: 0.72rem;
}

.product-planet i {
  position: absolute;
  left: 50%;
  top: 78%;
  width: 34px;
  height: 34px;
  margin-top: 0;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 50%;
  background: rgba(3, 7, 20, 0.35);
  transform: translate(-50%, -50%);
}

.product-planet.terminal {
  left: 18.5%;
  top: 25%;
}

.product-planet.pdf {
  left: 70%;
  top: 24%;
}

.product-planet.studio {
  left: 27%;
  top: 69%;
}

.product-planet.future {
  left: 83.5%;
  top: 65%;
}

.all-products {
  position: absolute;
  left: 50%;
  bottom: 18px;
  z-index: 5;
  min-width: 190px;
  min-height: 44px;
  padding: 0 25px;
  border: 1px solid rgba(132, 111, 234, 0.6);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #e9e5fb;
  background: rgba(5, 8, 24, 0.72);
  font-size: 0.77rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transform: translateX(-50%);
  backdrop-filter: blur(10px);
}

.why-section {
  padding: 24px 0 30px;
}

.why-shell {
  padding: 35px 30px 28px;
  overflow: hidden;
  border-radius: 26px;
  background:
    radial-gradient(circle at 6% 50%, rgba(78, 36, 188, 0.28), transparent 30%),
    linear-gradient(180deg, rgba(8, 15, 38, 0.92), rgba(4, 9, 25, 0.92));
  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
}

.benefit-card {
  min-height: 190px;
  padding: 24px 18px 20px;
  border: 1px solid rgba(101, 118, 178, 0.42);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(8, 15, 36, 0.72), rgba(4, 8, 22, 0.66));
  text-align: center;
}

.benefit-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  color: var(--benefit-color);
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--benefit-color) 50%, transparent));
}

.benefit-card h3 {
  margin: 0 0 11px;
  color: #fff;
  font-size: 1rem;
  font-weight: 520;
}

.benefit-card p {
  margin: 0;
  color: #8e99b2;
  font-size: 0.72rem;
  line-height: 1.65;
}

.testimonials-section {
  padding: 30px 0 45px;
  background:
    radial-gradient(circle at 92% 78%, rgba(61, 73, 222, 0.14), transparent 23%),
    radial-gradient(circle at 8% 30%, rgba(103, 50, 199, 0.12), transparent 22%);
}

.testimonials-wrap {
  position: relative;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.testimonial-card {
  position: relative;
  min-height: 166px;
  padding: 29px 28px 22px;
  border: 1px solid rgba(104, 121, 180, 0.46);
  border-radius: 10px;
  background: linear-gradient(145deg, rgba(10, 17, 39, 0.82), rgba(5, 10, 27, 0.78));
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.2);
}

.quote-mark {
  position: absolute;
  left: 18px;
  top: 12px;
  color: #9b70ff;
  font-size: 2.1rem;
  font-family: Georgia, serif;
  line-height: 1;
}

.testimonial-card > p {
  min-height: 58px;
  margin: 0 0 18px;
  color: #d9deec;
  font-size: 0.8rem;
  line-height: 1.7;
}

.testimonial-card footer {
  display: flex;
  align-items: center;
  gap: 11px;
}

.testimonial-avatar {
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  background: url('/brand/trust-avatar-strip.jpg') var(--avatar-position) center / 500% auto no-repeat;
}

.testimonial-card footer > span:last-child {
  display: grid;
  gap: 3px;
}

.testimonial-card footer strong {
  color: #f8f9fd;
  font-size: 0.72rem;
  font-weight: 600;
}

.testimonial-card footer small {
  color: #818ca6;
  font-size: 0.62rem;
}

.testimonial-arrow {
  position: absolute;
  top: 50%;
  z-index: 3;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(107, 123, 183, 0.54);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #cad1e6;
  background: rgba(4, 9, 23, 0.8);
  transform: translateY(-50%);
  cursor: pointer;
}

.testimonial-arrow.prev {
  left: -54px;
}

.testimonial-arrow.next {
  right: -54px;
}

.testimonial-dots {
  margin-top: 22px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.testimonial-dots i {
  width: 7px;
  height: 7px;
  border: 1px solid #6861d9;
  border-radius: 50%;
}

.testimonial-dots i.active {
  background: #816fff;
  box-shadow: 0 0 10px rgba(129, 111, 255, 0.8);
}

.cta-section {
  min-height: 300px;
  overflow: hidden;
}

.cta-backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 68%;
  background-color: #0a0f2c;
}

.cta-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 5, 17, 0.22), rgba(2, 5, 17, 0.05) 46%, rgba(2, 5, 17, 0.44));
}

.cta-panel {
  min-height: 300px;
  padding-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.cta-panel h2 {
  margin: 0;
  color: #fff;
  font-size: clamp(1.65rem, 3vw, 2.2rem);
  font-weight: 520;
  letter-spacing: -0.025em;
}

.cta-panel p {
  margin: 12px 0 24px;
  color: #9ba5bd;
  font-size: 0.78rem;
}

.reference-button.compact {
  min-width: 196px;
  min-height: 46px;
}

@keyframes scrollDot {
  0%,
  100% {
    opacity: 0.3;
    transform: translate(-50%, 0);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, 10px);
  }
}

@keyframes heroCoreSparkle {
  0%,
  100% {
    filter: brightness(0.9);
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    filter: brightness(1.42);
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes heroGalaxyTwinkle {
  0% {
    opacity: 0.2;
    filter: brightness(0.82);
  }

  48% {
    opacity: 0.78;
    filter: brightness(1.42);
  }

  100% {
    opacity: 0.4;
    filter: brightness(1.06);
  }
}

@keyframes universeCoreSparkle {
  0%,
  100% {
    filter: brightness(0.9);
    transform: scale(1);
  }

  50% {
    filter: brightness(1.42);
    transform: scale(1.08);
  }
}

@keyframes galaxyTwinkle {
  0% {
    opacity: 0.05;
    filter: brightness(0.5);
  }

  38% {
    opacity: 1;
    filter: brightness(1.8);
  }

  64% {
    opacity: 0.16;
    filter: brightness(0.72);
  }

  100% {
    opacity: 0.82;
    filter: brightness(1.48);
  }
}

@media (max-width: 1100px) {
  .reference-container {
    width: min(100% - 48px, 960px);
  }

  .hero-v2 {
    height: 610px;
  }

  .hero-copy {
    width: 40%;
  }

  .hero-v2-title {
    font-size: clamp(3.5rem, 7vw, 4.8rem);
  }

  .product-universe {
    height: 510px;
  }

  .testimonial-arrow.prev {
    left: -18px;
  }

  .testimonial-arrow.next {
    right: -18px;
  }
}

@media (min-width: 821px) and (max-width: 1100px) {
  .hero-v2 {
    height: 500px;
  }

  .hero-content {
    padding-bottom: 30px;
  }

  .hero-copy {
    width: 34%;
    min-width: 300px;
  }

  .hero-v2-title {
    margin-bottom: 18px;
    font-size: 3rem;
  }

  .hero-title-automate,
  .hero-title-ship {
    margin-top: 7px;
  }

  .hero-kicker {
    margin-bottom: 12px;
    font-size: 0.9rem;
  }

  .hero-claim {
    margin-bottom: 10px;
    font-size: 1rem;
    line-height: 1.48;
  }

  .hero-description {
    margin-bottom: 16px;
    font-size: 0.7rem;
    line-height: 1.65;
  }

  .reference-button {
    min-width: 118px;
    min-height: 36px;
    padding: 0 18px;
    font-size: 0.68rem;
  }

  .hero-scroll-cue {
    bottom: 20px;
  }

  .hero-core-spark {
    left: 69.5%;
    width: 126px;
    height: 126px;
  }

  .stats-wrap {
    margin-top: -22px;
  }

  .stats-bar {
    min-height: 84px;
  }

  .stat-item {
    gap: 11px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    margin-top: 4px;
    font-size: 0.62rem;
  }

  .products-section {
    padding: 24px 0 16px;
  }

  .reference-section-heading {
    margin-bottom: 16px;
  }

  .section-eyebrow {
    margin-bottom: 7px;
    font-size: 0.54rem;
  }

  .reference-section-heading h2 {
    font-size: 1.55rem;
  }

  .reference-section-heading p {
    margin-top: 6px;
    font-size: 0.65rem;
  }

  .product-universe {
    height: 300px;
    border-radius: 14px;
  }

  .product-planet {
    width: 140px;
    padding: 8px;
  }

  .product-planet strong {
    font-size: 0.84rem;
  }

  .product-planet span {
    margin-top: 5px;
    font-size: 0.56rem;
  }

  .product-planet i {
    width: 25px;
    height: 25px;
  }

  .all-products {
    bottom: 9px;
    min-width: 145px;
    min-height: 32px;
    font-size: 0.61rem;
  }

  .why-section {
    padding: 12px 0;
  }

  .why-shell {
    padding: 18px 24px 16px;
    border-radius: 20px;
  }

  .benefit-grid {
    gap: 12px;
  }

  .benefit-card {
    min-height: 126px;
    padding: 13px 10px 11px;
  }

  .benefit-icon {
    width: 38px;
    height: 38px;
    margin-bottom: 7px;
  }

  .benefit-card h3 {
    margin-bottom: 6px;
    font-size: 0.76rem;
  }

  .benefit-card p {
    font-size: 0.55rem;
    line-height: 1.52;
  }

  .testimonials-section {
    padding: 18px 0 24px;
  }

  .testimonial-grid {
    gap: 18px;
  }

  .testimonial-card {
    min-height: 116px;
    padding: 21px 20px 14px;
  }

  .quote-mark {
    top: 8px;
    font-size: 1.6rem;
  }

  .testimonial-card > p {
    min-height: 38px;
    margin-bottom: 9px;
    font-size: 0.61rem;
    line-height: 1.55;
  }

  .testimonial-avatar {
    width: 25px;
    height: 25px;
  }

  .testimonial-card footer strong {
    font-size: 0.58rem;
  }

  .testimonial-card footer small {
    font-size: 0.5rem;
  }

  .testimonial-dots {
    margin-top: 12px;
  }

  .cta-section,
  .cta-panel {
    min-height: 160px;
  }

  .cta-panel {
    padding-top: 34px;
  }

  .cta-panel h2 {
    font-size: 1.35rem;
  }

  .cta-panel p {
    margin: 8px 0 14px;
    font-size: 0.62rem;
  }

  .reference-button.compact {
    min-width: 150px;
    min-height: 35px;
  }
}

@media (max-width: 820px) {
  .hero-v2 {
    height: 760px;
  }

  .hero-backdrop {
    object-position: 70% center;
  }

  .hero-core-spark {
    left: 75%;
    top: 43.5%;
    width: clamp(120px, 24vw, 160px);
    height: clamp(120px, 24vw, 160px);
  }

  .hero-shade {
    background: linear-gradient(90deg, rgba(1, 4, 15, 0.74), rgba(1, 4, 15, 0.08) 78%);
  }

  .hero-content {
    align-items: flex-start;
    padding-top: 88px;
  }

  .hero-copy {
    width: 54%;
    min-width: 320px;
  }

  .stats-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 13px 0;
  }

  .stat-item {
    min-height: 78px;
  }

  .stat-item:nth-child(2)::after {
    display: none;
  }

  .benefit-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .benefit-card:last-child {
    grid-column: 1 / -1;
  }

  .testimonial-grid {
    grid-template-columns: 1fr;
  }

  .testimonial-card:nth-child(n + 2) {
    display: none;
  }

  .testimonial-arrow.prev {
    left: -12px;
  }

  .testimonial-arrow.next {
    right: -12px;
  }
}

@media (max-width: 620px) {
  .reference-container {
    width: min(100% - 28px, 560px);
  }

  .hero-v2 {
    height: 720px;
  }

  .hero-backdrop {
    object-position: 70% center;
  }

  .hero-shade {
    background:
      linear-gradient(180deg, rgba(1, 4, 15, 0.18), rgba(1, 4, 15, 0.14) 58%, rgba(1, 4, 15, 0.68)),
      linear-gradient(90deg, rgba(1, 4, 15, 0.72), transparent 86%);
  }

  .hero-content {
    padding-top: 62px;
    align-items: flex-start;
  }

  .hero-copy {
    width: 100%;
    min-width: 0;
  }

  .hero-v2-title {
    font-size: clamp(3.3rem, 15vw, 4.7rem);
  }

  .hero-kicker {
    font-size: 1rem;
  }

  .hero-claim {
    max-width: 17ch;
    font-size: 1.1rem;
  }

  .hero-description {
    max-width: 32ch;
    font-size: 0.78rem;
  }

  .hero-scroll-cue {
    display: none;
  }

  .hero-actions,
  .cta-actions {
    gap: 10px;
  }

  .reference-button {
    min-width: 0;
    flex: 1;
    padding: 0 16px;
  }

  .stats-wrap {
    margin-top: -20px;
  }

  .stat-item {
    justify-content: flex-start;
    gap: 8px;
    padding-left: 12px;
  }

  .stat-icon {
    width: 38px;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .stat-label {
    font-size: 0.67rem;
  }

  .products-section {
    padding-top: 42px;
  }

  .product-universe {
    height: 610px;
  }

  .universe-backdrop {
    object-position: center;
  }

  .product-planet {
    width: 150px;
    padding: 10px;
  }

  .product-planet strong {
    font-size: 0.92rem;
  }

  .product-planet.terminal {
    left: 22%;
    top: 25%;
  }

  .product-planet.pdf {
    left: 76%;
    top: 24%;
  }

  .product-planet.studio {
    left: 25%;
    top: 69%;
  }

  .product-planet.future {
    left: 78%;
    top: 65%;
  }

  .why-shell {
    width: 100%;
    padding: 32px 14px 20px;
    border-radius: 18px;
  }

  .benefit-grid {
    gap: 12px;
  }

  .benefit-card {
    min-height: 175px;
    padding: 20px 10px 16px;
  }

  .benefit-card:last-child {
    grid-column: auto;
  }

  .testimonial-arrow {
    display: none;
  }

  .cta-section,
  .cta-panel {
    min-height: 330px;
  }

  .cta-backdrop {
    object-position: 64% center;
  }

  .cta-panel {
    padding-top: 70px;
  }

  .reference-button.compact {
    min-width: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-scroll-cue i::after,
  .hero-v2::before,
  .hero-core-spark,
  .universe-core,
  .universe-twinkle,
  .universe-twinkle::before,
  .universe-twinkle::after {
    animation: none;
  }

  .reference-button,
  .product-planet {
    transition: none;
  }
}
</style>
