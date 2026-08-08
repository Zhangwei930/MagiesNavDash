<template>
  <span class="magies-mark" :class="{ detail }" aria-hidden="true">
    <!-- Outer brand ring — kept as chrome -->
    <img
      class="mark-ring"
      :src="ringSrc"
      alt=""
      decoding="async"
      draggable="false"
    />
    <!-- Center: spiral galaxy (not a flat circle / cross-star) -->
    <span class="mark-galaxy">
      <img
        class="mark-galaxy-img"
        src="/brand/magies-galaxy-realistic.jpg"
        alt=""
        decoding="async"
        draggable="false"
      />
      <span class="mark-galaxy-glow" />
      <span class="mark-twinkle t1" />
      <span class="mark-twinkle t2" />
      <span class="mark-twinkle t3" />
    </span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ detail?: boolean }>(), { detail: false })

const ringSrc = computed(() =>
  props.detail ? '/brand/logo-mark-ring-512.png' : '/brand/logo-mark-ring-144.png'
)
</script>

<style scoped>
.magies-mark {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  isolation: isolate;
}

.mark-ring {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  /* Soften the empty black disc so the galaxy reads through the ring hole */
  mix-blend-mode: screen;
}

.mark-galaxy {
  position: absolute;
  /* Sit inside the ring hole */
  inset: 18%;
  z-index: 1;
  border-radius: 50%;
  overflow: hidden;
  background: #02040c;
  box-shadow:
    0 0 10px rgba(167, 139, 250, 0.35),
    inset 0 0 12px rgba(96, 165, 250, 0.25);
}

.mark-galaxy-img {
  position: absolute;
  inset: -18%;
  width: 136%;
  height: 136%;
  object-fit: cover;
  object-position: 50% 48%;
  animation: galaxySpin 48s linear infinite;
  filter: saturate(1.15) brightness(1.08) contrast(1.05);
  transform-origin: 50% 50%;
}

.mark-galaxy-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 48%, rgba(255, 245, 220, 0.55) 0%, rgba(251, 191, 36, 0.18) 14%, transparent 32%),
    radial-gradient(circle at 50% 50%, transparent 42%, rgba(2, 4, 12, 0.45) 100%);
  animation: corePulse 3.2s ease-in-out infinite alternate;
}

/* Twinkling field stars over the galaxy disc */
.mark-twinkle,
.mark-twinkle::before,
.mark-twinkle::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 50%;
  mix-blend-mode: screen;
}

.mark-twinkle.t1 {
  background:
    radial-gradient(circle at 22% 28%, #fff 0 0.9px, transparent 1.8px),
    radial-gradient(circle at 68% 22%, #c4b5fd 0 0.8px, transparent 1.7px),
    radial-gradient(circle at 78% 62%, #93c5fd 0 0.9px, transparent 1.9px),
    radial-gradient(circle at 34% 72%, #fde68a 0 0.7px, transparent 1.6px);
  animation: starTwinkle 1.8s ease-in-out infinite alternate;
}

.mark-twinkle.t2 {
  background:
    radial-gradient(circle at 48% 18%, #fff 0 0.7px, transparent 1.5px),
    radial-gradient(circle at 18% 58%, #e9d5ff 0 0.8px, transparent 1.7px),
    radial-gradient(circle at 82% 40%, #bae6fd 0 0.7px, transparent 1.5px),
    radial-gradient(circle at 55% 80%, #fbcfe8 0 0.8px, transparent 1.7px);
  animation: starTwinkle 2.6s ease-in-out -0.8s infinite alternate;
}

.mark-twinkle.t3 {
  background:
    radial-gradient(circle at 40% 42%, #fff 0 0.6px, transparent 1.4px),
    radial-gradient(circle at 62% 58%, #a5b4fc 0 0.7px, transparent 1.5px),
    radial-gradient(circle at 28% 36%, #fde68a 0 0.55px, transparent 1.3px);
  animation: starTwinkle 3.4s ease-in-out -1.4s infinite alternate;
}

.detail .mark-galaxy {
  inset: 16%;
  box-shadow:
    0 0 18px rgba(167, 139, 250, 0.45),
    inset 0 0 16px rgba(96, 165, 250, 0.28);
}

@keyframes galaxySpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes corePulse {
  from {
    opacity: 0.75;
    filter: brightness(0.95);
  }
  to {
    opacity: 1;
    filter: brightness(1.2);
  }
}

@keyframes starTwinkle {
  from {
    opacity: 0.35;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mark-galaxy-img,
  .mark-galaxy-glow,
  .mark-twinkle {
    animation: none !important;
  }
}
</style>
