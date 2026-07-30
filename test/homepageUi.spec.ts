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
    // one <picture> per img drawn from the art: hero-backdrop, hero-core-star,
    // universe-backdrop, universe-core, cta-backdrop
    expect(homepageTemplate.match(/<picture>/g)).toHaveLength(5)
    expect(homepageTemplate.match(/<\/picture>/g)).toHaveLength(5)
    expect(homepageTemplate.match(/<source srcset=/g)).toHaveLength(5)
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
    // position now comes from .hero-v2's variables so the clip cannot disagree
    expect(spark).toContain('left: var(--star-x)')
    expect(spark).toContain('top: var(--star-y)')
    expect(spark).toContain('mix-blend-mode: screen')
  })

  it('keeps both sparkle animations numerically identical', () => {
    for (const name of ['heroCoreSparkle', 'universeCoreSparkle']) {
      const f = frames(name)
      expect(f, name).toContain('brightness(0.9)')
      expect(f, name).toContain('brightness(1.42)')
      expect(f, name).toContain('scale(1.08)')
      // no drop-shadow here by design — see the animation performance budget
      expect(f, name).not.toContain('drop-shadow')
    }
    expect(rule('.hero-core-spark')).toContain('2.8s ease-in-out infinite')
    expect(rule('.universe-core')).toContain('2.8s ease-in-out infinite')
  })
})

