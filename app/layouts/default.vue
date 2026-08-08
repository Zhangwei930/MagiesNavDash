<template>
  <div class="hub" :class="{ 'home-layout': isHome }">
    <ClientOnly>
      <Starfield />
    </ClientOnly>

    <nav v-if="isHome" class="reference-navbar" data-testid="home-nav">
      <div class="reference-nav-inner">
        <NuxtLink to="/" class="reference-nav-brand" @click="menuOpen = false">
          <span class="reference-brand-mark" aria-hidden="true">
            <img src="/brand/logo-mark-ring-144.png" alt="">
            <span class="brand-cross-star" />
          </span>
          <span>MAGIES</span>
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
            <Globe2 :size="15" :stroke-width="1.8" />
            <span>{{ t('nav.lang') }}</span>
          </button>
          <NuxtLink to="/products" class="reference-get-started">
            {{ t('nav.getStarted') }}
            <Sparkles :size="15" :stroke-width="1.8" />
          </NuxtLink>
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
      <div class="reference-footer-columns">
        <div class="reference-footer-brand-block">
          <NuxtLink to="/" class="reference-footer-brand">
            <span class="reference-brand-mark" aria-hidden="true">
              <img src="/brand/logo-mark-ring-144.png" alt="">
              <span class="brand-cross-star" />
            </span>
            <span>MAGIES</span>
          </NuxtLink>
          <div class="reference-footer-social" aria-label="Social links">
            <a href="https://github.com" target="_blank" rel="noopener" title="GitHub">
              <Github :size="20" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener" title="X">
              <Twitter :size="20" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener" title="Discord">
              <MessageCircle :size="20" />
            </a>
            <a href="mailto:hello@magies.top" title="Email">
              <Mail :size="20" />
            </a>
          </div>
        </div>

        <nav class="reference-footer-group" :aria-label="t('footer.products')">
          <strong>{{ t('footer.products') }}</strong>
          <NuxtLink to="/products/magies-terminal">Magies Terminal</NuxtLink>
          <NuxtLink to="/products/magies-data-studio">Magies Data Studio</NuxtLink>
          <NuxtLink to="/products/magies-office">Magies Office</NuxtLink>
          <NuxtLink to="/roadmap">Magies Future</NuxtLink>
        </nav>

        <nav class="reference-footer-group" :aria-label="t('footer.resources')">
          <strong>{{ t('footer.resources') }}</strong>
          <NuxtLink to="/download">{{ t('nav.docs') }}</NuxtLink>
          <NuxtLink to="/contact">{{ t('footer.help') }}</NuxtLink>
          <NuxtLink to="/roadmap">{{ t('nav.roadmap') }}</NuxtLink>
          <NuxtLink to="/changelog">{{ t('nav.blog') }}</NuxtLink>
        </nav>

        <nav class="reference-footer-group" :aria-label="t('footer.company')">
          <strong>{{ t('footer.company') }}</strong>
          <NuxtLink to="/about">{{ t('nav.about') }}</NuxtLink>
          <NuxtLink to="/contact">{{ t('footer.join') }}</NuxtLink>
          <NuxtLink to="/contact">{{ t('footer.contact') }}</NuxtLink>
          <NuxtLink to="/privacy">{{ t('privacy.title') }}</NuxtLink>
          <NuxtLink to="/terms">{{ t('terms.title') }}</NuxtLink>
        </nav>
      </div>
      <div class="reference-footer-bottom">
        <p>© {{ year }} Magies. {{ t('footer.copy') }}.</p>
        <div>
          <NuxtLink to="/privacy">{{ t('privacy.title') }}</NuxtLink>
          <NuxtLink to="/terms">{{ t('terms.title') }}</NuxtLink>
        </div>
      </div>
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
            <a href="https://tech.magies.top" target="_blank" rel="noopener">{{ t('site.game') }}</a>
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
import {
  Github,
  Globe2,
  Mail,
  Menu,
  MessageCircle,
  Sparkles,
  Twitter,
  X
} from 'lucide-vue-next'
import { PAGE_LINKS, RESOURCE_LINKS } from '~/utils/siteLinks'
import type { MsgKey } from '~/composables/useI18n'

const menuOpen = ref(false)
const year = new Date().getFullYear()
const route = useRoute()
const isHome = computed(() => route.path === '/')
const { t, toggleLocale, initLocale, locale } = useI18n()

useHead(() => ({
  htmlAttrs: { lang: locale.value === 'zh' ? 'zh-CN' : 'en' }
}))

const homeNavLinks: { key: MsgKey; to: string }[] = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.products', to: '/products' },
  { key: 'nav.docs', to: '/download' },
  { key: 'nav.download', to: '/download' },
  { key: 'nav.blog', to: '/changelog' },
  { key: 'nav.about', to: '/about' }
]

