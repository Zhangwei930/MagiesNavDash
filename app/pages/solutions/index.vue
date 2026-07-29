<template>
  <div ref="root" class="page solutions-page">
    <div class="container">
      <PageHero
        :eyebrow="t('nav.solutions')"
        :title="t('solutions.title')"
        :desc="t('solutions.desc')"
      />

      <div class="grid grid-2 sol-grid" data-reveal-stagger>
        <NuxtLink
          v-for="(s, i) in SOLUTIONS"
          :key="s.slug"
          class="neon-tile sol-card"
          :to="`/solutions/${s.slug}`"
          :style="{ '--neon': colors[i % colors.length] }"
        >
          <span class="sol-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3>{{ t(`solutions.${s.slug}.title` as any) }}</h3>
          <p class="sol-problem">{{ t(`solutions.${s.slug}.problem` as any) }}</p>
          <p class="sol-body">{{ t(`solutions.${s.slug}.body` as any) }}</p>
          <div class="sol-products">
            <span class="sol-label">{{ t('solutions.products') }}</span>
            <span v-for="p in s.products" :key="p" class="sol-chip">{{ p }}</span>
          </div>
          <span class="sol-link">{{ t('action.learn') }} →</span>
        </NuxtLink>
      </div>

      <div class="page-cta" data-reveal>
        <h2>{{ t('home.ctaTitle') }}</h2>
        <p>{{ t('home.ctaLead') }}</p>
        <div class="hero-actions">
          <NuxtLink class="btn btn-primary" to="/products">{{ t('home.ctaProducts') }}</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/contact">{{ t('footer.contact') }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SOLUTIONS } from '~/utils/solutions'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
useReveal(root)

const colors = ['#22d3ee', '#a78bfa', '#60a5fa', '#f472b6', '#fb923c', '#34d399']
</script>

<style scoped>
.sol-grid {
  margin-top: 28px;
}

.sol-card {
  min-height: 260px;
}

.sol-index {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--neon) 80%, #fff);
  opacity: 0.85;
}

.sol-card h3 {
  margin: 0;
  font-size: 1.15rem;
  color: var(--text-heading);
}

.sol-problem {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: color-mix(in srgb, var(--neon) 75%, #e9d5ff);
}

.sol-body {
  margin: 0;
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-muted);
}

.sol-products {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.sol-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-right: 4px;
}

.sol-chip {
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--neon) 28%, transparent);
  background: color-mix(in srgb, var(--neon) 10%, transparent);
  font-size: 0.75rem;
  color: var(--text);
}

.sol-link {
  font-size: 0.85rem;
  font-weight: 650;
  color: color-mix(in srgb, var(--neon) 85%, #fff);
}
</style>