describe('animation performance budget', () => {
  const keyframeBlocks = () => {
    const out: { name: string; body: string }[] = []
    const re = /@keyframes\s+([\w-]+)\s*\{/g
    let m: RegExpExecArray | null
    while ((m = re.exec(homepage))) {
      // walk braces to find the matching close
      let depth = 1
      let i = re.lastIndex
      while (i < homepage.length && depth > 0) {
        if (homepage[i] === '{') depth++
        else if (homepage[i] === '}') depth--
        i++
      }
      out.push({ name: m[1], body: homepage.slice(re.lastIndex, i) })
    }
    return out
  }

  it('never animates drop-shadow, which re-rasterises the layer every frame', () => {
    const offenders = keyframeBlocks()
      .filter(b => b.body.includes('drop-shadow'))
      .map(b => b.name)
    expect(offenders).toEqual([])
  })

  it('keeps the brightness flicker that drop-shadow was padding', () => {
    const byName = Object.fromEntries(keyframeBlocks().map(b => [b.name, b.body]))
    for (const n of [
      'heroCoreSparkle',
      'heroGalaxyTwinkle',
      'universeCoreSparkle',
      'galaxyTwinkle'
    ]) {
      expect(byName[n], n).toBeDefined()
      expect(byName[n], n).toContain('brightness(')
    }
  })
})

describe('hero and product-universe cross-star parity', () => {
  it('drives both cross-stars from the same keyframe so they cannot drift', () => {
    expect(homepage).toMatch(
      /\.hero-core-star\s*\{[\s\S]*?animation: universeCoreSparkle 2\.8s ease-in-out infinite;/
    )
    expect(homepage).toMatch(
      /\.universe-core\s*\{[\s\S]*?animation: universeCoreSparkle 2\.8s ease-in-out infinite;/
    )
  })

  it('keeps the clipped star centred on the same point as the spark at every breakpoint', () => {
    // Both variables live on .hero-v2 and are read by the spark and by the clip,
    // so no breakpoint can move one layer's star without the other's. --star-x
    // is restated per crop band (it depends on the box height there), --star-y
    // only where the crop regime changes.
    const heroBlocks = homepage.split('.hero-v2 {').slice(1).map(b => b.slice(0, b.indexOf('}')))
    const declaredX = heroBlocks.filter(b => b.includes('--star-x:')).length
    const declaredY = heroBlocks.filter(b => b.includes('--star-y:')).length
    expect(declaredX).toBeGreaterThanOrEqual(4)
    expect(declaredY).toBeGreaterThanOrEqual(3)
    // nothing outside .hero-v2 may declare them, or the two layers can disagree
    expect(homepage.match(/--star-(x|y):/g)!.length).toBe(declaredX + declaredY)
    // the phone bands crop at 70% instead of right, so they carry that term
    expect(homepage).toContain('--star-x: calc(70% + 760px * 0.0474)')
    expect(homepage).toContain('--star-x: calc(70% + 720px * 0.0474)')
  })

  it('mirrors the backdrop object-position so the clip tracks the crop', () => {
    const starRule = homepage.slice(homepage.indexOf('.hero-core-star {'))
    expect(starRule).toContain('object-position: right center')
    // and the small-screen override exists for both layers
    expect(homepage.match(/object-position: 70% center/g)!.length).toBeGreaterThanOrEqual(3)
  })
})

describe('hero copy fits its shell instead of being clipped', () => {
  const ruleBlocks = (selector: string) => {
    const out: string[] = []
    const needle = `${selector} {`
    let at = homepage.indexOf(needle)
    while (at !== -1) {
      const end = homepage.indexOf('}', at)
      out.push(homepage.slice(at + needle.length, end))
      at = homepage.indexOf(needle, end)
    }
    return out
  }

  it('lets the hero grow rather than clip copy taller than the shell', () => {
    // A fixed height plus overflow: hidden is what jammed the title under the
    // header at >=1400px: the copy stack outgrew the box and align-items:
    // center stopped centring. Every breakpoint states a floor, not a ceiling.
    const blocks = ruleBlocks('.hero-v2')
    expect(blocks.length).toBeGreaterThanOrEqual(4)
    for (const block of blocks) {
      expect(block, block).not.toMatch(/(^|[^-])height: \d/)
    }
    expect(homepage).toMatch(/\.hero-v2 \{[\s\S]*?min-height: clamp\(670px,/)
  })

  it('keeps the copy off the header when it does outgrow the shell', () => {
    const [content] = ruleBlocks('.hero-content')
    expect(content).toContain('min-height: inherit')
    expect(content).toMatch(/padding: \d+px 0 58px;/)
  })

  it('measures the hero paragraphs by the copy column, not in Latin ch', () => {
    // 1ch is the width of "0" (~13px here); a CJK glyph is a full em, so
    // max-width: 18ch fitted 11 Chinese characters and broke the claim into a
    // narrow ribbon three lines deep.
    for (const block of [...ruleBlocks('.hero-claim'), ...ruleBlocks('.hero-description')]) {
      expect(block, block).not.toMatch(/\d+ch/)
    }
  })

  it('gives the copy column room for the widest title line', () => {
    // "Automate." is 421px at the 6rem cap, so a 35% (413px) column overflowed
    expect(homepage).toMatch(/\.hero-copy \{[\s\S]*?width: 44%;/)
  })
})

describe('hero composition on large screens', () => {
  it('fills the fold without cropping the artwork', () => {
    // The art is exactly 2:1 and full-bleed, so a hero taller than 50vw makes
    // object-fit: cover switch to height-driven and slice the earth arc off the
    // bottom. Height is therefore the fold, capped at 50vw, floored at 670px.
    expect(homepage).toMatch(
      /\.hero-v2 \{[\s\S]*?min-height: clamp\(670px, calc\(100svh - 76px\), 50vw\);/
    )
  })

  it('derives the star centre from the crop instead of a per-height constant', () => {
    // In the width-driven regime the painted star sits at 0.4405 of the image
    // height, so its offset from the hero centre is (0.4405 - 0.5) * 50vw.
    // calc(50% - 3.2vw) stays locked to the star at every height, which a fixed
    // percentage cannot do, and matches the height-driven bands at the switch.
    expect(homepage).toMatch(/\.hero-v2 \{[\s\S]*?--star-y: calc\(50% - 3\.2vw\);/)
    expect(homepage).toMatch(/\.hero-v2 \{[\s\S]*?--star-x: 72\.3%;/)
  })

  it('drives the spark and the clip from one pair of variables', () => {
    // Both layers must land on the same point; reading the same custom property
    // is the only version of that invariant a breakpoint cannot break.
    expect(homepage).toMatch(/\.hero-core-spark \{[\s\S]*?left: var\(--star-x\);/)
    expect(homepage).toMatch(/\.hero-core-spark \{[\s\S]*?top: var\(--star-y\);/)
    const sparkBlocks = homepage.split('.hero-core-spark {').slice(1)
    for (const block of sparkBlocks) {
      const body = block.slice(0, block.indexOf('}'))
      expect(body, body).not.toMatch(/(left|top): \d/)
    }
    // and the star must not redeclare them locally
    const starBlocks = homepage.split('.hero-core-star {').slice(1)
    for (const block of starBlocks) {
      const body = block.slice(0, block.indexOf('}'))
      expect(body, body).not.toMatch(/--star-(x|y):/)
    }
  })

  it('widens the shell past 1600px in the nav, the page and the footer together', () => {
    // A page shell wider than the nav shell is the misalignment it was meant
    // to fix, so all three move on the same breakpoint.
    expect(homepage).toMatch(
      /@media \(min-width: 1600px\) \{[\s\S]*?\.reference-container \{\s*width: min\(100% - 96px, 1400px\);/
    )
    expect(layout).toMatch(
      /@media \(min-width: 1600px\) \{[\s\S]*?width: min\(100% - 96px, 1400px\);/
    )
    expect(layout).toMatch(/@media \(min-width: 1600px\) \{[\s\S]*?\.reference-footer-columns/)
    // the chrome's gutter must match .reference-container's 48px, or the nav is
    // narrower than the content between 1200px and 1276px
    expect(layout).not.toContain('min(100% - 96px, 1180px)')
  })

  it('scales the hero type with the wider shell', () => {
    expect(homepage).toMatch(/\.hero-v2-title \{[\s\S]*?font-size: clamp\(4rem, 6\.3vw, 7rem\);/)
    expect(homepage).toMatch(/@media \(min-width: 1600px\) \{[\s\S]*?\.hero-claim \{\s*font-size: 1\.5rem;/)
    // and the wide shell must decide the measure, not main.css's 520px cap
    expect(homepage).toMatch(/@media \(min-width: 1600px\) \{[\s\S]*?\.hero-copy \{\s*max-width: 600px;/)
  })

  it('anchors the scroll cue to the shell instead of the viewport centre', () => {
    // Centred on the viewport it landed in the gap between the copy and the
    // galaxy, aligned with neither.
    const [cue] = homepage.split('.hero-scroll-cue {').slice(1)
    const body = cue.slice(0, cue.indexOf('}'))
    expect(body).toContain('left: var(--shell-inset)')
    expect(body).not.toContain('translateX(-50%)')
    expect(homepage).toMatch(/\.hero-v2 \{[\s\S]*?--shell-inset: max\(24px, calc\(\(100% - 1180px\) \/ 2\)\);/)
  })
})
