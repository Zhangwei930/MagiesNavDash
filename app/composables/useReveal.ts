import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

function ensureGsap() {
  if (!import.meta.client || registered) return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

/**
 * Entrance + scroll reveal for premium homepage sections.
 * Respects prefers-reduced-motion.
 */
export function useReveal(root: Ref<HTMLElement | null>) {
  const ctx = shallowRef<gsap.Context | null>(null)

  onMounted(() => {
    if (!import.meta.client || !root.value) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    ensureGsap()

    ctx.value = gsap.context(() => {
      const heroEls = root.value!.querySelectorAll<HTMLElement>('[data-hero-in]')
      gsap.from(heroEls, {
        opacity: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.05
      })

      const visual = root.value!.querySelector<HTMLElement>('[data-hero-visual]')
      if (visual) {
        gsap.from(visual, {
          opacity: 0,
          scale: 0.88,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.15
        })
      }

      root.value!.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 36,
          duration: 0.85,
          ease: 'power3.out'
        })
      })

      root.value!.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
        const kids = group.children
        gsap.from(kids, {
          scrollTrigger: {
            trigger: group,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out'
        })
      })
    }, root.value)
  })

  onBeforeUnmount(() => {
    ctx.value?.revert()
    ctx.value = null
  })
}