function resourceLabel(key: string): MsgKey {
  if (key === 'download') return 'nav.download'
  if (key === 'roadmap') return 'nav.roadmap'
  if (key === 'changelog') return 'nav.blog'
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
  height: 76px;
  background: rgba(1, 4, 14, 0.88);
  backdrop-filter: blur(18px) saturate(1.2);
}

.reference-nav-inner {
  width: min(100% - 48px, 1180px);
  height: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 190px 1fr 190px;
  align-items: center;
  gap: 24px;
}

.reference-nav-brand,
.reference-footer-brand {
  display: inline-flex;
  align-items: center;
  color: #f3f5fb;
  font-weight: 650;
}

.reference-nav-brand {
  gap: 12px;
  width: max-content;
  font-size: 1.02rem;
  letter-spacing: 0.32em;
}

.reference-brand-mark {
  position: relative;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
}

.reference-brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.reference-nav-brand .reference-brand-mark {
  width: 38px;
  height: 38px;
  filter: saturate(1.12) drop-shadow(0 0 9px rgba(167, 139, 250, 0.48));
}

.brand-cross-star {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 42%;
  height: 42%;
  pointer-events: none;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0 11%, #f5d0fe 18%, rgba(192, 132, 252, 0.38) 36%, transparent 68%);
  mix-blend-mode: screen;
  transform: translate(-50%, -50%);
}

.brand-cross-star::before,
.brand-cross-star::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  transform: translate(-50%, -50%);
}

.brand-cross-star::before {
  width: 100%;
  height: 1px;
}

.brand-cross-star::after {
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #fff, transparent);
}

.reference-nav-links {
  position: relative;
  min-height: 34px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 2.6vw, 40px);
  border: 1px solid rgba(118, 94, 223, 0.5);
  border-radius: 999px;
  background: rgba(3, 7, 19, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 0 22px rgba(45, 57, 185, 0.08);
}

.reference-nav-links a {
  position: relative;
  padding: 9px 0;
  color: #f0f2f8;
  font-size: 1.05rem;
  font-weight: 520;
  line-height: 1;
  text-transform: uppercase;
}

.reference-nav-links a::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -3px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #6aa8ff;
  box-shadow: 0 0 7px currentColor;
  opacity: 0.72;
  transform: translateX(-50%);
  transition: opacity 0.2s, transform 0.2s;
}

.reference-nav-links a:hover::after,
.reference-nav-links a.router-link-active::after {
  opacity: 1;
  transform: translateX(-50%) scale(1.45);
}

.reference-nav-links a:nth-child(2)::after,
.reference-nav-links a:nth-child(5)::after {
  background: #d15dff;
}

.reference-nav-links a:nth-child(3)::after {
  background: #ff9748;
}

.reference-nav-links a:nth-child(6)::after {
  background: #48dcff;
}

.reference-nav-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.reference-get-started,
.reference-lang-switch {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.66rem;
  font-weight: 620;
}

.reference-lang-switch {
  width: 38px;
  min-width: 38px;
  padding: 0;
  color: #c9cfdf;
  border-radius: 50%;
  border: 1px solid rgba(105, 117, 166, 0.22);
  background: rgba(4, 7, 16, 0.4);
  cursor: pointer;
}

.reference-lang-switch span {
  display: none;
}

.reference-lang-switch:hover {
  color: #fff;
  border-color: rgba(167, 139, 250, 0.55);
}

