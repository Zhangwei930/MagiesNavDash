<template>
  <div ref="root" class="page account-page">
    <div class="container account-wrap">
      <PageHero
        :eyebrow="t('nav.account')"
        :title="t('account.title')"
        :desc="t('account.desc')"
        narrow
      />

      <div class="account-card" data-reveal>
        <p class="why">{{ t('account.closed') }}</p>
        <div class="account-actions">
          <NuxtLink to="/download" class="btn btn-primary">{{ t('nav.download') }}</NuxtLink>
          <NuxtLink to="/contact" class="btn btn-secondary">{{ t('footer.contact') }}</NuxtLink>
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
.account-wrap {
  max-width: 460px;
}

.account-card {
  margin-top: 8px;
  padding: 24px;
  border-radius: 18px;
  background: rgba(12, 14, 24, 0.78);
  border: 1px solid rgba(167, 139, 250, 0.18);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.35),
    0 0 40px rgba(167, 139, 250, 0.08);
  backdrop-filter: blur(14px);
}

.why {
  margin: 0 0 18px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(167, 139, 250, 0.16);
  background: rgba(167, 139, 250, 0.06);
  font-size: 0.86rem;
  line-height: 1.65;
  color: var(--text-muted);
}

.account-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
