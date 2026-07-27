<template>
  <div class="page">
    <div class="container legal">
      <NuxtLink to="/" class="back">← {{ t('legal.back') }}</NuxtLink>
      <h1 class="page-title">{{ t('security.title') }}</h1>

      <div class="card prose">
        <template v-if="locale === 'zh'">
          <h2>安全实践</h2>
          <p>我们采用验证码限流、最小权限后台、HTTPS 传输、下载记录与可下架的发布流程等措施降低风险。密钥与凭据仅保存在服务端环境中，不进入前端或公开仓库。</p>
          <h2>产品数据边界</h2>
          <p>Magies Terminal 等客户端产品不应向我们上传你的服务器密码或不必要的连接机密。官网账号体系与远程主机凭据相互分离。</p>
          <h2>漏洞报告</h2>
          <p>如发现安全问题，请邮件联系 security@magies.top（若不可达则使用 hello@magies.top），并给予合理披露时间。请勿在公开渠道提前公开利用细节。</p>
          <h2>严重版本处理</h2>
          <p>当发布版本出现严重漏洞时，我们会尽快停止分发受影响资产，并在可行时发布安全说明与修复版本。</p>
        </template>
        <template v-else>
          <h2>Practices</h2>
          <p>We use verification rate limits, least-privilege admin access, HTTPS, download logging, and pullable releases. Secrets live only in server-side configuration — never in frontend or public repos.</p>
          <h2>Product data boundaries</h2>
          <p>Clients such as Magies Terminal should not upload your server passwords or unnecessary connection secrets to us. Site accounts are separate from host credentials.</p>
          <h2>Vulnerability reporting</h2>
          <p>Email security@magies.top (or hello@magies.top if unreachable) and allow reasonable time for a fix. Do not disclose exploit details publicly first.</p>
          <h2>Critical releases</h2>
          <p>If a severe issue is found, we will stop distributing affected assets as soon as practical and publish a security note with a fixed build when available.</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
</script>

<style scoped>
.legal { max-width: 720px; }
.back {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 0.88rem;
  color: var(--text-muted);
}
.back:hover { color: var(--accent-hover); }
.prose h2 {
  margin: 18px 0 8px;
  font-size: 1rem;
  color: var(--text-heading);
}
.prose h2:first-child { margin-top: 0; }
.prose p {
  margin: 0 0 8px;
  line-height: 1.8;
  color: var(--text-muted);
  font-size: 0.92rem;
}
</style>
