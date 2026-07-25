<template>
  <div class="hub">
    <nav class="navbar">
      <div class="container navbar-inner">
        <NuxtLink to="/" class="nav-brand" @click="menuOpen = false">
          <BrandLogo size="nav" :show-wordmark="true" />
        </NuxtLink>

        <div class="nav-links" :class="{ open: menuOpen }">
          <NuxtLink
            v-for="p in PAGE_LINKS"
            :key="p.key"
            :to="p.to"
            @click="menuOpen = false"
          >{{ t(`nav.${p.key}`) }}</NuxtLink>
        </div>

        <div class="nav-actions">
          <button
            type="button"
            class="btn-icon"
            :title="t('nav.theme')"
            :aria-label="t('nav.theme')"
            @click="toggleTheme"
          >
            <component :is="theme === 'dark' ? Sun : Moon" :size="17" :stroke-width="2" />
          </button>
          <button type="button" class="lang-switch" :title="t('nav.lang')" @click="toggleLocale">
            {{ t('nav.lang') }}
          </button>
          <NuxtLink
            to="/account"
            class="btn btn-outline btn-sm nav-login"
            @click="menuOpen = false"
          >{{ auth.isLoggedIn ? t('nav.account') : t('nav.login') }}</NuxtLink>
          <button
            type="button"
            class="nav-toggle"
            :aria-label="t('nav.menu')"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <component :is="menuOpen ? X : Menu" :size="20" :stroke-width="2" />
          </button>
        </div>
      </div>
    </nav>

    <main class="hub-main">
      <slot />
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-grid footer-grid-5">
          <div>
            <BrandLogo size="sm" />
            <p style="margin-top:12px;max-width:34ch">{{ t('footer.blurb') }}</p>
            <p class="footer-created">{{ t('footer.created') }}</p>
          </div>
          <div>
            <h4>{{ t('footer.products') }}</h4>
            <NuxtLink to="/products">{{ t('footer.allProducts') }}</NuxtLink>
            <NuxtLink to="/solutions">{{ t('nav.solutions') }}</NuxtLink>
            <a href="https://shell.magies.top" target="_blank" rel="noopener">{{ t('site.terminal') }}</a>
            <a href="https://nav.magies.top" target="_blank" rel="noopener">{{ t('site.nav') }}</a>
          </div>
          <div>
            <h4>{{ t('footer.resources') }}</h4>
            <NuxtLink v-for="r in RESOURCE_LINKS" :key="r.key" :to="r.to">
              {{ t(resourceLabel(r.key)) }}
            </NuxtLink>
          </div>
          <div>
            <h4>{{ t('footer.support') }}</h4>
            <NuxtLink to="/contact">{{ t('footer.contact') }}</NuxtLink>
            <NuxtLink to="/account">{{ t('nav.account') }}</NuxtLink>
            <NuxtLink to="/security">{{ t('security.title') }}</NuxtLink>
          </div>
          <div>
            <h4>{{ t('footer.legal') }}</h4>
            <NuxtLink to="/privacy">{{ t('privacy.title') }}</NuxtLink>
            <NuxtLink to="/terms">{{ t('terms.title') }}</NuxtLink>
            <NuxtLink to="/security">{{ t('security.title') }}</NuxtLink>
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
import { Menu, Moon, Sun, X } from 'lucide-vue-next'
import { PAGE_LINKS, RESOURCE_LINKS } from '~/utils/siteLinks'
import type { MsgKey } from '~/composables/useI18n'

const menuOpen = ref(false)
const year = new Date().getFullYear()
const { t, toggleLocale, initLocale } = useI18n()
const { theme, toggleTheme, initTheme } = useTheme()
const auth = useAuthStore()

function resourceLabel(key: string): MsgKey {
  if (key === 'download') return 'nav.download'
  if (key === 'roadmap') return 'nav.roadmap'
  if (key === 'changelog') return 'changelog.title'
  if (key === 'contact') return 'footer.contact'
  return 'nav.home'
}

onMounted(() => {
  initTheme()
  initLocale()
})
</script>

<style scoped>
.nav-login {
  min-height: 36px;
  padding: 0 12px;
}

.footer-created {
  margin-top: 10px;
  font-size: 0.8rem;
  color: var(--text-muted);
  opacity: 0.85;
}

.footer-grid-5 {
  grid-template-columns: 1.4fr repeat(4, minmax(0, 1fr));
}

@media (max-width: 960px) {
  .footer-grid-5 {
    grid-template-columns: 1fr 1fr;
  }

  .nav-login {
    display: none;
  }
}

@media (max-width: 560px) {
  .footer-grid-5 {
    grid-template-columns: 1fr;
  }
}
</style>
