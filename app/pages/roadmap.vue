<template>
  <div ref="root" class="page roadmap-page">
    <div class="container">
      <PageHero
        :eyebrow="t('nav.roadmap')"
        :title="t('roadmap.title')"
        :desc="t('roadmap.desc')"
      />

      <div class="grid grid-4 road-grid" data-reveal-stagger>
        <div
          v-for="(col, i) in columns"
          :key="col.key"
          class="road-col"
          :style="{ '--neon': colors[i] }"
        >
          <span class="road-badge">{{ t(col.label) }}</span>
          <p class="road-desc">{{ t(col.desc) }}</p>
          <ul class="road-list">
            <li v-for="item in col.items" :key="item">{{ t(item) }}</li>
          </ul>
        </div>
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
import type { MsgKey } from '~/composables/useI18n'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
useReveal(root)

const colors = ['#22d3ee', '#a78bfa', '#fb923c', '#34d399']

const columns: { key: string; label: MsgKey; desc: MsgKey; items: MsgKey[] }[] = [
  {
    key: 'now',
    label: 'roadmap.now',
    desc: 'roadmap.nowDesc',
    items: ['roadmap.item.terminal', 'roadmap.item.hub', 'roadmap.item.studio']
  },
  {
    key: 'next',
    label: 'roadmap.next',
    desc: 'roadmap.nextDesc',
    items: ['roadmap.item.feedback', 'roadmap.item.docs']
  },
  {
    key: 'later',
    label: 'roadmap.later',
    desc: 'roadmap.laterDesc',
    items: ['roadmap.item.license', 'roadmap.item.team']
  },
  {
    key: 'released',
    label: 'roadmap.released',
    desc: 'roadmap.releasedDesc',
    items: ['roadmap.item.nav', 'roadmap.item.account']
  }
]
</script>

<style scoped>
.road-grid {
  margin-top: 28px;
}

@media (max-width: 960px) {
  .road-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .road-grid {
    grid-template-columns: 1fr;
  }
}

.road-col {
  min-height: 100%;
  padding: 22px 18px;
  border-radius: 16px;
  background: rgba(12, 14, 24, 0.72);
  border: 1px solid color-mix(in srgb, var(--neon, #a78bfa) 22%, transparent);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.road-col:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--neon, #a78bfa) 48%, transparent);
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.38),
    0 0 28px color-mix(in srgb, var(--neon, #a78bfa) 16%, transparent);
}

.road-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: color-mix(in srgb, var(--neon) 85%, #fff);
  background: color-mix(in srgb, var(--neon) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--neon) 32%, transparent);
}

.road-desc {
  margin: 12px 0 16px;
  font-size: 0.84rem;
  color: var(--text-muted);
  line-height: 1.55;
}

.road-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.road-list li {
  position: relative;
  padding: 11px 12px 11px 14px;
  border-radius: 10px;
  border: 1px solid rgba(167, 139, 250, 0.12);
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text);
}

.road-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 2px;
  border-radius: 2px;
  background: var(--neon, #a78bfa);
  box-shadow: 0 0 8px color-mix(in srgb, var(--neon, #a78bfa) 50%, transparent);
}
</style>
