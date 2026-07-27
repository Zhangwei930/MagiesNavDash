<template>
  <div class="page">
    <div class="container legal">
      <NuxtLink to="/" class="back">← {{ t('legal.back') }}</NuxtLink>
      <h1 class="page-title">{{ t('privacy.title') }}</h1>
      <p class="page-desc">{{ t('privacy.updated') }}</p>

      <div class="card prose">
        <template v-if="locale === 'zh'">
          <h2>我们收集什么</h2>
          <p>为提供账号与服务，我们可能收集：邮箱地址、登录与验证码相关日志、下载记录（产品/版本/时间/大致网络环境）、你主动提交的反馈内容，以及必要的服务运行日志。</p>
          <h2>用途</h2>
          <p>用于身份验证、安全防护、下载与版本管理、产品改进、客户支持与法律合规。我们不会出售你的个人数据。</p>
          <h2>保存与第三方</h2>
          <p>数据保存在我们控制的服务器或受合同约束的基础设施中。邮件发送可能通过邮件网关/服务商完成。验证码在短时间内失效并尽量最小化存储。</p>
          <h2>你的权利</h2>
          <p>你可以申请访问、更正、注销账号或删除数据。请通过联系页或邮件 hello@magies.top 提出请求。法律法规要求保留的数据除外。</p>
          <h2>联系</h2>
          <p>隐私相关问题：hello@magies.top</p>
        </template>
        <template v-else>
          <h2>What we collect</h2>
          <p>To provide accounts and services we may collect: email, sign-in and verification logs, download records (product/version/time/network context), feedback you submit, and necessary operational logs.</p>
          <h2>How we use it</h2>
          <p>Authentication, security, download/release management, product improvement, support, and legal compliance. We do not sell personal data.</p>
          <h2>Storage & third parties</h2>
          <p>Data is stored on infrastructure we control or under contract. Email may be sent via a mail gateway/provider. Verification codes expire quickly and storage is minimized.</p>
          <h2>Your rights</h2>
          <p>You may request access, correction, account deletion, or data deletion via the contact page or hello@magies.top, except where law requires retention.</p>
          <h2>Contact</h2>
          <p>Privacy questions: hello@magies.top</p>
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
