<template>
  <canvas ref="canvas" class="starfield" aria-hidden="true" />
</template>

<script setup lang="ts">
/**
 * Lightweight Three.js particle starfield.
 * Client-only; pauses when tab is hidden; skips when reduced-motion is on.
 */
const canvas = ref<HTMLCanvasElement | null>(null)

let cleanup: (() => void) | null = null

onMounted(async () => {
  if (!import.meta.client || !canvas.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const THREE = await import('three')
  const el = canvas.value
  const renderer = new THREE.WebGLRenderer({
    canvas: el,
    alpha: true,
    antialias: false,
    powerPreference: 'low-power'
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)
  camera.position.z = 28

  const count = Math.min(900, Math.floor((window.innerWidth * window.innerHeight) / 2200))
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const palette = [
    [0.72, 0.8, 1],
    [0.77, 0.71, 0.99],
    [0.99, 0.75, 0.5],
    [0.95, 0.55, 0.78],
    [0.55, 0.85, 0.98]
  ]

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 90
    positions[i3 + 1] = (Math.random() - 0.5) * 60
    positions[i3 + 2] = (Math.random() - 0.5) * 70
    const c = palette[i % palette.length]
    const dim = 0.45 + Math.random() * 0.55
    colors[i3] = c[0] * dim
    colors[i3 + 1] = c[1] * dim
    colors[i3 + 2] = c[2] * dim
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.085,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  // Soft nebula orbs (cheap sprites via Points)
  const glowCount = 5
  const glowPos = new Float32Array(glowCount * 3)
  const glowCol = new Float32Array(glowCount * 3)
  const glowPalette = [
    [0.38, 0.45, 0.95],
    [0.55, 0.35, 0.9],
    [0.9, 0.45, 0.3]
  ]
  for (let i = 0; i < glowCount; i++) {
    const i3 = i * 3
    glowPos[i3] = (Math.random() - 0.5) * 40
    glowPos[i3 + 1] = (Math.random() - 0.5) * 24
    glowPos[i3 + 2] = -10 - Math.random() * 20
    const c = glowPalette[i % glowPalette.length]
    glowCol[i3] = c[0]
    glowCol[i3 + 1] = c[1]
    glowCol[i3 + 2] = c[2]
  }
  const glowGeo = new THREE.BufferGeometry()
  glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3))
  glowGeo.setAttribute('color', new THREE.BufferAttribute(glowCol, 3))
  const glowMat = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })
  const glows = new THREE.Points(glowGeo, glowMat)
  scene.add(glows)

  let width = 0
  let height = 0
  let raf = 0
  let running = true
  let t0 = performance.now()

  function resize() {
    width = window.innerWidth
    height = window.innerHeight
    renderer.setSize(width, height, false)
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
  }

  function frame(now: number) {
    if (!running) return
    raf = requestAnimationFrame(frame)
    const t = (now - t0) * 0.00008
    points.rotation.y = t * 0.35
    points.rotation.x = Math.sin(t * 0.4) * 0.04
    glows.rotation.y = -t * 0.12
    material.opacity = 0.72 + Math.sin(now * 0.0012) * 0.08
    renderer.render(scene, camera)
  }

  function onVisibility() {
    if (document.hidden) {
      running = false
      cancelAnimationFrame(raf)
    } else {
      if (!running) {
        running = true
        t0 = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
  }

  resize()
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  raf = requestAnimationFrame(frame)

  cleanup = () => {
    running = false
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibility)
    geometry.dispose()
    material.dispose()
    glowGeo.dispose()
    glowMat.dispose()
    renderer.dispose()
  }
})

onBeforeUnmount(() => {
  cleanup?.()
  cleanup = null
})
</script>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  opacity: 0.75;
}
</style>
