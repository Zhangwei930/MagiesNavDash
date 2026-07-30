import { existsSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const homepagePath = fileURLToPath(new URL('../app/pages/index.vue', import.meta.url))
const homepage = readFileSync(homepagePath, 'utf8')
const layoutPath = fileURLToPath(new URL('../app/layouts/default.vue', import.meta.url))
const layout = readFileSync(layoutPath, 'utf8')

const assetPath = (name: string) =>
  fileURLToPath(new URL(`../public/brand/${name}`, import.meta.url))

describe('reference landing page composition', () => {
  it('matches the supplied section order without unrelated showcase blocks', () => {
    const landmarks = [
      'data-testid="home-hero"',
      'data-testid="home-metrics"',
      'data-testid="home-products"',
      'data-testid="home-why"',
      'data-testid="home-testimonials"',
      'data-testid="home-cta"'
    ]
    const positions = landmarks.map((landmark) => homepage.indexOf(landmark))

    expect(positions.every((position) => position >= 0)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
    expect(homepage).not.toContain('data-testid="home-showcase"')
  })

  it('uses the three-line hero copy and scroll cue from the reference', () => {
    expect(homepage).toContain('class="hero-title-line hero-title-build"')
    expect(homepage).toContain('class="hero-title-line hero-title-automate"')
    expect(homepage).toContain('class="hero-title-line hero-title-ship"')
    expect(homepage).toContain('class="hero-scroll-cue"')
  })

  it('animates only the largest hero cross-star and keeps other logo stars static', () => {
    expect(homepage).toContain('class="hero-core-spark"')
    expect(homepage).toContain('@keyframes heroCoreSparkle')
    expect(homepage).toContain('animation: heroCoreSparkle')
    expect(homepage).toMatch(
      /\.hero-v2::before \{[\s\S]*?animation: heroGalaxyTwinkle 3\.4s ease-in-out infinite alternate;/
    )
    expect(homepage).toContain('@keyframes heroGalaxyTwinkle')
    expect(homepage).not.toContain('animation: corePulse')
    expect(homepage).toMatch(
      /@keyframes heroCoreSparkle \{\s*0%,\s*100% \{\s*filter: brightness\(0\.9\);\s*transform: translate\(-50%, -50%\) scale\(1\);\s*\}\s*50% \{\s*filter: brightness\(1\.42\) drop-shadow\(0 0 12px rgba\(205, 164, 255, 0\.72\)\);\s*transform: translate\(-50%, -50%\) scale\(1\.08\);/
    )

    const brandCrossStars = layout.match(/class="brand-cross-star"/g) ?? []
    expect(brandCrossStars).toHaveLength(2)
    expect(layout).not.toContain('@keyframes brandCross')
  })

  it('renders the four product planets around the central Magies star', () => {
    expect(homepage).toContain('class="product-universe"')
    expect(homepage).toContain('class="universe-core"')
    expect(homepage).toContain('v-for="product in products"')
    expect(homepage).toContain('class="product-planet"')
    expect(homepage).toContain("name: 'Magies Future'")
  })

  it('animates the product-universe cross-star and galaxy light points', () => {
    expect(homepage).toContain('class="universe-twinkle"')
    expect(homepage).toMatch(
      /<img[\s\S]*?class="universe-core"[\s\S]*?src="\/brand\/magies-reference-products\.jpg"/
    )
    expect(homepage).toMatch(
      /\.universe-core \{[^}]*clip-path: polygon\([^}]*calc\(50% - 72px\)[^}]*animation: universeCoreSparkle 2\.8s ease-in-out infinite;/
    )
    expect(homepage).toMatch(
      /\.universe-twinkle \{[\s\S]*?animation: galaxyTwinkle 1\.9s ease-in-out infinite alternate;/
    )
    expect(homepage).toMatch(
      /\.universe-twinkle::before \{[\s\S]*?animation: galaxyTwinkle 2\.8s ease-in-out -1\.2s infinite alternate;/
    )
    expect(homepage).not.toContain('.universe-core::after')
    expect(homepage).toContain('@keyframes universeCoreSparkle')
    expect(homepage).toContain('@keyframes galaxyTwinkle')
  })

  it('centers each product label on its rendered planet', () => {
    expect(homepage).toMatch(
      /\.product-planet \{[\s\S]*?aspect-ratio: 1;[\s\S]*?display: flex;[\s\S]*?flex-direction: column;[\s\S]*?align-items: center;[\s\S]*?justify-content: center;/
    )
    expect(homepage).toMatch(
      /\.product-planet strong,[\s\S]*?\.product-planet span \{[\s\S]*?width: 100%;[\s\S]*?text-align: center;/
    )
    expect(homepage).toMatch(
      /\.product-planet i \{[\s\S]*?position: absolute;[\s\S]*?left: 50%;[\s\S]*?top: 78%;[\s\S]*?margin-top: 0;/
    )
    expect(homepage).toMatch(/\.product-planet\.terminal \{[\s\S]*?top: 25%;/)
    expect(homepage).toMatch(/\.product-planet\.pdf \{[\s\S]*?top: 24%;/)
    expect(homepage).toMatch(/\.product-planet\.studio \{[\s\S]*?top: 69%;/)
    expect(homepage).toMatch(/\.product-planet\.future \{[\s\S]*?top: 65%;/)
  })

  it('renders five benefits and three developer testimonials', () => {
    expect(homepage).toContain('grid-template-columns: repeat(5, minmax(0, 1fr));')
    expect(homepage).toContain('v-for="benefit in benefits"')
    expect(homepage).toContain('v-for="testimonial in testimonials"')
    expect(homepage).toContain('class="testimonial-card"')
  })

  it('uses dedicated image-model artwork for each cosmic scene', () => {
    const assets = [
      'magies-reference-hero.jpg',
      'magies-reference-products.jpg',
      'magies-reference-cta.jpg'
    ]

    for (const asset of assets) {
      expect(homepage).toContain(`/brand/${asset}`)
      expect(existsSync(assetPath(asset))).toBe(true)
      expect(statSync(assetPath(asset)).size).toBeGreaterThan(100_000)
    }
  })

  it('uses the reference capsule navigation and expanded footer columns', () => {
    expect(layout).toContain('class="reference-nav-links"')
    expect(layout).toContain('class="reference-lang-switch"')
    expect(layout).toContain('class="reference-get-started"')
    expect(layout).toContain('class="reference-footer-columns"')
  })

  it('keeps the top navigation bilingual with slightly larger labels', () => {
    expect(layout).toContain('{{ t(link.key) }}')
    expect(layout).toContain("{{ t('nav.getStarted') }}")
    expect(layout).toMatch(/\.reference-nav-links a \{[^}]*font-size: 1\.05rem;/)
  })

  it('slightly enlarges the get started label, sparkle icon, and footer headings', () => {
    expect(layout).toContain('<Sparkles :size="15"')
    expect(layout).toMatch(/\.reference-get-started \{[\s\S]*?font-size: 0\.74rem;/)
    expect(layout).toMatch(/\.reference-footer-group strong \{[\s\S]*?font-size: 0\.78rem;/)
  })

  it('scales the entire footer for legibility', () => {
    expect(layout.match(/<(?:Github|Twitter|MessageCircle|Mail) :size="20"/g)).toHaveLength(4)
    expect(layout).toMatch(/\.reference-footer \{[\s\S]*?min-height: 285px;[\s\S]*?padding: 36px 0 20px;/)
    expect(layout).toMatch(/\.reference-footer-brand \{[\s\S]*?font-size: 1\.05rem;/)
    expect(layout).toMatch(
      /\.reference-footer-brand \.reference-brand-mark \{[\s\S]*?width: 44px;[\s\S]*?height: 44px;/
    )
    expect(layout).toMatch(/\.reference-footer-group strong \{[\s\S]*?font-size: 0\.9rem;/)
    expect(layout).toMatch(/\.reference-footer-group a \{[\s\S]*?font-size: 0\.78rem;/)
    expect(layout).toMatch(/\.reference-footer-bottom \{[\s\S]*?font-size: 0\.7rem;/)
  })
})
