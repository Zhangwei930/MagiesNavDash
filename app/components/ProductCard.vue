<template>
  <article class="card product-card-m">
    <div class="card-top">
      <div
        class="icon-circle"
        :style="{ color }"
        :data-logo="logo ? '' : null"
      >
        <ProductIcon :product="product" :size="logo ? 48 : 20" :fill="!!logo" />
      </div>
      <div>
        <h3>{{ product.name }}</h3>
        <div class="tag">{{ product.tagline || product.description || product.slug }}</div>
      </div>
    </div>
    <div class="actions">
      <a
        v-if="product.homepageUrl"
        class="btn btn-primary btn-sm"
        :href="product.homepageUrl"
        target="_blank"
        rel="noopener"
      >{{ t('products.open') }}</a>
      <NuxtLink class="btn btn-outline btn-sm" :to="`/products/${product.slug}`">{{ t('products.detail') }}</NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { toolColor, toolLogo } from '~/utils/toolMeta'

const { t } = useI18n()

const props = defineProps<{
  product: {
    name: string
    slug: string
    tagline?: string
    description?: string
    homepageUrl?: string
    accentColor?: string
    icon?: string
  }
}>()

const logo = computed(() => toolLogo(props.product))
const color = computed(() => toolColor(props.product))
</script>

<style scoped>
.icon-circle[data-logo] {
  width: 48px;
  height: 48px;
  padding: 0;
  overflow: hidden;
  border-radius: 12px;
  background: transparent;
  box-shadow: none;
}

.icon-circle[data-logo] :deep(.product-logo) {
  width: 100% !important;
  height: 100% !important;
  border-radius: 12px;
  object-fit: cover;
}
</style>
