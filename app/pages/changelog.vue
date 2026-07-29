<template>
  <div ref="root" class="page changelog-page">
    <div class="container changelog-wrap">
      <PageHero
        :eyebrow="t('changelog.title')"
        :title="t('changelog.title')"
        :desc="t('changelog.desc')"
        narrow
      />

      <div class="changelog-card" data-reveal>
        <div class="empty-visual" aria-hidden="true">
          <span class="ring" />
          <span class="dot" />
        </div>
        <p>{{ t('changelog.empty') }}</p>
        <div class="hero-actions">
          <NuxtLink class="btn btn-primary" to="/download">{{ t('changelog.gotoDownload') }}</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/roadmap">{{ t('nav.roadmap') }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<style scoped>
.changelog-wrap {
  max-width: 720px;
}

.changelog-card {
  margin-top: 12px;
  padding: 36px 28px;
  border-radius: 20px;
  text-align: center;
  background: rgba(12, 14, 24, 0.72);
  border: 1px solid rgba(167, 139, 250, 0.16);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
}

.empty-visual {
  position: relative;
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid transparent;
  background:
    linear-gradient(rgba(12, 14, 24, 0.9), rgba(12, 14, 24, 0.9)) padding-box,
    var(--ring-gradient) border-box;
  animation: spin 12s linear infinite;
}

.dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #fff, #c4b5fd 55%, #a78bfa);
  box-shadow: 0 0 18px rgba(167, 139, 250, 0.7);
}

.changelog-card p {
  margin: 0 0 20px;
  line-height: 1.75;
  color: var(--text-muted);
  max-width: 42ch;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  justify-content: center;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ring {
    animation: none;
  }
}
</style>
