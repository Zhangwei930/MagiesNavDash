<template>
  <div class="hub" :class="{ 'home-layout': isHome }">
    <ClientOnly>
      <Starfield />
    </ClientOnly>

    <nav v-if="isHome" class="reference-navbar" data-testid="home-nav">
      <div class="reference-nav-inner">
        <NuxtLink to="/" class="reference-nav-brand" @click="menuOpen = false">
          <img src="/favicon.png" alt="">
          <span>Magies</span>
        </NuxtLink>

        <div class="reference-nav-links" :class="{ open: menuOpen }">
          <NuxtLink
            v-for="link in homeNavLinks"
            :key="link.key"
            :to="link.to"
            @click="menuOpen = false"
          >
            {{ t(link.key) }}
          </NuxtLink>
        </div>

        <div class="reference-nav-actions">
          <button
            type="button"
            class="reference-lang-switch"
            data-testid="home-language-toggle"
            :aria-label="t('nav.lang')"
            @click="toggleLocale"
          >
            {{ t('nav.lang') }}
          </button>
          <NuxtLink to="/account" class="reference-sign-in">
            {{ auth.isLoggedIn ? t('nav.account') : t('nav.login') }}
          </NuxtLink>
          <NuxtLink to="/products" class="reference-get-started">{{ t('nav.getStarted') }}</NuxtLink>
          <button
            type="button"
            class="reference-menu-toggle"
            :aria-label="t('nav.menu')"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <component :is="menuOpen ? X : Menu" :size="20" />
          </button>
        </div>
      </div>
    </nav>

    <nav v-else class="navbar">
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
          <button type="button" class="lang-switch" :title="t('nav.lang')" @click="toggleLocale">
            {{ t('nav.lang') }}
          </button>
          <NuxtLink
            to="/account"
            class="btn btn-outline btn-sm nav-login"
            @click="menuOpen = false"
          >{{ auth.isLoggedIn ? t('nav.account') : t('nav.login') }}</NuxtLink>
          <NuxtLink
            to="/products"
            class="btn btn-primary btn-sm nav-cta"
            @click="menuOpen = false"
          >{{ t('nav.getStarted') }}</NuxtLink>
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

    <footer v-if="isHome" class="reference-footer" data-testid="home-footer">
      <div class="reference-footer-inner">
        <NuxtLink to="/" class="reference-footer-brand">
          <img src="/favicon.png" alt="">
          <span>Magies</span>
        </NuxtLink>

        <nav class="reference-footer-links" aria-label="Footer">
          <NuxtLink v-for="link in homeFooterLinks" :key="link.key" :to="link.to">
            {{ t(link.key) }}
          </NuxtLink>
        </nav>

        <div class="reference-footer-social" aria-label="Social links">
          <a href="https://github.com" target="_blank" rel="noopener" title="GitHub">
            <Github :size="13" />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener" title="X">
            <Twitter :size="13" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" title="LinkedIn">
            <Linkedin :size="13" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener" title="YouTube">
            <Youtube :size="13" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener" title="Instagram">
            <Instagram :size="13" />
          </a>
        </div>
      </div>
      <p class="reference-footer-copy">© {{ year }} Magies. {{ t('footer.copy') }}.</p>
    </footer>

    <footer v-else class="footer">
      <div class="container">
        <div class="footer-grid footer-grid-5">
          <div class="footer-brand">
            <BrandLogo size="sm" />
            <p class="footer-blurb">{{ t('footer.blurb') }}</p>
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
          <div class="footer-social" aria-label="links">
            <a href="https://shell.magies.top" target="_blank" rel="noopener" title="Terminal">T</a>
            <a href="https://nav.magies.top" target="_blank" rel="noopener" title="Nav">N</a>
            <a href="mailto:hello@magies.top" title="Email">@</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Github, Instagram, Linkedin, Menu, Twitter, X, Youtube } from 'lucide-vue-next'
import { PAGE_LINKS, RESOURCE_LINKS } from '~/utils/siteLinks'
import type { MsgKey } from '~/composables/useI18n'

