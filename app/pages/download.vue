<template>
  <div class="page-shell py-12 md:py-16">
    <div class="mb-10 max-w-2xl">
      <div class="section-kicker">Download Center</div>
      <h1 class="mt-3 text-4xl font-bold text-white">下载中心</h1>
      <p class="mt-3 text-slate-400">
        展示各产品最新稳定版，点击后写入下载日志并返回签名信息。后端接口：`POST /api/downloads`。
      </p>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="glass h-28 animate-pulse rounded-3xl" />
    </div>
    <div v-else-if="error" class="glass-strong rounded-3xl p-10 text-center text-rose-300">{{ error }}</div>
    <div v-else class="space-y-4">
      <div
        v-for="item in items"
        :key="item.release.id"
        class="glass-strong flex flex-col gap-5 rounded-3xl p-6 md:flex-row md:items-center md:justify-between"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            :style="{ background: `${item.product?.accentColor || '#22d3ee'}22` }"
          >
            {{ item.product?.icon || '↓' }}
          </div>
          <div>
            <div class="text-xl font-semibold text-white">
              {{ item.product?.name || 'Product' }}
              <span class="text-cyan-300">v{{ item.release.version }}</span>
            </div>
            <div class="mt-1 text-sm text-slate-400">{{ item.release.changelog }}</div>
            <div class="mt-3 flex flex-wrap gap-2 text-[11px]">
              <span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                {{ item.release.channel }}
              </span>
              <span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-slate-400">
                {{ item.release.signature }}
              </span>
            </div>
          </div>
        </div>
        <button class="btn-primary shrink-0" @click="download(item)">立即下载</button>
      </div>
    </div>

    <p v-if="toast" class="mt-6 text-sm text-cyan-200">{{ toast }}</p>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true)
const error = ref('')
const toast = ref('')
const items = ref<any[]>([])

async function download(item: any) {
  toast.value = ''
  try {
    const { api } = useApi()
    const res = await api('/api/downloads', {
      method: 'POST',
      body: JSON.stringify({
        productId: item.product.id,
        releaseId: item.release.id
      })
    })
    toast.value = `${item.product.name} ${res.message}`
  } catch (e: any) {
    toast.value = e.message || '下载失败'
  }
}

onMounted(async () => {
  try {
    const { api } = useApi()
    const [products, releases] = await Promise.all([
      api<any[]>('/api/products'),
      api<any[]>('/api/releases/latest')
    ])
    const map = Object.fromEntries(products.map((p) => [p.id, p]))
    items.value = releases.map((r) => ({
      release: r,
      product: map[r.productId]
    }))
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>
