<template>
  <div class="page">
    <div class="container" style="max-width:720px">
      <h1 class="page-title">{{ t('changelog.title') }}</h1>
      <p class="page-desc">{{ t('changelog.desc') }}</p>

      <div class="card">
        <p style="margin:0 0 16px;line-height:1.75;color:var(--text-muted)">
          {{ t('changelog.empty') }}
        </p>
        <NuxtLink class="btn btn-primary" to="/download">{{ t('changelog.gotoDownload') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
