import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const readProjectFile = (path: string) =>
  readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), 'utf8')

const homepage = readProjectFile('app/pages/index.vue')
const layout = readProjectFile('app/layouts/default.vue')
const i18n = readProjectFile('app/composables/useI18n.ts')
const heroSigil = readProjectFile('app/components/HeroSigil.vue')
const starfield = readProjectFile('app/components/Starfield.vue')

describe('homepage UI landmarks', () => {
  it('connects every visual section to an accessible heading', () => {
    expect(homepage).toContain('aria-labelledby="hero-title"')
    expect(homepage).toContain('<h1 id="hero-title"')
    expect(homepage).toContain('aria-labelledby="products-title"')
    expect(homepage).toContain('<h2 id="products-title">')
    expect(homepage).toContain('aria-labelledby="why-title"')
    expect(homepage).toContain('<h2 id="why-title">')
    expect(homepage).toContain('aria-labelledby="testimonials-title"')
    expect(homepage).toContain('<h2 id="testimonials-title">')
    expect(homepage).toContain('aria-labelledby="cta-title"')
    expect(homepage).toContain('<h2 id="cta-title">')
  })

  it('exposes product metrics as a labelled list', () => {
    expect(homepage).toContain('data-testid="home-metrics"')
    expect(homepage).toContain(":aria-label=\"t('home.metricsLabel')\"")
    expect(homepage).toContain('<ul class="stats-bar"')
    expect(homepage).toContain(
      'v-for="stat in stats" :key="stat.label" class="stat-item"'
    )
  })

  it('renders all homepage copy through the shared locale state', () => {
    expect(homepage).toContain('const { t, locale } = useI18n()')
    expect(homepage).toContain("{{ t('home.productsTitle') }}")
    expect(homepage).toContain("{{ t('home.testimonialsTitle') }}")
    expect(homepage).toContain("{{ t('home.ctaTitle') }}")
    expect(i18n).toContain("'home.heroBuild': 'Build.'")
    expect(i18n).toContain("'home.productsTitle': '探索 Magies 产品宇宙'")
    expect(i18n).toContain("'home.productsTitle': 'Explore the Magies product universe'")
    expect(i18n.match(/'home\.testimonial\.oneAuthor': 'Jason'/g)).toHaveLength(2)
    expect(i18n.match(/'home\.testimonial\.twoAuthor': 'Alex'/g)).toHaveLength(2)
    expect(i18n.match(/'home\.testimonial\.threeAuthor': 'Sam'/g)).toHaveLength(2)
    expect(i18n).not.toContain("'home.testimonial.oneAuthor': '张伟'")
    expect(i18n).not.toContain("'home.testimonial.oneAuthor': 'Wei Zhang'")
    expect(i18n).not.toContain("'home.testimonial.twoAuthor': '李娜'")
    expect(i18n).not.toContain("'home.testimonial.twoAuthor': 'Lina Li'")
    expect(i18n).not.toContain("'home.testimonial.threeAuthor': '王强'")
    expect(i18n).not.toContain("'home.testimonial.threeAuthor': 'Qiang Wang'")
  })

  it('removes obsolete homepage-only dashboard and ecosystem components', () => {
    const showcasePath = fileURLToPath(
      new URL('../app/components/HomeShowcase.vue', import.meta.url)
    )
    const ecosystemPath = fileURLToPath(
      new URL('../app/components/HomeEcosystem.vue', import.meta.url)
    )

    expect(homepage).not.toContain('<HomeShowcase')
    expect(homepage).not.toContain('<HomeEcosystem')
    expect(existsSync(showcasePath)).toBe(false)
    expect(existsSync(ecosystemPath)).toBe(false)
  })
})

describe('homepage chrome', () => {
  it('provides the reference navigation and expanded footer only on the homepage', () => {
    expect(layout).toContain(
      '<nav v-if="isHome" class="reference-navbar" data-testid="home-nav">'
    )
    expect(layout).toContain(
      '<footer v-if="isHome" class="reference-footer" data-testid="home-footer">'
    )
    expect(layout).toContain('grid-template-columns: 1.8fr repeat(3, 1fr);')
  })

  it('keeps the bilingual toggle and compact capsule navigation', () => {
    expect(layout).toContain('data-testid="home-language-toggle"')
    expect(layout).toContain('@click="toggleLocale"')
    expect(layout).toContain("htmlAttrs: { lang: locale.value === 'zh' ? 'zh-CN' : 'en' }")
    expect(layout).toContain('border-radius: 999px;')
  })
})

describe('shared visual components', () => {
  it('avoids Tailwind utility class collisions on animated rings', () => {
    expect(heroSigil).not.toMatch(/class="ring(?:\s|")/)
    expect(heroSigil).toContain('class="sigil-ring ring-outer"')
    expect(heroSigil).toContain('class="sigil-ring ring-mid"')
  })

  it('uses and disposes a radial texture instead of square point sprites', () => {
    expect(starfield).toContain('createRadialGradient')
    expect(starfield).toContain('map: glowTexture')
    expect(starfield).toContain('glowTexture.dispose()')
  })
})
