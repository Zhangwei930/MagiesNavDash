<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="group glass-strong relative overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
  >
    <div
      class="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-2xl transition group-hover:opacity-50"
      :style="{ background: product.accentColor || '#22d3ee' }"
    />
    <div class="relative">
      <div class="mb-5 flex items-start justify-between gap-3">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
          :style="{ background: `${product.accentColor || '#22d3ee'}22`, color: product.accentColor || '#22d3ee' }"
        >
          {{ product.icon || '✦' }}
        </div>
        <span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-400">
          Tool
        </span>
      </div>
      <h3 class="text-xl font-semibold text-white">{{ product.name }}</h3>
      <p class="mt-1 text-sm text-cyan-200/80">{{ product.tagline }}</p>
      <p class="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-400">{{ product.description }}</p>
      <div class="mt-6 flex items-center justify-between text-xs text-slate-500">
        <span>查看详情</span>
        <span class="text-cyan-300 transition group-hover:translate-x-1">→</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  product: {
    name: string
    slug: string
    tagline?: string
    description?: string
    icon?: string
    accentColor?: string
  }
}>()
</script>
