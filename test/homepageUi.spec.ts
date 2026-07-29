import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const homepagePath = fileURLToPath(new URL('../app/pages/index.vue', import.meta.url))
const homepage = readFileSync(homepagePath, 'utf8')
const heroSigilPath = fileURLToPath(new URL('../app/components/HeroSigil.vue', import.meta.url))
const heroSigil = readFileSync(heroSigilPath, 'utf8')
const starfieldPath = fileURLToPath(new URL('../app/components/Starfield.vue', import.meta.url))
const starfield = readFileSync(starfieldPath, 'utf8')

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
    expect(homepage).toContain(
      '<section class="stats-wrap container" data-testid="home-metrics" aria-label="Magies product metrics">'
    )
    expect(homepage).toContain('<ul class="stats-bar"')
    expect(homepage).toContain('v-for="s in stats" :key="s.key" class="stat-item"')
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
