<template>
  <div class="page">
    <div class="container">
      <h1 class="page-title">{{ t('solutions.title') }}</h1>
      <p class="page-desc">{{ t('solutions.desc') }}</p>

      <div class="grid grid-2 sol-grid">
        <NuxtLink
          v-for="s in SOLUTIONS"
          :key="s.slug"
          class="card sol-card"
          :to="`/solutions/${s.slug}`"
        >
          <h3>{{ t(`solutions.${s.slug}.title` as any) }}</h3>
          <p class="sol-problem">{{ t(`solutions.${s.slug}.problem` as any) }}</p>
          <p class="sol-body">{{ t(`solutions.${s.slug}.body` as any) }}</p>
          <div class="sol-products">
            <span class="sol-label">{{ t('solutions.products') }}</span>
            <span v-for="p in s.products" :key="p" class="sol-chip">{{ p }}</span>
          </div>
          <span class="card-link">{{ t('action.learn') }} →</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SOLUTIONS } from '~/utils/solutions'

const { t } = useI18n()
</script>

<style scoped>
.sol-grid {
  margin-top: 28px;
}

.sol-card {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sol-problem {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--accent-hover);
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
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 0.75rem;
  color: var(--text);
}
</style>
