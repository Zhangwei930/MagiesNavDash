<template>
  <article class="card product-card-m">
    <div class="card-top">
      <div class="icon-circle" :style="{ color }">
        <component :is="icon" :size="20" :stroke-width="2" />
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
import { toolColor, toolIcon } from '~/utils/toolMeta'

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

const icon = computed(() => toolIcon(props.product))
const color = computed(() => toolColor(props.product))
</script>
