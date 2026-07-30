<template>
  <div class="sigil" aria-hidden="true">
    <!-- soft field stars -->
    <span
      v-for="i in 18"
      :key="'st' + i"
      class="field-star"
      :style="starStyle(i)"
    />

    <!-- shooting stars -->
    <span class="meteor m1" />
    <span class="meteor m2" />

    <!-- outer particle ring (slow) -->
    <div class="sigil-ring ring-outer">
      <svg viewBox="0 0 200 200">
        <defs>
          <linearGradient id="sg-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#22d3ee" />
            <stop offset="22%" stop-color="#3b82f6" />
            <stop offset="48%" stop-color="#a855f7" />
            <stop offset="72%" stop-color="#f43f5e" />
            <stop offset="100%" stop-color="#fbbf24" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="url(#sg-ring)"
          stroke-width="1.2"
          stroke-dasharray="1.2 3.6"
          opacity="0.85"
        />
        <circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke="url(#sg-ring)"
          stroke-width="0.7"
          stroke-dasharray="0.8 2.8"
          opacity="0.55"
        />
      </svg>
    </div>

    <!-- mid dotted band -->
    <div class="sigil-ring ring-mid">
      <svg viewBox="0 0 200 200">
        <defs>
          <linearGradient id="sg-ring-mid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#22d3ee" />
            <stop offset="22%" stop-color="#3b82f6" />
            <stop offset="48%" stop-color="#a855f7" />
            <stop offset="72%" stop-color="#f43f5e" />
            <stop offset="100%" stop-color="#fbbf24" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="url(#sg-ring-mid)"
          stroke-width="2.4"
          stroke-dasharray="0.9 2.1"
          opacity="0.95"
        />
        <circle
          cx="100"
          cy="100"
          r="66"
          fill="none"
          stroke="url(#sg-ring-mid)"
          stroke-width="1"
          stroke-dasharray="0.5 2.4"
          opacity="0.45"
        />
      </svg>
    </div>

    <!-- solid bright rim -->
    <div class="rim">
      <svg viewBox="0 0 200 200">
        <defs>
          <linearGradient id="sg-rim" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="35%" stop-color="#e879f9" />
            <stop offset="55%" stop-color="#fff" />
            <stop offset="75%" stop-color="#fb923c" />
            <stop offset="100%" stop-color="#fbbf24" />
          </linearGradient>
          <filter id="sg-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="54"
          fill="none"
          stroke="url(#sg-rim)"
          stroke-width="2.2"
          filter="url(#sg-glow)"
        />
      </svg>
    </div>

    <!-- inner dark void -->
    <div class="void" />

    <!-- cross flare -->
    <div class="cross">
      <span class="beam h" />
      <span class="beam v" />
      <span class="beam d1" />
      <span class="beam d2" />
      <span class="core" />
      <span class="pulse" />
    </div>
  </div>
</template>

<script setup lang="ts">
function starStyle(i: number) {
  const seed = i * 47
  const x = 8 + ((seed * 13) % 84)
  const y = 6 + ((seed * 29) % 88)
  const size = 1 + ((seed * 7) % 18) / 10
  const hues = ['#fff', '#67e8f9', '#c4b5fd', '#fde68a', '#f9a8d4', '#93c5fd']
  const delay = ((seed * 3) % 40) / 10
  const dur = 1.8 + ((seed * 5) % 28) / 10
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: hues[i % hues.length],
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
    opacity: 0.35 + ((seed * 11) % 45) / 100
  }
}
</script>

<style scoped>
.sigil {
  --size: min(410px, 40vw);
  position: relative;
  width: var(--size);
  height: var(--size);
  margin: 0 auto;
  isolation: isolate;
}

.sigil::before {
  content: "";
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.24);
  box-shadow:
    0 0 80px 30px rgba(168, 85, 247, 0.18),
    0 0 120px 42px rgba(56, 189, 248, 0.08);
  pointer-events: none;
}

