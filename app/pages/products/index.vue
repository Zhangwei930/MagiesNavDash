<template>
  <div class="page-shell py-12 md:py-16">
    <div class="mb-10 max-w-2xl">
      <div class="section-kicker">Tool Station</div>
      <h1 class="mt-3 text-4xl font-bold text-white">工具站</h1>
      <p class="mt-3 text-slate-400">
        Magies 产品生态的统一陈列：导航门户、人事平台、游戏中台与 Hub 本体。数据来自 Spring Boot `/api/products`。
      </p>
    </div>

    <div v-if="loading" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="i in 6" :key="i" class="glass h-56 animate-pulse rounded-3xl" />
    </div>
    <div v-else-if="error" class="glass-strong rounded-3xl p-10 text-center text-rose-300">{{ error }}</div>
    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
const products = ref<any[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const { api } = useApi()
    products.value = await api('/api/products')
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>
