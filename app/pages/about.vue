<template>
  <div class="page">
    <div class="container" style="max-width:640px">
      <h1 class="page-title">{{ t('about.title') }}</h1>
      <p class="page-desc">{{ t('about.desc') }}</p>

      <div class="card" style="margin-bottom:16px">
        <p style="margin:0;line-height:1.8;color:var(--text-muted)">
          {{ t('about.body') }}
        </p>
      </div>

      <div class="hero-actions" style="justify-content:flex-start">
        <NuxtLink class="btn btn-primary" to="/products">{{ t('about.browse') }}</NuxtLink>
        <NuxtLink class="btn btn-outline" to="/">{{ t('about.home') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
