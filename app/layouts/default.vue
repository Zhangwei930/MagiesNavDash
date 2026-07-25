<template>
  <div class="hub">
    <nav class="navbar">
      <div class="container navbar-inner">
        <NuxtLink to="/" class="nav-brand" @click="menuOpen = false">
          <BrandLogo size="nav" :show-wordmark="true" />
        </NuxtLink>

        <div class="nav-actions">
          <button type="button" class="lang-switch" :title="t('nav.lang')" @click="toggleLocale">
            {{ t('nav.lang') }}
          </button>
          <NuxtLink
            v-if="auth.isLoggedIn"
            to="/account"
            class="btn btn-outline btn-sm"
            style="height:36px"
          >{{ auth.user?.email?.split('@')[0] }}</NuxtLink>
          <NuxtLink v-else to="/account" class="btn btn-primary btn-sm" style="height:36px;padding:0 14px">
            {{ t('nav.signIn') }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main class="hub-main">
      <slot />
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-slim">
          <BrandLogo size="sm" />
          <div class="footer-links">
            <NuxtLink to="/products">{{ t('footer.products') }}</NuxtLink>
            <NuxtLink to="/download">{{ t('footer.downloads') }}</NuxtLink>
            <NuxtLink to="/about">{{ t('footer.about') }}</NuxtLink>
            <NuxtLink to="/account">{{ t('footer.signIn') }}</NuxtLink>
            <a href="https://magies.top" target="_blank" rel="noopener">{{ t('footer.blog') }}</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© {{ year }} MAGIES. {{ t('footer.copy') }}.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const year = new Date().getFullYear()
const { t, toggleLocale, initLocale } = useI18n()

onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'dark')
  localStorage.removeItem('magies-theme')
  initLocale()
})
</script>