const menuOpen = ref(false)
const year = new Date().getFullYear()
const route = useRoute()
const isHome = computed(() => route.path === '/')
const { t, toggleLocale, initLocale, locale } = useI18n()
const auth = useAuthStore()

useHead(() => ({
  htmlAttrs: { lang: locale.value === 'zh' ? 'zh-CN' : 'en' }
}))

const homeNavLinks: { key: MsgKey; to: string }[] = [
  { key: 'nav.products', to: '/products' },
  { key: 'nav.solutions', to: '/solutions' },
  { key: 'footer.resources', to: '/download' },
  { key: 'home.navPricing', to: '/roadmap' },
  { key: 'changelog.title', to: '/changelog' },
  { key: 'nav.about', to: '/about' }
]

const homeFooterLinks = [
  ...homeNavLinks,
  { key: 'footer.contact' as MsgKey, to: '/contact' }
]

function resourceLabel(key: string): MsgKey {
  if (key === 'download') return 'nav.download'
  if (key === 'roadmap') return 'nav.roadmap'
  if (key === 'changelog') return 'changelog.title'
  if (key === 'contact') return 'footer.contact'
  return 'nav.home'
}

onMounted(() => {
  initLocale()
})
</script>

<style scoped>
.reference-navbar {
  position: sticky;
  z-index: 1000;
  top: 0;
  height: 80px;
  border-bottom: 1px solid rgba(78, 91, 142, 0.08);
  background: linear-gradient(180deg, rgba(1, 3, 10, 0.93), rgba(1, 3, 10, 0.7));
  backdrop-filter: blur(17px) saturate(1.2);
}

.reference-nav-inner {
  width: min(100% - 48px, 930px);
  height: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 182px 1fr 252px;
  align-items: center;
  gap: 14px;
}

.reference-nav-brand,
.reference-footer-brand {
  display: inline-flex;
  align-items: center;
  color: #f3f5fb;
  font-weight: 650;
}

.reference-nav-brand {
  gap: 9px;
  width: max-content;
  font-size: 0.92rem;
}

.reference-nav-brand img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  filter: saturate(1.08) drop-shadow(0 0 8px rgba(167, 139, 250, 0.38));
}

.reference-nav-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.reference-nav-links a {
  position: relative;
  padding: 7px 0;
  color: #d8ddeb;
  font-size: 0.68rem;
  font-weight: 520;
}

