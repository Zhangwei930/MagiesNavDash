<template>
  <footer class="mt-20 border-t border-white/5 bg-slate-950/80">
    <div class="page-shell grid gap-8 py-12 md:grid-cols-3">
      <div>
        <div class="mb-3 flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">M</div>
          <span class="font-semibold text-white">Magies Hub</span>
        </div>
        <p class="text-sm leading-relaxed text-slate-400">
          统一产品官网、工具站、账号、下载、后台与邮件中心。面向 Magies 生态的企业级门户。
        </p>
      </div>
      <div>
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">能力模块</div>
        <ul class="space-y-2 text-sm text-slate-400">
          <li>产品中心 / 工具站</li>
          <li>统一账号与验证码登录</li>
          <li>签名下载与版本发布</li>
          <li>后台管理与运营统计</li>
        </ul>
      </div>
      <div>
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">域名</div>
        <ul class="space-y-2 font-mono text-xs text-slate-400">
          <li>dash.magies.top</li>
          <li>api.magies.top</li>
          <li>mail.magies.top</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/5 py-5 text-center text-xs text-slate-500">
      © {{ year }} Magies Hub Enterprise. 保留所有权利。
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
