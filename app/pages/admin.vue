<template>
  <div class="page-shell py-12 md:py-16">
    <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div class="section-kicker">Admin Console</div>
        <h1 class="mt-3 text-4xl font-bold text-white">后台管理</h1>
        <p class="mt-2 text-slate-400">产品、用户、邮件日志与反馈。需 ADMIN 角色 JWT。</p>
      </div>
      <button class="btn-ghost" :disabled="loading" @click="load">刷新数据</button>
    </div>

    <div v-if="!auth.isLoggedIn" class="glass-strong rounded-3xl p-10 text-center">
      <p class="text-slate-300">请先登录后再访问后台。</p>
      <NuxtLink to="/account" class="btn-primary mt-6 inline-flex">去登录</NuxtLink>
    </div>

    <div v-else-if="auth.user?.role !== 'ADMIN'" class="glass-strong rounded-3xl p-10 text-center">
      <p class="text-amber-200">当前账号不是管理员（需要 role = ADMIN）。</p>
      <p class="mt-2 text-sm text-slate-400">种子管理员：admin@magies.top（发送验证码后登录）</p>
    </div>

    <div v-else-if="error" class="glass-strong rounded-3xl p-10 text-center text-rose-300">{{ error }}</div>

    <div v-else class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="card in cards" :key="card.label" class="glass-strong rounded-3xl p-5">
          <div class="text-xs uppercase tracking-wider text-slate-500">{{ card.label }}</div>
          <div class="mt-2 text-3xl font-semibold text-white">{{ card.value }}</div>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <div class="glass-strong rounded-3xl p-6">
          <h2 class="text-lg font-semibold text-white">产品列表</h2>
          <div class="mt-4 space-y-3">
            <div
              v-for="p in data?.products || []"
              :key="p.id"
              class="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3"
            >
              <div>
                <div class="font-medium text-white">{{ p.icon }} {{ p.name }}</div>
                <div class="text-xs text-slate-500">{{ p.slug }} · {{ p.status }}</div>
              </div>
              <NuxtLink :to="`/products/${p.slug}`" class="text-xs text-cyan-300">查看</NuxtLink>
            </div>
          </div>
        </div>

        <div class="glass-strong rounded-3xl p-6">
          <h2 class="text-lg font-semibold text-white">用户</h2>
          <div class="mt-4 space-y-3">
            <div
              v-for="u in data?.recentUsers || []"
              :key="u.id"
              class="rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm"
            >
              <div class="font-medium text-white">{{ u.email }}</div>
              <div class="text-xs text-slate-500">{{ u.role }} · {{ u.status }}</div>
            </div>
            <div v-if="!(data?.recentUsers || []).length" class="text-sm text-slate-500">暂无用户数据</div>
          </div>
        </div>

        <div class="glass-strong rounded-3xl p-6 xl:col-span-2">
          <h2 class="text-lg font-semibold text-white">邮件发送日志</h2>
          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th class="px-3 py-2">时间</th>
                  <th class="px-3 py-2">邮箱</th>
                  <th class="px-3 py-2">类型</th>
                  <th class="px-3 py-2">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in data?.mailLogs || []" :key="m.id" class="border-t border-white/5 text-slate-300">
                  <td class="px-3 py-2 font-mono text-xs">{{ formatTime(m.createdAt) }}</td>
                  <td class="px-3 py-2">{{ m.email }}</td>
                  <td class="px-3 py-2">{{ m.mailType }}</td>
                  <td class="px-3 py-2">
                    <span
                      class="rounded-full px-2 py-0.5 text-xs"
                      :class="m.status === 'SENT' || m.status === 'FALLBACK' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-300'"
                    >{{ m.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="!(data?.mailLogs || []).length" class="py-6 text-sm text-slate-500">暂无邮件日志</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const data = ref<any>(null)
const loading = ref(false)
const error = ref('')

const cards = computed(() => {
  const s = data.value?.stats || {}
  return [
    { label: '用户', value: s.users ?? '—' },
    { label: '产品', value: s.products ?? '—' },
    { label: '今日下载', value: s.downloadsToday ?? '—' },
    { label: '邮件发送', value: s.mailSent ?? '—' }
  ]
})

function formatTime(v?: string) {
  if (!v) return '—'
  return new Date(v).toLocaleString('zh-CN')
}

async function load() {
  if (!auth.isLoggedIn || auth.user?.role !== 'ADMIN') return
  loading.value = true
  error.value = ''
  try {
    const { api } = useApi()
    data.value = await api('/api/admin/dashboard')
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => auth.token, load)
</script>
