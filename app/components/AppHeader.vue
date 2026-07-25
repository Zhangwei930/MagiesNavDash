<template>
  <header class="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
    <div class="page-shell flex h-16 items-center justify-between gap-4">
      <NuxtLink to="/" class="group flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20">
          M
        </div>
        <div class="leading-tight">
          <div class="text-sm font-semibold tracking-wide text-white group-hover:text-cyan-200">Magies Hub</div>
          <div class="text-[10px] uppercase tracking-[0.2em] text-slate-500">Enterprise</div>
        </div>
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="item in links"
          :key="item.to"
          :to="item.to"
          class="rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          active-class="!bg-white/10 !text-cyan-200"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <NuxtLink
          v-if="auth.isLoggedIn"
          to="/account"
          class="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 sm:inline-flex"
        >
          {{ auth.user?.displayName || auth.user?.email }}
        </NuxtLink>
        <NuxtLink v-else to="/account" class="btn-ghost !px-4 !py-2 text-xs">登录</NuxtLink>
        <NuxtLink to="/download" class="btn-primary !px-4 !py-2 text-xs">获取工具</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const links = [
  { to: '/', label: '首页' },
  { to: '/products', label: '工具站' },
  { to: '/download', label: '下载' },
  { to: '/account', label: '账号' },
  { to: '/admin', label: '后台' },
  { to: '/stats', label: '统计' }
]
</script>
