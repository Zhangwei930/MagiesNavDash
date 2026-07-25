<template>
  <div class="page-shell py-12 md:py-16">
    <div class="mb-10">
      <div class="section-kicker">Analytics</div>
      <h1 class="mt-3 text-4xl font-bold text-white">统计中心</h1>
      <p class="mt-2 text-slate-400">公开指标来自 `/api/stats/public`，随真实业务数据增长。</p>
    </div>

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="i in 4" :key="i" class="glass h-28 animate-pulse rounded-3xl" />
    </div>
    <div v-else-if="error" class="glass-strong rounded-3xl p-10 text-center text-rose-300">{{ error }}</div>
    <div v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="card in cards" :key="card.label" class="glass-strong rounded-3xl p-6">
          <div class="text-xs uppercase tracking-wider text-slate-500">{{ card.label }}</div>
          <div class="mt-3 text-4xl font-semibold text-white">{{ card.value }}</div>
          <div class="mt-2 text-xs text-cyan-300/80">{{ card.hint }}</div>
        </div>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <div class="glass-strong rounded-3xl p-6">
          <h2 class="text-lg font-semibold text-white">下载趋势（本会话示意）</h2>
          <div class="mt-6 flex h-48 items-end gap-3">
            <div
              v-for="(h, i) in bars"
              :key="i"
              class="flex-1 rounded-t-xl bg-gradient-to-t from-cyan-600/40 to-cyan-300/80"
              :style="{ height: h + '%' }"
            />
          </div>
        </div>
        <div class="glass-strong rounded-3xl p-6">
          <h2 class="text-lg font-semibold text-white">业务说明</h2>
          <ul class="mt-4 space-y-3 text-sm text-slate-400">
            <li>• 用户数：邮箱验证码注册成功后的 sys_user 计数</li>
            <li>• 下载量：product_download_log 累计写入</li>
            <li>• 邮件：mail_log 中 SENT / FALLBACK 状态合计</li>
            <li>• 后续可接入 ECharts 与按日聚合查询</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true)
const error = ref('')
const stats = ref<any>({})

const cards = computed(() => [
  { label: '注册用户', value: stats.value.users ?? 0, hint: 'sys_user' },
  { label: '产品数', value: stats.value.products ?? 0, hint: 'product' },
  { label: '累计下载', value: stats.value.downloadsTotal ?? 0, hint: 'download_log' },
  { label: '邮件发送', value: stats.value.mailSent ?? 0, hint: 'mail_log' }
])

const bars = computed(() => {
  const base = Number(stats.value.downloadsTotal || 4)
  return [30, 45, 38, 62, 55, 70, Math.min(95, 40 + base * 3)].map((n) => Math.max(18, n))
})

onMounted(async () => {
  try {
    const { api } = useApi()
    stats.value = await api('/api/stats/public')
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>
