<template>
  <div class="page solution-detail">
    <div class="container sol-wrap">
      <NuxtLink to="/solutions" class="back">← {{ t('solutions.title') }}</NuxtLink>

      <div v-if="!solution" class="err">Not found</div>
      <template v-else>
        <header class="sol-hero" :style="{ '--neon': accent }">
          <div class="sol-glow" aria-hidden="true" />
          <p class="sol-eyebrow">{{ t('nav.solutions') }}</p>
          <h1>{{ t(`solutions.${solution.slug}.title` as any) }}</h1>
          <p class="sol-problem">{{ t(`solutions.${solution.slug}.problem` as any) }}</p>
        </header>

        <article class="sol-body-card">
          <p>{{ t(`solutions.${solution.slug}.body` as any) }}</p>
        </article>

        <h2 class="sub">{{ t('solutions.products') }}</h2>
        <ul class="plist">
          <li v-for="p in solution.products" :key="p">{{ p }}</li>
        </ul>

        <div class="hero-actions sol-actions">
          <a
            class="btn btn-primary"
            :href="solution.primaryHref"
            :target="solution.primaryHref.startsWith('http') ? '_blank' : undefined"
            :rel="solution.primaryHref.startsWith('http') ? 'noopener' : undefined"
            @click="onPrimary($event)"
          >{{ actionLabel }}</a>
          <NuxtLink class="btn btn-outline" to="/products">{{ t('footer.allProducts') }}</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/contact">{{ t('footer.contact') }}</NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSolution } from '~/utils/solutions'

const { t } = useI18n()
const route = useRoute()
const solution = computed(() => getSolution(String(route.params.slug)))

const accentMap: Record<string, string> = {
  'remote-servers': '#22d3ee',
  'data-automation': '#a78bfa',
  enterprise: '#60a5fa',
  healthcare: '#f472b6',
  personal: '#fb923c'
}

const accent = computed(() => accentMap[solution.value?.slug || ''] || '#a78bfa')

const actionLabel = computed(() => {
  const a = solution.value?.primaryAction
  if (a === 'download') return t('action.download')
  if (a === 'use') return t('action.use')
  if (a === 'preview') return t('action.preview')
  if (a === 'contact') return t('action.contact')
  return t('action.learn')
})

function onPrimary(e: Event) {
  const href = solution.value?.primaryHref
  if (href && !href.startsWith('http')) {
    e.preventDefault()
    navigateTo(href)
  }
}
</script>

<style scoped>
.sol-wrap {
  max-width: 720px;
}

.back {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 0.88rem;
  color: var(--text-muted);
  text-decoration: none;
}

.back:hover {
  color: var(--accent-hover);
}

.sol-hero {
  position: relative;
  padding: 28px 24px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 18px;
  background: rgba(12, 14, 24, 0.72);
  border: 1px solid color-mix(in srgb, var(--neon) 28%, transparent);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.35),
    0 0 36px color-mix(in srgb, var(--neon) 12%, transparent);
}

.sol-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    90% 100% at 0% 0%,
    color-mix(in srgb, var(--neon) 22%, transparent),
    transparent 55%
  );
}

.sol-eyebrow {
  position: relative;
  z-index: 1;
  margin: 0 0 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--neon) 80%, #fff);
}

.sol-hero h1 {
  position: relative;
  z-index: 1;
  margin: 0 0 10px;
  font-size: clamp(1.5rem, 3.2vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-heading);
}

.sol-problem {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: color-mix(in srgb, var(--neon) 75%, #e9d5ff);
}

.sol-body-card {
  padding: 22px;
  border-radius: 16px;
  margin-bottom: 28px;
  background: rgba(12, 14, 24, 0.65);
  border: 1px solid rgba(167, 139, 250, 0.14);
}

.sol-body-card p {
  margin: 0;
  line-height: 1.8;
  color: var(--text-muted);
}

.sub {
  margin: 0 0 12px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.plist {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.plist li {
  position: relative;
  padding: 12px 14px 12px 32px;
  border-radius: 12px;
  background: rgba(12, 14, 24, 0.55);
  border: 1px solid rgba(167, 139, 250, 0.12);
  color: var(--text);
  font-size: 0.92rem;
}

.plist li::before {
  content: "";
  position: absolute;
  left: 14px;
  top: 50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transform: translateY(-50%);
  background: var(--ring-gradient);
}

.sol-actions {
  justify-content: flex-start;
  margin-top: 28px;
}

.err {
  color: var(--danger);
}
</style>
