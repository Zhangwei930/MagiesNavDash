<template>
  <div class="page">
    <div class="container" style="max-width:720px">
      <h1 class="page-title">{{ t('contact.title') }}</h1>
      <p class="page-desc">{{ t('contact.desc') }}</p>

      <div class="grid grid-1 contact-grid">
        <div class="card">
          <h3>{{ t('contact.product') }}</h3>
          <p>{{ t('contact.productBody') }}</p>
          <NuxtLink class="btn btn-outline btn-sm" to="/account">{{ t('contact.gotoAccount') }}</NuxtLink>
        </div>
        <div class="card">
          <h3>{{ t('contact.biz') }}</h3>
          <p>{{ t('contact.bizBody') }}</p>
          <a class="btn btn-outline btn-sm" href="mailto:hello@magies.top">
            {{ t('contact.email') }}: hello@magies.top
          </a>
        </div>
        <div class="card">
          <h3>{{ t('contact.security') }}</h3>
          <p>{{ t('contact.securityBody') }}</p>
          <NuxtLink class="btn btn-outline btn-sm" to="/security">{{ t('contact.gotoSecurity') }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
.contact-grid {
  margin-top: 24px;
  display: grid;
  gap: 14px;
}

.card h3 {
  margin: 0 0 8px;
}

.card p {
  margin: 0 0 14px;
  line-height: 1.7;
  color: var(--text-muted);
  font-size: 0.92rem;
}
</style>
