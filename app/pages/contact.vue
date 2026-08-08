<template>
  <div ref="root" class="page contact-page">
    <div class="container contact-wrap">
      <PageHero
        :eyebrow="t('footer.contact')"
        :title="t('contact.title')"
        :desc="t('contact.desc')"
        narrow
      />

      <div class="contact-grid" data-reveal-stagger>
        <article
          v-for="(item, i) in items"
          :key="item.key"
          class="neon-tile contact-card"
          :style="{ '--neon': colors[i] }"
        >
          <span class="contact-icon">{{ item.icon }}</span>
          <h3>{{ t(item.titleKey) }}</h3>
          <p>{{ t(item.bodyKey) }}</p>
          <NuxtLink v-if="item.to" class="btn btn-outline btn-sm" :to="item.to">
            {{ t(item.ctaKey) }}
          </NuxtLink>
          <a v-else class="btn btn-outline btn-sm" :href="item.href">
            {{ t(item.ctaKey) }}: hello@magies.top
          </a>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MsgKey } from '~/composables/useI18n'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
useReveal(root)

const colors = ['#60a5fa', '#a78bfa', '#f472b6']

const items: {
  key: string
  icon: string
  titleKey: MsgKey
  bodyKey: MsgKey
  ctaKey: MsgKey
  to?: string
  href?: string
}[] = [
  {
    key: 'product',
    icon: '◎',
    titleKey: 'contact.product',
    bodyKey: 'contact.productBody',
    ctaKey: 'contact.email',
    href: 'mailto:hello@magies.top'
  },
  {
    key: 'biz',
    icon: '✦',
    titleKey: 'contact.biz',
    bodyKey: 'contact.bizBody',
    ctaKey: 'contact.email',
    href: 'mailto:hello@magies.top'
  },
  {
    key: 'security',
    icon: '▣',
    titleKey: 'contact.security',
    bodyKey: 'contact.securityBody',
    ctaKey: 'contact.gotoSecurity',
    to: '/security'
  }
]
</script>

<style scoped>
.contact-wrap {
  max-width: 880px;
}

.contact-grid {
  margin-top: 28px;
  display: grid;
  gap: 14px;
}

.contact-card {
  min-height: auto;
}

.contact-icon {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: var(--neon);
  background: color-mix(in srgb, var(--neon) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--neon) 32%, transparent);
  font-size: 0.95rem;
}

.contact-card h3 {
  margin: 0;
  font-size: 1.05rem;
  color: var(--text-heading);
}

.contact-card p {
  margin: 0;
  line-height: 1.7;
  color: var(--text-muted);
  font-size: 0.92rem;
}

.contact-card .btn {
  align-self: flex-start;
  margin-top: 4px;
}
</style>