/* ambient stars around the mark */
.field-star {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px currentColor;
  animation: twinkle ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

.meteor {
  position: absolute;
  width: 42px;
  height: 1.5px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #67e8f9 40%, #fff);
  box-shadow: 0 0 8px 1px rgba(103, 232, 249, 0.6);
  opacity: 0;
  z-index: 1;
}

.meteor.m1 {
  top: 14%;
  left: 8%;
  animation: meteor 7s linear infinite;
  animation-delay: 0.6s;
}

.meteor.m2 {
  bottom: 16%;
  right: 6%;
  width: 28px;
  background: linear-gradient(90deg, transparent, #fb923c 40%, #fff);
  box-shadow: 0 0 8px 1px rgba(251, 146, 60, 0.55);
  animation: meteor2 9s linear infinite;
  animation-delay: 3.8s;
}

.sigil-ring {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.sigil-ring svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
}

.ring-outer {
  animation: spin 28s linear infinite;
}

.ring-mid {
  animation: spin 16s linear infinite reverse;
}

.rim {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  animation: spin 48s linear infinite;
}

.rim svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
}

.void {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 48%;
  height: 48%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, #05060c 40%, transparent 72%);
  z-index: 2;
  pointer-events: none;
}

.cross {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.beam {
  position: absolute;
  left: 50%;
  top: 50%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(232, 121, 249, 0.15) 18%,
    rgba(255, 255, 255, 0.95) 48%,
    rgba(192, 132, 252, 0.9) 52%,
    rgba(56, 189, 248, 0.2) 78%,
    transparent 100%
  );
  transform-origin: center;
  border-radius: 999px;
  filter: blur(0.3px);
}

.beam.h {
  width: 52%;
  height: 2px;
  margin: -1px 0 0 -26%;
  box-shadow: 0 0 12px 2px rgba(232, 121, 249, 0.55);
}

.beam.v {
  width: 2px;
  height: 52%;
  margin: -26% 0 0 -1px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(232, 121, 249, 0.2) 18%,
    rgba(255, 255, 255, 0.95) 48%,
    rgba(167, 139, 250, 0.9) 52%,
    rgba(251, 146, 60, 0.25) 78%,
    transparent 100%
  );
  box-shadow: 0 0 12px 2px rgba(192, 132, 252, 0.55);
}

.beam.d1,
.beam.d2 {
  width: 36%;
  height: 1px;
  margin: -0.5px 0 0 -18%;
  opacity: 0.55;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.55),
    transparent
  );
}

.beam.d1 {
  transform: rotate(45deg);
}

.beam.d2 {
  transform: rotate(-45deg);
}

.core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 40% 35%, #fff 0%, #f5d0fe 28%, #c084fc 55%, transparent 72%);
  box-shadow:
    0 0 16px 6px rgba(232, 121, 249, 0.85),
    0 0 36px 12px rgba(139, 92, 246, 0.45),
    0 0 60px 20px rgba(56, 189, 248, 0.18);
  animation: corePulse 2.8s ease-in-out infinite;
}

.pulse {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 28px;
  height: 28px;
  margin: -14px 0 0 -14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 20px rgba(232, 121, 249, 0.4);
  animation: ripple 2.8s ease-out infinite;
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.85);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.25);
  }
}

@keyframes corePulse {
  0%,
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.12);
    filter: brightness(1.15);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0.6);
    opacity: 0.55;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

@keyframes meteor {
  0% {
    opacity: 0;
    transform: translate(0, 0) rotate(-32deg);
  }
  8% {
    opacity: 1;
  }
  28% {
    opacity: 0;
    transform: translate(48px, 30px) rotate(-32deg);
  }
  100% {
    opacity: 0;
  }
}

@keyframes meteor2 {
  0% {
    opacity: 0;
    transform: translate(0, 0) rotate(148deg);
  }
  8% {
    opacity: 1;
  }
  28% {
    opacity: 0;
    transform: translate(-36px, -22px) rotate(148deg);
  }
  100% {
    opacity: 0;
  }
}

@media (max-width: 960px) {
  .sigil {
    --size: min(340px, 72vw);
  }
}

@media (max-width: 560px) {
  .sigil {
    --size: min(240px, 72vw);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ring-outer,
  .ring-mid,
  .rim,
  .core,
  .pulse,
  .field-star,
  .meteor {
    animation: none;
  }

  .pulse {
    opacity: 0;
  }

  .field-star {
    opacity: 0.55;
  }
}
</style>
