<template>
  <article class="card product-card-m">
    <div class="card-top">
      <div
        class="icon-circle"
        :style="{ color }"
        :data-logo="logo ? '' : null"
        :data-logo-lg="logo && logoSize > 32 ? '' : null"
      >
        <ProductIcon :product="product" :size="logo ? logoSize : 20" />
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
      >打开</a>
      <NuxtLink class="btn btn-outline btn-sm" :to="`/products/${product.slug}`">详情</NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { toolColor, toolLogo, toolLogoDisplaySize } from '~/utils/toolMeta'

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
const logoSize = computed(() => toolLogoDisplaySize(props.product, 'list'))
const color = computed(() => toolColor(props.product))
</script>