.reference-nav-links a::after {
  content: "";
  position: absolute;
  left: 50%;
  right: 50%;
  bottom: 2px;
  height: 1px;
  background: linear-gradient(90deg, #60a5fa, #c084fc, #fb923c);
  transition: left 0.2s, right 0.2s;
}

.reference-nav-links a:hover::after,
.reference-nav-links a.router-link-active::after {
  left: 0;
  right: 0;
}

.reference-nav-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.reference-sign-in,
.reference-get-started,
.reference-lang-switch {
  min-height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.63rem;
  font-weight: 620;
}

.reference-lang-switch {
  min-width: 45px;
  padding: 0 10px;
  color: #c9cfdf;
  border: 1px solid rgba(105, 117, 166, 0.22);
  background: rgba(4, 7, 16, 0.4);
  cursor: pointer;
}

.reference-lang-switch:hover {
  color: #fff;
  border-color: rgba(167, 139, 250, 0.55);
}

.reference-sign-in {
  min-width: 76px;
  color: #eef1f8;
  border: 1px solid rgba(105, 117, 166, 0.22);
  background: rgba(4, 7, 16, 0.4);
}

.reference-get-started {
  min-width: 112px;
  color: #fff;
  background: linear-gradient(100deg, #5b65ff, #8248f2 38%, #ec4899 68%, #fb923c);
  box-shadow:
    0 6px 20px rgba(124, 58, 237, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.reference-menu-toggle {
  display: none;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(105, 117, 166, 0.24);
  border-radius: 9px;
  background: rgba(7, 10, 23, 0.8);
  color: #e7eaf2;
  cursor: pointer;
}

.reference-footer {
  position: relative;
  z-index: 3;
  min-height: 80px;
  padding: 18px 0 12px;
  border-top: 1px solid rgba(75, 119, 194, 0.36);
  background: rgba(1, 3, 10, 0.84);
}

.reference-footer-inner {
  width: min(100% - 48px, 920px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 180px 1fr 150px;
  align-items: center;
  gap: 12px;
}

.reference-footer-brand {
  width: max-content;
  gap: 7px;
  font-size: 0.76rem;
}

.reference-footer-brand img {
  width: 27px;
  height: 27px;
  object-fit: contain;
  filter: saturate(1.08);
}

.reference-footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.reference-footer-links a {
  color: #9aa4b8;
  font-size: 0.55rem;
}

.reference-footer-links a:hover {
  color: #e6e9f2;
}

.reference-footer-social {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.reference-footer-social a {
  color: #9da7bb;
}

.reference-footer-social a:hover {
  color: #e4e8f1;
}

.reference-footer-copy {
  width: min(100% - 48px, 920px);
  margin: 4px auto 0;
  color: #657087;
  font-size: 0.5rem;
  text-align: right;
}

.nav-login {
  min-height: 36px;
  padding: 0 12px;
}

.nav-cta {
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  font-weight: 700;
  box-shadow: 0 4px 18px rgba(167, 139, 250, 0.35);
}

.footer-blurb {
  margin-top: 12px;
  max-width: 34ch;
  line-height: 1.7;
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

.footer-social {
  display: flex;
  gap: 8px;
}

.footer-social a {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid rgba(167, 139, 250, 0.18);
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  transition: color 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.footer-social a:hover {
  color: var(--accent-hover);
  border-color: rgba(167, 139, 250, 0.4);
  box-shadow: 0 0 16px rgba(167, 139, 250, 0.15);
}

@media (min-width: 1200px) {
  .reference-nav-inner,
  .reference-footer-inner,
  .reference-footer-copy {
    width: min(100% - 96px, 1180px);
  }

  .reference-nav-inner {
    grid-template-columns: 200px 1fr 252px;
  }
}

@media (max-width: 960px) {
  .reference-nav-inner {
    width: min(100% - 32px, 820px);
    grid-template-columns: 142px 1fr 252px;
  }

  .reference-nav-links {
    gap: 13px;
  }

  .reference-footer-inner,
  .reference-footer-copy {
    width: min(100% - 32px, 820px);
  }

  .reference-footer-links {
    gap: 11px;
  }

  .footer-grid-5 {
    grid-template-columns: 1fr 1fr;
  }

  .nav-login {
    display: none;
  }

  .nav-cta {
    display: none;
  }
}

@media (max-width: 760px) {
  .reference-nav-inner {
    grid-template-columns: 1fr auto;
  }

  .reference-nav-links {
    position: fixed;
    left: 12px;
    right: 12px;
    top: 78px;
    display: grid;
    gap: 0;
    padding: 10px;
    border: 1px solid rgba(105, 117, 166, 0.25);
    border-radius: 12px;
    background: rgba(4, 7, 18, 0.97);
    box-shadow: 0 16px 38px rgba(0, 0, 0, 0.42);
    transform: translateY(-145%);
    transition: transform 0.22s;
  }

  .reference-nav-links.open {
    transform: translateY(0);
  }

  .reference-nav-links a {
    padding: 10px 12px;
    font-size: 0.72rem;
  }

  .reference-sign-in {
    display: none;
  }

  .reference-get-started {
    min-width: 104px;
  }

  .reference-menu-toggle {
    display: inline-grid;
    place-items: center;
  }

  .reference-footer-inner {
    grid-template-columns: 1fr auto;
  }

  .reference-footer-links {
    display: none;
  }
}

@media (max-width: 560px) {
  .reference-navbar {
    height: 70px;
  }

  .reference-nav-inner {
    width: calc(100% - 24px);
  }

  .reference-nav-links {
    top: 68px;
  }

  .reference-footer {
    min-height: 70px;
  }

  .reference-footer-inner,
  .reference-footer-copy {
    width: calc(100% - 24px);
  }

  .reference-footer-copy {
    margin-top: 8px;
    text-align: center;
  }

  .footer-grid-5 {
    grid-template-columns: 1fr;
  }
}
</style>
