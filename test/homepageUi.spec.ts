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

describe('homepage backdrop images', () => {
  const BACKDROP_BASES = [
    'magies-reference-hero',
    'magies-reference-products',
    'magies-reference-cta'
  ]

  // count markup in the template only — <style> prose can mention tag names
  const homepageTemplate = homepage.slice(0, homepage.indexOf('<style'))

  it('serves AVIF with a JPG fallback for every backdrop', () => {
    for (const base of BACKDROP_BASES) {
      expect(homepage).toContain(
        `<source srcset="/brand/${base}.avif" type="image/avif">`
      )
      expect(homepage).toContain(`src="/brand/${base}.jpg"`)
    }
    // one <picture> per backdrop img: hero, universe-backdrop, universe-core, cta
    expect(homepageTemplate.match(/<picture>/g)).toHaveLength(4)
    expect(homepageTemplate.match(/<\/picture>/g)).toHaveLength(4)
    expect(homepageTemplate.match(/<source srcset=/g)).toHaveLength(4)
  })

  it('keeps <picture> layout-neutral so absolute positioning is unchanged', () => {
    expect(homepage).toMatch(/picture\s*\{\s*display:\s*contents;\s*\}/)
  })

  it('ships every AVIF variant referenced by the markup', () => {
    for (const base of BACKDROP_BASES) {
      const avif = fileURLToPath(
        new URL(`../public/brand/${base}.avif`, import.meta.url)
      )
      expect(existsSync(avif)).toBe(true)
    }
  })
})

describe('homepage backdrop loading strategy', () => {
  const template = homepage.slice(0, homepage.indexOf('<style'))

  it('eagerly loads only the above-the-fold hero backdrop', () => {
    const hero = template.slice(
      template.indexOf('class="hero-backdrop"'),
      template.indexOf('class="hero-backdrop"') + 220
    )
    expect(hero).toContain('fetchpriority="high"')
    expect(hero).not.toContain('loading="lazy"')
  })

  it('defers only the CTA backdrop, the one far enough down to qualify', () => {
    const cta = template.slice(
      template.indexOf('class="cta-backdrop"'),
      template.indexOf('class="cta-backdrop"') + 220
    )
    expect(cta).toContain('loading="lazy"')
    // the product-universe backdrops sit ~330px below the fold, inside Chrome's
    // eager threshold at every realistic viewport height, so lazy is inert there
    expect(template.match(/loading="lazy"/g)).toHaveLength(1)
  })

  it('paints a matching fallback colour under the full-bleed backdrops', () => {
    // average tone of the source art, so a late decode is not a visible pop
    expect(homepage).toMatch(/\.universe-backdrop\s*\{[^}]*background-color:\s*#14112d/)
    expect(homepage).toMatch(/\.cta-backdrop\s*\{[^}]*background-color:\s*#0a0f2c/)
  })
})

describe('cross-star sparkle consistency', () => {
  const rule = (sel: string) => {
    const start = homepage.indexOf(`${sel} {`)
    return start < 0 ? '' : homepage.slice(start, homepage.indexOf('\n}', start))
  }
  const frames = (name: string) => {
    const start = homepage.indexOf(`@keyframes ${name}`)
    return start < 0 ? '' : homepage.slice(start, homepage.indexOf('\n}', start))
  }

  it('shapes the hero sparkle as a star so its scaling reads like the universe core', () => {
    const spark = rule('.hero-core-spark')
    expect(spark).toContain('clip-path: polygon(')
    // 8 vertices = 4 arm tips + 4 waist points, same construction as .universe-core
    expect(spark.match(/\d+(\.\d+)?%/g)!.length).toBeGreaterThanOrEqual(16)
    // waist in percentages, not px, so proportions survive the breakpoints that
    // shrink this element to 126px / clamp(120px, 24vw, 160px)
    expect(spark).toMatch(/clip-path: polygon\((?:[^)]|\([^)]*\))*\)/)
    expect(spark).not.toMatch(/clip-path:[\s\S]*?\d+px[\s\S]*?\);/)
    // position and blend deliberately unchanged
    expect(spark).toContain('left: 72.3%')
    expect(spark).toContain('top: 43.2%')
    expect(spark).toContain('mix-blend-mode: screen')
  })

  it('keeps both sparkle animations numerically identical', () => {
    for (const name of ['heroCoreSparkle', 'universeCoreSparkle']) {
      const f = frames(name)
      expect(f, name).toContain('brightness(0.9)')
      expect(f, name).toContain('brightness(1.42)')
      expect(f, name).toContain('scale(1.08)')
      expect(f, name).toContain('drop-shadow(0 0 12px rgba(205, 164, 255, 0.72))')
    }
    expect(rule('.hero-core-spark')).toContain('2.8s ease-in-out infinite')
    expect(rule('.universe-core')).toContain('2.8s ease-in-out infinite')
  })
})
