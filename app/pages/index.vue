<template>
  <div>
    <!-- Hero -->
    <section class="page-shell relative overflow-hidden pb-16 pt-16 md:pb-24 md:pt-24">
      <div class="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div class="relative mx-auto max-w-4xl text-center">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs text-cyan-200">
          <span class="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
          Magies Hub Enterprise · 工具生态门户
        </div>
        <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl sm:leading-[1.08]">
          统一产品门户
          <span class="text-gradient block mt-2">一站管理工具与账号</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          把官网、工具站、账号中心、签名下载、后台与邮件中心收敛到同一入口。
          面向 Magies Nav / HRP / Game 等产品线，打造可扩展的企业级门户。
        </p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/products" class="btn-primary px-8 py-3.5 text-base">进入工具站</NuxtLink>
          <NuxtLink to="/account" class="btn-ghost px-8 py-3.5 text-base">邮箱验证码登录</NuxtLink>
        </div>
        <div class="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div v-for="item in highlights" :key="item.label" class="glass rounded-2xl px-4 py-4">
            <div class="text-2xl font-semibold text-white">{{ item.value }}</div>
            <div class="mt-1 text-xs text-slate-400">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools -->
    <section class="page-shell pb-20">
      <div class="mb-8 flex items-end justify-between gap-4">
        <div>
          <div class="section-kicker">Tools</div>
          <h2 class="mt-2 text-3xl font-semibold text-white">工具站</h2>
          <p class="mt-2 text-sm text-slate-400">从真实后端加载产品目录，覆盖导航、人事、游戏与门户本身。</p>
        </div>
        <NuxtLink to="/products" class="btn-ghost !py-2 text-xs">全部产品</NuxtLink>
      </div>

      <div v-if="loading" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div v-for="i in 4" :key="i" class="glass h-56 animate-pulse rounded-3xl" />
      </div>
      <div v-else-if="error" class="glass-strong rounded-3xl p-8 text-center text-sm text-rose-300">
        {{ error }}
        <div class="mt-3 text-xs text-slate-500">请确认后端 API 已启动（/api/products）</div>
      </div>
      <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- Flow -->
    <section class="page-shell pb-20">
      <div class="glass-strong overflow-hidden rounded-[2rem]">
        <div class="grid lg:grid-cols-2">
          <div class="border-b border-white/5 p-8 md:p-10 lg:border-b-0 lg:border-r">
            <div class="section-kicker">Account Flow</div>
            <h3 class="mt-3 text-2xl font-semibold text-white">真实账号注册链路</h3>
            <ol class="mt-6 space-y-4 text-sm text-slate-300">
              <li v-for="(step, idx) in flow" :key="step" class="flex gap-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-xs font-semibold text-cyan-200">
                  {{ idx + 1 }}
                </span>
                <span class="pt-1">{{ step }}</span>
              </li>
            </ol>
            <NuxtLink to="/account" class="btn-primary mt-8">打开账号中心</NuxtLink>
          </div>
          <div class="bg-gradient-to-br from-slate-900/80 to-cyan-950/20 p-8 md:p-10">
            <div class="section-kicker">Mail Center</div>
            <h3 class="mt-3 text-2xl font-semibold text-white">邮件中心</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-400">
              Spring Boot 生成验证码并写入 Redis（TTL 5 分钟），再调用 Mail Gateway 发送；
              本站不直连 SMTP，符合方案中的解耦设计。
            </p>
            <div class="mt-6 rounded-2xl border border-dashed border-cyan-400/20 bg-slate-950/50 p-5 font-mono text-xs leading-7 text-slate-300">
              【Magies Hub】您的验证码是：••••••<br />
              有效期：5 分钟<br />
              如非本人操作，请忽略此邮件。
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Download CTA -->
    <section class="page-shell pb-24">
      <div class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-8 md:p-12">
        <div class="absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
        <div class="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div class="section-kicker">Download</div>
            <h3 class="mt-2 text-3xl font-semibold text-white">签名下载中心</h3>
            <p class="mt-2 max-w-xl text-sm text-slate-400">多产品最新版本、签名文件与下载统计，一站获取。</p>
          </div>
          <NuxtLink to="/download" class="btn-primary px-8 py-3.5">前往下载</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const products = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const stats = ref<any>({})

const highlights = computed(() => [
  { label: '上线工具', value: products.value.length || '—' },
  { label: '注册用户', value: stats.value.users ?? '—' },
  { label: '累计下载', value: stats.value.downloadsTotal ?? '—' },
  { label: '邮件发送', value: stats.value.mailSent ?? '—' }
])

const flow = [
  '用户输入邮箱',
  '后端生成 6 位验证码并写入 Redis（5 分钟）',
  '调用 Mail Gateway 发送验证码邮件',
  '校验通过后签发 JWT，完成登录 / 注册'
]

onMounted(async () => {
  const { api } = useApi()
  try {
    const [list, publicStats] = await Promise.all([
      api<any[]>('/api/products'),
      api<any>('/api/stats/public').catch(() => ({}))
    ])
    products.value = list
    stats.value = publicStats
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>
