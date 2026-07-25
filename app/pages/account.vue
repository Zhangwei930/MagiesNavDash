<template>
  <div class="page-shell py-12 md:py-16">
    <div class="mb-10">
      <div class="section-kicker">Account Center</div>
      <h1 class="mt-3 text-4xl font-bold text-white">账号中心</h1>
      <p class="mt-2 text-slate-400">邮箱验证码登录 / 自动注册，JWT 会话，对接真实后端与邮件网关。</p>
    </div>

    <div v-if="auth.isLoggedIn" class="glass-strong max-w-3xl rounded-[2rem] p-8 md:p-10">
      <div class="flex items-center gap-4">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/15 text-3xl">✓</div>
        <div>
          <div class="text-2xl font-semibold text-white">欢迎，{{ auth.user?.displayName }}</div>
          <div class="text-sm text-emerald-300">{{ auth.user?.email }} · {{ auth.user?.role }}</div>
        </div>
      </div>
      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <div class="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div class="text-xs uppercase tracking-wider text-slate-500">会话</div>
          <div class="mt-2 text-sm text-slate-300">JWT 已保存在本机，刷新页面仍保持登录。</div>
        </div>
        <div class="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div class="text-xs uppercase tracking-wider text-slate-500">快捷入口</div>
          <div class="mt-3 flex flex-wrap gap-2">
            <NuxtLink to="/download" class="btn-ghost !py-2 text-xs">下载中心</NuxtLink>
            <NuxtLink v-if="auth.isAdmin" to="/admin" class="btn-ghost !py-2 text-xs">后台管理</NuxtLink>
          </div>
        </div>
      </div>
      <button class="btn-ghost mt-8" @click="auth.logout()">退出登录</button>
    </div>

    <div v-else class="mx-auto max-w-md">
      <div class="glass-strong rounded-[2rem] p-8 md:p-10">
        <h2 class="text-2xl font-semibold text-white">登录 / 注册</h2>
        <p class="mt-2 text-sm text-slate-400">输入邮箱获取验证码，验证通过即完成注册或登录。</p>

        <div class="mt-8 space-y-5">
          <div>
            <label class="mb-1.5 block text-xs text-slate-400">邮箱</label>
            <input v-model="auth.email" type="email" class="input-field" placeholder="you@company.com" />
          </div>
          <div>
            <label class="mb-1.5 block text-xs text-slate-400">验证码</label>
            <div class="flex gap-3">
              <input
                v-model="auth.code"
                type="text"
                maxlength="6"
                class="input-field font-mono tracking-[0.35em]"
                placeholder="6 位数字"
              />
              <button
                class="btn-ghost shrink-0 !px-4"
                :disabled="auth.loading || !auth.email"
                @click="auth.sendVerificationCode()"
              >
                {{ auth.codeSent ? '重新发送' : '发送验证码' }}
              </button>
            </div>
          </div>

          <button
            class="btn-primary w-full py-3.5"
            :disabled="auth.loading || auth.code.length !== 6"
            @click="auth.verifyCodeAndLogin()"
          >
            {{ auth.loading ? '处理中…' : '确认登录 / 注册' }}
          </button>

          <p v-if="auth.message" class="text-sm text-emerald-300">{{ auth.message }}</p>
          <p v-if="auth.error" class="text-sm text-rose-300">{{ auth.error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
</script>
