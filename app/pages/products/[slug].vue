<template>
  <div class="page-shell py-12 md:py-16">
    <div v-if="loading" class="glass-strong h-80 animate-pulse rounded-[2rem]" />
    <div v-else-if="error" class="glass-strong rounded-[2rem] p-10 text-center text-rose-300">{{ error }}</div>
    <div v-else-if="detail" class="space-y-8">
      <div class="glass-strong relative overflow-hidden rounded-[2rem] p-8 md:p-10">
        <div
          class="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
          :style="{ background: detail.product.accentColor }"
        />
        <div class="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div class="flex gap-5">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
              :style="{ background: `${detail.product.accentColor}22` }"
            >
              {{ detail.product.icon }}
            </div>
            <div>
              <div class="section-kicker">Product</div>
              <h1 class="mt-2 text-4xl font-bold text-white">{{ detail.product.name }}</h1>
              <p class="mt-2 text-cyan-200/90">{{ detail.product.tagline }}</p>
              <p class="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">{{ detail.product.description }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <a
              v-if="detail.product.homepageUrl"
              :href="detail.product.homepageUrl"
              target="_blank"
              rel="noopener"
              class="btn-ghost"
            >打开站点</a>
            <button class="btn-primary" @click="download">签名下载</button>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="glass-strong rounded-3xl p-6 lg:col-span-2">
          <h2 class="text-lg font-semibold text-white">核心能力</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div
              v-for="f in detail.features"
              :key="f.id"
              class="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
            >
              <div class="font-medium text-white">{{ f.title }}</div>
              <div class="mt-1 text-sm text-slate-400">{{ f.description }}</div>
            </div>
          </div>
        </div>

        <div class="glass-strong rounded-3xl p-6">
          <h2 class="text-lg font-semibold text-white">最新版本</h2>
          <div v-if="detail.latestRelease" class="mt-4 space-y-3 text-sm">
            <div class="text-3xl font-semibold text-cyan-200">v{{ detail.latestRelease.version }}</div>
            <div class="text-slate-400">{{ detail.latestRelease.changelog }}</div>
            <div class="rounded-xl bg-slate-950/60 p-3 font-mono text-[11px] text-slate-400 break-all">
              {{ detail.latestRelease.signature }}
            </div>
            <div class="text-xs text-slate-500">
              {{ formatSize(detail.latestRelease.fileSize) }} · {{ detail.latestRelease.platform }}
            </div>
          </div>
          <div v-else class="mt-4 text-sm text-slate-500">暂无发布版本</div>
        </div>
      </div>

      <div class="glass-strong rounded-3xl p-6">
        <h2 class="mb-4 text-lg font-semibold text-white">版本历史</h2>
        <div class="space-y-3">
          <div
            v-for="r in detail.releases"
            :key="r.id"
            class="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div class="font-medium text-white">v{{ r.version }} <span class="text-xs text-slate-500">{{ r.channel }}</span></div>
              <div class="text-sm text-slate-400">{{ r.changelog }}</div>
            </div>
            <button class="btn-ghost !py-2 text-xs" @click="download(r.id)">下载</button>
          </div>
        </div>
      </div>

      <p v-if="downloadMsg" class="text-sm text-cyan-200">{{ downloadMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const detail = ref<any>(null)
const loading = ref(true)
const error = ref('')
const downloadMsg = ref('')

function formatSize(bytes?: number) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function download(releaseId?: number) {
  if (!detail.value) return
  downloadMsg.value = ''
  try {
    const { api } = useApi()
    const res = await api('/api/downloads', {
      method: 'POST',
      body: JSON.stringify({
        productId: detail.value.product.id,
        releaseId: releaseId || detail.value.latestRelease?.id
      })
    })
    downloadMsg.value = `${res.message} · 签名 ${res.signature || '—'}`
  } catch (e: any) {
    downloadMsg.value = e.message || '下载失败'
  }
}

onMounted(async () => {
  try {
    const { api } = useApi()
    detail.value = await api(`/api/products/${route.params.slug}`)
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>
