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

          <span class="nav-sep" aria-hidden="true" />

          <a
            v-for="s in externalSites"
            :key="s.key"
            :href="s.href"
            target="_blank"
            rel="noopener"
            class="nav-ext"
            @click="menuOpen = false"
          >{{ t(`site.${s.key}`) }} <span aria-hidden="true">↗</span></a>
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
        <div class="footer-grid">
          <div>
            <BrandLogo size="sm" />
            <p style="margin-top:12px;max-width:34ch">{{ t('footer.blurb') }}</p>
          </div>
          <div>
            <h4>{{ t('footer.site') }}</h4>
            <NuxtLink v-for="p in PAGE_LINKS" :key="p.key" :to="p.to">{{ t(`nav.${p.key}`) }}</NuxtLink>
          </div>
          <div>
            <h4>{{ t('footer.ecosystem') }}</h4>
            <a
              v-for="s in externalSites"
              :key="s.key"
              :href="s.href"
              target="_blank"
              rel="noopener"
            >{{ t(`site.${s.key}`) }}</a>
          </div>
          <div>
            <h4>{{ t('footer.resources') }}</h4>
            <a href="https://shell.magies.top/#download" target="_blank" rel="noopener">
              {{ t('footer.getTerminal') }}
            </a>
            <NuxtLink to="/products">{{ t('footer.allProducts') }}</NuxtLink>
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
import { PAGE_LINKS, SITE_LINKS } from '~/utils/siteLinks'

const menuOpen = ref(false)
const year = new Date().getFullYear()
const { t, toggleLocale, initLocale } = useI18n()
const { theme, toggleTheme, initTheme } = useTheme()

const externalSites = SITE_LINKS.filter((s) => s.external)

onMounted(() => {
  initTheme()
  initLocale()
})
</script>

<style scoped>
.nav-sep {
  width: 1px;
  height: 18px;
  margin: 0 8px;
  background: var(--border);
}

.nav-links :deep(a.nav-ext),
.nav-ext {
  opacity: 0.82;
}

.nav-ext span {
  font-size: 0.72em;
  opacity: 0.7;
}

@media (max-width: 900px) {
  .nav-sep {
    width: auto;
    height: 1px;
    margin: 8px 14px;
  }
}
</style>
