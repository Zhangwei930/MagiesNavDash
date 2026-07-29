<template>
  <div ref="root" class="page about-page">
    <div class="container about-wrap">
      <PageHero
        :eyebrow="t('nav.about')"
        :title="t('about.title')"
        :desc="t('about.desc')"
        narrow
      />

      <div class="about-visual" data-reveal aria-hidden="true">
        <HeroOrbit />
      </div>

      <div class="about-grid" data-reveal-stagger>
        <article class="about-card">
          <span class="about-icon">✦</span>
          <h2>{{ t('about.whatTitle') }}</h2>
          <p>{{ t('about.whatBody') }}</p>
        </article>

        <article class="about-card">
          <span class="about-icon">◎</span>
          <h2>{{ t('about.whyTitle') }}</h2>
          <p>{{ t('about.whyBody') }}</p>
        </article>

        <article class="about-card principles">
          <span class="about-icon">◈</span>
          <h2>{{ t('about.principlesTitle') }}</h2>
          <ul class="plist">
            <li v-for="k in principleKeys" :key="k">{{ t(k) }}</li>
          </ul>
        </article>

        <article class="about-card builder">
          <span class="about-icon">◇</span>
          <h2>{{ t('about.builderTitle') }}</h2>
          <p>{{ t('about.builderBody') }}</p>
        </article>
      </div>

      <div class="page-cta" data-reveal>
        <h2>{{ t('home.ctaTitle') }}</h2>
        <p>{{ t('home.ctaLead') }}</p>
        <div class="hero-actions">
          <NuxtLink class="btn btn-primary" to="/products">{{ t('about.browse') }}</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/contact">{{ t('about.contact') }}</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/">{{ t('about.home') }}</NuxtLink>
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

const principleKeys: MsgKey[] = ['about.p1', 'about.p2', 'about.p3', 'about.p4', 'about.p5']
</script>

<style scoped>
.about-wrap {
  max-width: 880px;
}

.about-visual {
  display: flex;
  justify-content: center;
  margin: 8px auto 28px;
  max-width: 280px;
  opacity: 0.95;
  filter: drop-shadow(0 0 40px rgba(167, 139, 250, 0.25));
}

.about-visual :deep(.orbit) {
  width: min(260px, 70vw);
  height: min(260px, 70vw);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 8px;
}

.about-card {
  padding: 24px 22px;
  border-radius: 16px;
  background: rgba(12, 14, 24, 0.72);
  border: 1px solid rgba(167, 139, 250, 0.14);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.3);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.about-card:hover {
  transform: translateY(-3px);
  border-color: rgba(167, 139, 250, 0.35);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), 0 0 28px rgba(167, 139, 250, 0.1);
}

.about-card.principles,
.about-card.builder {
  grid-column: 1 / -1;
}

.about-icon {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  margin-bottom: 12px;
  color: #c4b5fd;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.22);
  font-size: 0.95rem;
}

.about-card h2 {
  margin: 0 0 10px;
  font-size: 1.08rem;
  color: var(--text-heading);
}

.about-card p {
  margin: 0;
  line-height: 1.8;
  color: var(--text-muted);
  font-size: 0.94rem;
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
  padding-left: 18px;
  color: var(--text-muted);
  line-height: 1.65;
  font-size: 0.94rem;
}

.plist li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ring-gradient);
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.45);
}

@media (max-width: 700px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
