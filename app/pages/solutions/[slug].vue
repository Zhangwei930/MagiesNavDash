<template>
  <div class="page">
    <div class="container" style="max-width:720px">
      <NuxtLink to="/solutions" class="back">← {{ t('solutions.title') }}</NuxtLink>

      <div v-if="!solution" class="err">Not found</div>
      <template v-else>
        <h1 class="page-title">{{ t(`solutions.${solution.slug}.title` as any) }}</h1>
        <p class="page-desc accent">{{ t(`solutions.${solution.slug}.problem` as any) }}</p>
        <div class="card" style="margin-bottom:20px">
          <p style="margin:0;line-height:1.8;color:var(--text-muted)">
            {{ t(`solutions.${solution.slug}.body` as any) }}
          </p>
        </div>

        <h2 class="sub">{{ t('solutions.products') }}</h2>
        <ul class="plist">
          <li v-for="p in solution.products" :key="p">{{ p }}</li>
        </ul>

        <div class="hero-actions" style="justify-content:flex-start;margin-top:28px">
          <a
            class="btn btn-primary"
            :href="solution.primaryHref"
            :target="solution.primaryHref.startsWith('http') ? '_blank' : undefined"
            :rel="solution.primaryHref.startsWith('http') ? 'noopener' : undefined"
            @click="onPrimary($event)"
          >{{ actionLabel }}</a>
          <NuxtLink class="btn btn-outline" to="/products">{{ t('footer.allProducts') }}</NuxtLink>
          <NuxtLink class="btn btn-outline" to="/contact">{{ t('footer.contact') }}</NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSolution } from '~/utils/solutions'

const { t } = useI18n()
const route = useRoute()
const solution = computed(() => getSolution(String(route.params.slug)))

const actionLabel = computed(() => {
  const a = solution.value?.primaryAction
  if (a === 'download') return t('action.download')
  if (a === 'use') return t('action.use')
  if (a === 'preview') return t('action.preview')
  if (a === 'contact') return t('action.contact')
  return t('action.learn')
})

function onPrimary(e: Event) {
  const href = solution.value?.primaryHref
  if (href && !href.startsWith('http')) {
    e.preventDefault()
    navigateTo(href)
  }
}
</script>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 0.88rem;
  color: var(--text-muted);
  text-decoration: none;
}

.back:hover {
  color: var(--accent-hover);
}

.page-desc.accent {
  color: var(--accent-hover);
  font-weight: 550;
}

.sub {
  margin: 0 0 12px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.plist {
  margin: 0;
  padding-left: 1.2em;
  color: var(--text);
  line-height: 1.9;
}
</style>
