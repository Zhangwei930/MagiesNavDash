<template>
  <img
    v-if="src"
    class="product-logo"
    :class="{ fill }"
    :src="src"
    :alt="alt"
    :width="size"
    :height="size"
    :style="fill ? undefined : { width: sizePx, height: sizePx }"
    decoding="async"
  />
  <component
    v-else
    :is="fallback"
    :size="size"
    :stroke-width="strokeWidth"
  />
</template>

<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next'
import { toolIcon, toolLogo } from '~/utils/toolMeta'

const props = withDefaults(
  defineProps<{
    product?: { slug?: string; icon?: string; name?: string } | null
    /** Explicit slug when product object is unavailable. */
    slug?: string
    size?: number
    strokeWidth?: number
    /** Stretch logo to fill the parent icon square. */
    fill?: boolean
  }>(),
  {
    product: null,
    slug: '',
    size: 20,
    strokeWidth: 2,
    fill: false
  }
)

const src = computed(() => toolLogo(props.product || props.slug || null))
const fallback = computed<LucideIcon>(() =>
  toolIcon(props.product || (props.slug ? { slug: props.slug } : undefined))
)
const alt = computed(() => props.product?.name || props.slug || '')
const sizePx = computed(() => `${props.size}px`)
</script>

<style scoped>
.product-logo {
  display: block;
  object-fit: contain;
  border-radius: 20%;
  flex-shrink: 0;
}

.product-logo.fill {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}
</style>
