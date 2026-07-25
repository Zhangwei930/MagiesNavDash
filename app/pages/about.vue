<template>
  <div class="page">
    <div class="container" style="max-width:720px">
      <h1 class="page-title">{{ t('about.title') }}</h1>
      <p class="page-desc">{{ t('about.desc') }}</p>

      <div class="card block">
        <h2>{{ t('about.whatTitle') }}</h2>
        <p>{{ t('about.whatBody') }}</p>
      </div>

      <div class="card block">
        <h2>{{ t('about.whyTitle') }}</h2>
        <p>{{ t('about.whyBody') }}</p>
      </div>

      <div class="card block">
        <h2>{{ t('about.principlesTitle') }}</h2>
        <ul class="plist">
          <li>{{ t('about.p1') }}</li>
          <li>{{ t('about.p2') }}</li>
          <li>{{ t('about.p3') }}</li>
          <li>{{ t('about.p4') }}</li>
          <li>{{ t('about.p5') }}</li>
        </ul>
      </div>

      <div class="card block">
        <h2>{{ t('about.builderTitle') }}</h2>
        <p>{{ t('about.builderBody') }}</p>
      </div>

      <div class="hero-actions" style="justify-content:flex-start">
        <NuxtLink class="btn btn-primary" to="/products">{{ t('about.browse') }}</NuxtLink>
        <NuxtLink class="btn btn-outline" to="/contact">{{ t('about.contact') }}</NuxtLink>
        <NuxtLink class="btn btn-outline" to="/">{{ t('about.home') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
.block {
  margin-bottom: 14px;
}

.block h2 {
  margin: 0 0 10px;
  font-size: 1.05rem;
  color: var(--text-heading);
}

.block p {
  margin: 0;
  line-height: 1.8;
  color: var(--text-muted);
}

.plist {
  margin: 0;
  padding-left: 1.15em;
  color: var(--text-muted);
  line-height: 1.85;
}
</style>
