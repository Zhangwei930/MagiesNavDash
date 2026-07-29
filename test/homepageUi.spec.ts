import { existsSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const homepagePath = fileURLToPath(new URL('../app/pages/index.vue', import.meta.url))
const homepage = readFileSync(homepagePath, 'utf8')
const layoutPath = fileURLToPath(new URL('../app/layouts/default.vue', import.meta.url))
const layout = readFileSync(layoutPath, 'utf8')
const i18nPath = fileURLToPath(new URL('../app/composables/useI18n.ts', import.meta.url))
const i18n = readFileSync(i18nPath, 'utf8')
const ecosystemPath = fileURLToPath(new URL('../app/components/HomeEcosystem.vue', import.meta.url))
const ecosystem = readFileSync(ecosystemPath, 'utf8')
const heroSigilPath = fileURLToPath(new URL('../app/components/HeroSigil.vue', import.meta.url))
const heroSigil = readFileSync(heroSigilPath, 'utf8')
const starfieldPath = fileURLToPath(new URL('../app/components/Starfield.vue', import.meta.url))
const starfield = readFileSync(starfieldPath, 'utf8')
const suppliedLogoPath = fileURLToPath(
  new URL('../public/brand/magies-logo-hero.png', import.meta.url)
)
const generatedAvatarPath = fileURLToPath(
  new URL('../public/brand/trust-avatar-strip.jpg', import.meta.url)
)
const generatedGalaxyPath = fileURLToPath(
  new URL('../public/brand/magies-galaxy-realistic.jpg', import.meta.url)
)

describe('homepage UI landmarks', () => {
  it('connects each major visual section to an accessible heading', () => {
    expect(homepage).toContain(
      '<section class="hero-v2" data-testid="home-hero" aria-labelledby="hero-title">'
    )
    expect(homepage).toContain('<h1 id="hero-title" class="hero-v2-title"')
    expect(homepage).toContain(
      '<section class="section products-section" data-testid="home-products" aria-labelledby="products-title">'
    )
    expect(homepage).toContain('<h2 id="products-title">')
    expect(homepage).toContain(
      '<section class="section section-alt showcase-section" data-testid="home-showcase" aria-labelledby="showcase-title">'
    )
    expect(homepage).toContain('<h2 id="showcase-title">')
    expect(homepage).toContain(
      '<section class="section why-eco-section" data-testid="home-why" aria-labelledby="why-title">'
    )
    expect(homepage).toContain('<h2 id="why-title">')
    expect(homepage).toContain(
      '<section class="section cta-section" data-testid="home-cta" aria-labelledby="cta-title">'
    )
    expect(homepage).toContain('<h2 id="cta-title">')
  })

  it('exposes product metrics as a labelled list', () => {
    expect(homepage).toContain('class="stats-wrap container"')
    expect(homepage).toContain('data-testid="home-metrics"')
    expect(homepage).toContain(":aria-label=\"t('home.metricsLabel')\"")
    expect(homepage).toContain('<ul class="stats-bar"')
    expect(homepage).toContain(
      'v-for="stat in stats" :key="stat.label" class="stat-item"'
    )
  })

  it('follows the reference composition from hero through CTA', () => {
    const orderedLandmarks = [
      'data-testid="home-hero"',
      'data-testid="home-metrics"',
      'data-testid="home-products"',
      'data-testid="home-showcase"',
      'data-testid="home-why"',
      'data-testid="home-cta"'
    ]
    const positions = orderedLandmarks.map((landmark) => homepage.indexOf(landmark))

    expect(positions.every((position) => position >= 0)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
    expect(homepage).toContain('class="reference-home"')
    expect(homepage).toContain('class="reference-products-grid"')
    expect(homepage).toContain('grid-template-columns: repeat(6, minmax(0, 1fr))')
  })

  it('uses the supplied high-resolution logo as the hero artwork', () => {
    expect(homepage).toContain(
      '<img class="hero-logo-art" src="/brand/magies-logo-hero.png"'
    )
    expect(existsSync(suppliedLogoPath)).toBe(true)
    expect(statSync(suppliedLogoPath).size).toBeGreaterThan(500_000)
  })

  it('widens the homepage content only on large desktop screens', () => {
    expect(homepage).toContain('@media (min-width: 1200px)')
    expect(homepage).toContain('width: min(100% - 96px, 1180px);')
  })

  it('renders homepage copy from the shared Chinese and English locale state', () => {
    expect(homepage).toContain('const { t, locale } = useI18n()')
    expect(homepage).toContain("{{ t('home.productsTitle') }}")
    expect(homepage).toContain("{{ t('home.ctaTitle') }}")
    expect(i18n).toContain("'home.stat.activeUsers': '活跃用户'")
    expect(i18n).toContain("'home.stat.activeUsers': 'Active Users'")
    expect(i18n).toContain("'home.product.terminalDesc':")
  })

  it('uses generated photographic avatars and a realistic galaxy asset', () => {
    expect(homepage).toContain("url('/brand/trust-avatar-strip.jpg')")
    expect(homepage).toContain("url('/brand/magies-galaxy-realistic.jpg')")
    expect(existsSync(generatedAvatarPath)).toBe(true)
    expect(existsSync(generatedGalaxyPath)).toBe(true)
    expect(statSync(generatedAvatarPath).size).toBeGreaterThan(50_000)
    expect(statSync(generatedGalaxyPath).size).toBeGreaterThan(100_000)
  })

  it('animates a clockwise galaxy around the hero logo and pulses its core star', () => {
    expect(homepage).toContain('class="hero-galaxy-orbit"')
    expect(homepage).toContain('class="hero-core-star"')
    expect(homepage).toContain('@keyframes galaxyClockwise')
    expect(homepage).toContain('@keyframes coreStarPulse')
  })

  it('adds breathing room to cards and major homepage sections', () => {
    expect(homepage).toContain('padding: 34px 0 28px;')
    expect(homepage).toContain('min-height: 168px;')
    expect(homepage).toContain('gap: 12px;')
  })
})

describe('homepage chrome', () => {
  it('provides the compact reference navigation and footer only on the homepage', () => {
    expect(layout).toContain(
      '<nav v-if="isHome" class="reference-navbar" data-testid="home-nav">'
    )
    expect(layout).not.toContain('class="reference-nav-score"')
    expect(layout).not.toContain('36.2K')
    expect(layout).toContain(
      '<footer v-if="isHome" class="reference-footer" data-testid="home-footer">'
    )
  })

  it('provides a bilingual toggle in the homepage navigation', () => {
    expect(layout).toContain('data-testid="home-language-toggle"')
    expect(layout).toContain('@click="toggleLocale"')
    expect(layout).toContain("{{ t('nav.lang') }}")
    expect(layout).toContain("htmlAttrs: { lang: locale.value === 'zh' ? 'zh-CN' : 'en' }")
    expect(layout).not.toContain(':key="link.label"')
  })

  it('widens homepage navigation and footer with the desktop content', () => {
    expect(layout).toContain('@media (min-width: 1200px)')
    expect(layout).toContain('width: min(100% - 96px, 1180px);')
  })
})

describe('homepage ecosystem', () => {
  it('reuses the supplied Magies logo at the center of the ecosystem', () => {
    expect(ecosystem).toContain(
      '<img class="eco-logo" src="/brand/magies-logo-hero.png" alt="">'
    )
  })
})

describe('hero sigil styles', () => {
  it('avoids Tailwind utility class collisions on animated rings', () => {
    expect(heroSigil).not.toMatch(/class="ring(?:\s|")/)
    expect(heroSigil).toContain('class="sigil-ring ring-outer"')
    expect(heroSigil).toContain('class="sigil-ring ring-mid"')
  })
})

describe('starfield glow rendering', () => {
  it('uses and disposes a radial texture instead of square point sprites', () => {
    expect(starfield).toContain("createRadialGradient")
    expect(starfield).toContain('map: glowTexture')
    expect(starfield).toContain('glowTexture.dispose()')
  })
})