.reference-get-started {
  min-width: 128px;
  gap: 8px;
  border-radius: 8px;
  color: #21143d;
  font-size: 0.74rem;
  background: linear-gradient(100deg, #82a9ff, #c766f3 42%, #ff5e93 71%, #ff9952);
  box-shadow:
    0 6px 20px rgba(124, 58, 237, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);
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
  min-height: 285px;
  padding: 36px 0 20px;
  border-top: 1px solid rgba(68, 95, 172, 0.38);
  background: #020512;
}

.reference-footer-columns {
  width: min(100% - 48px, 1180px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.8fr repeat(3, 1fr);
  align-items: start;
  gap: 60px;
}

.reference-footer-brand {
  width: max-content;
  gap: 12px;
  font-size: 1.05rem;
  letter-spacing: 0.3em;
}

.reference-footer-brand .reference-brand-mark {
  width: 44px;
  height: 44px;
  filter: saturate(1.12) drop-shadow(0 0 8px rgba(167, 139, 250, 0.38));
}

.reference-footer-social {
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.reference-footer-social a {
  color: #8c98b4;
}

.reference-footer-social a:hover {
  color: #dce3f6;
}

.reference-footer-group {
  display: grid;
  gap: 12px;
}

.reference-footer-group strong {
  margin-bottom: 4px;
  color: #d7dced;
  font-size: 0.9rem;
  font-weight: 560;
}

.reference-footer-group a {
  width: max-content;
  color: #77839f;
  font-size: 0.78rem;
}

.reference-footer-group a:hover {
  color: #dce1ef;
}

.reference-footer-bottom {
  width: min(100% - 48px, 1180px);
  margin: 30px auto 0;
  padding-top: 16px;
  border-top: 1px solid rgba(80, 92, 139, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: #59647e;
  font-size: 0.7rem;
}

.reference-footer-bottom div {
  display: flex;
  gap: 20px;
}

.reference-footer-bottom a {
  color: inherit;
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

/* Every shell width below mirrors .reference-container in app/pages/index.vue.
   They have to: the hero is a panel in that shell now, so any difference shows
   up as the navbar and the panel starting on different lines. */
@media (min-width: 961px) and (max-width: 1100px) {
  .reference-nav-inner,
  .reference-footer-columns,
  .reference-footer-bottom {
    width: min(100% - 48px, 960px);
  }
}

@media (min-width: 1200px) {
  /* 48px, not 96px: .reference-container uses 48px, so wider gutters here left
     the nav 24px narrower than the content under it between 1200 and 1276px,
     where neither is capped at 1180px yet. Identical above 1276px. */
  .reference-nav-inner,
  .reference-footer-columns,
  .reference-footer-bottom {
    width: min(100% - 48px, 1180px);
  }

  .reference-nav-inner {
    grid-template-columns: 210px 1fr 190px;
  }
}

/* Must stay in step with .reference-container in app/pages/index.vue: the page
   shell widens on these two breakpoints, and chrome that kept a 1180px shell
   would no longer line up with the content under it. */
@media (min-width: 1600px) {
  .reference-nav-inner,
  .reference-footer-columns,
  .reference-footer-bottom {
    width: min(100% - 96px, 1400px);
  }
}

@media (min-width: 1900px) {
  .reference-nav-inner,
  .reference-footer-columns,
  .reference-footer-bottom {
    width: min(100% - 96px, 1600px);
  }
}

@media (max-width: 960px) {
  .reference-navbar {
    height: 70px;
  }

  .reference-nav-inner {
    width: min(100% - 48px, 960px);
    grid-template-columns: 150px 1fr 176px;
    gap: 14px;
  }

  .reference-nav-brand {
    font-size: 0.86rem;
    letter-spacing: 0.22em;
  }

  .reference-nav-brand .reference-brand-mark {
    width: 34px;
    height: 34px;
  }

  .reference-nav-links {
    padding: 0 17px;
    gap: 15px;
  }

  .reference-footer-columns,
  .reference-footer-bottom {
    width: min(100% - 48px, 960px);
  }

  .reference-footer-columns {
    gap: 28px;
  }

  .footer-grid-5 {
    grid-template-columns: 1fr 1fr;
  }

  .nav-cta {
    display: none;
  }
}

@media (min-width: 761px) and (max-width: 960px) {
  .reference-footer {
    min-height: 0;
    padding: 20px 0 12px;
  }

  .reference-footer-columns {
    grid-template-columns: 1.65fr repeat(3, 1fr);
    gap: 24px;
  }

  .reference-footer-brand {
    gap: 8px;
    font-size: 0.82rem;
  }

  .reference-footer-brand .reference-brand-mark {
    width: 34px;
    height: 34px;
  }

  .reference-footer-social {
    margin-top: 14px;
  }

  .reference-footer-group {
    gap: 7px;
  }

  .reference-footer-group strong {
    margin-bottom: 1px;
    font-size: 0.68rem;
  }

  .reference-footer-group a {
    font-size: 0.56rem;
  }

  .reference-footer-bottom {
    margin-top: 14px;
    padding-top: 9px;
    font-size: 0.52rem;
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

  .reference-get-started {
    min-width: 104px;
  }

  .reference-menu-toggle {
    display: inline-grid;
    place-items: center;
  }

  .reference-footer-columns {
    grid-template-columns: 1.3fr repeat(3, 1fr);
    gap: 18px;
  }
}

@media (max-width: 560px) {
  .reference-navbar {
    height: 70px;
  }

  .reference-nav-links {
    top: 68px;
  }

  .reference-footer {
    min-height: 0;
  }

  .reference-footer-columns {
    grid-template-columns: 1fr 1fr;
    row-gap: 28px;
  }

  .reference-footer-brand-block {
    grid-column: 1 / -1;
  }

  .reference-footer-bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .footer-grid-5 {
    grid-template-columns: 1fr;
  }
}

/* Last, so it wins over the phone blocks above: .reference-container caps at
   560px from 620px down, and the chrome follows it. */
@media (max-width: 620px) {
  .reference-nav-inner,
  .reference-footer-columns,
  .reference-footer-bottom {
    width: min(100% - 28px, 560px);
  }
}
</style>
