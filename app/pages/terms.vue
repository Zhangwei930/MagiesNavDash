<template>
  <div class="page">
    <div class="container legal">
      <NuxtLink to="/" class="back">← {{ t('legal.back') }}</NuxtLink>
      <h1 class="page-title">{{ t('terms.title') }}</h1>

      <div class="card prose">
        <template v-if="locale === 'zh'">
          <h2>服务说明</h2>
          <p>Magies 提供软件产品官网、账号、下载与相关在线服务。部分产品为独立站点或客户端，适用各自许可与说明。</p>
          <h2>账号</h2>
          <p>你应对账号下的活动负责，不得滥用验证码、干扰服务或尝试未授权访问。我们可在滥用或风险情况下限制或终止账号。</p>
          <h2>软件与下载</h2>
          <p>客户端软件按所附许可或产品页说明提供，下载中心提供的为正式版。企业版如需另行授权以产品说明为准。你不得对安装包进行恶意篡改后重新分发。</p>
          <h2>免责</h2>
          <p>在法律允许范围内，服务按「现状」提供。实验项目与开发中产品不承诺稳定性或持续提供。</p>
          <h2>变更</h2>
          <p>我们可能更新本协议。重大变更将在网站上提示。继续使用即表示接受更新后的条款。</p>
        </template>
        <template v-else>
          <h2>Service</h2>
          <p>Magies provides the product site, accounts, downloads, and related online services. Some products are separate sites or clients with their own licenses.</p>
          <h2>Accounts</h2>
          <p>You are responsible for activity under your account. Do not abuse verification codes, disrupt the service, or attempt unauthorized access. We may restrict or terminate accounts for abuse or risk.</p>
          <h2>Software & downloads</h2>
          <p>Client software is provided under its license or product page terms. Downloads from this site are official releases. Enterprise licensing, where applicable, follows the product terms. Do not redistribute tampered packages.</p>
          <h2>Disclaimer</h2>
          <p>To the extent permitted by law, services are provided “as is.” Experimental and in-development products make no stability guarantees.</p>
          <h2>Changes</h2>
          <p>We may update these terms. Material changes will be noted on the site. Continued use means you accept the updated terms.</p>
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
