<template>
  <div class="orbit" aria-hidden="true">
    <div class="orbit-glow" />
    <div class="orbit-nebula" />
    <div class="orbit-ring ring-outer" />
    <div class="orbit-ring ring-mid" />
    <div class="orbit-ring ring-inner" />
    <div class="orbit-dust" />
    <div class="orbit-core">
      <span class="core-flare h" />
      <span class="core-flare v" />
      <span class="core-star" />
    </div>
    <span v-for="i in 12" :key="i" class="orbit-particle" :style="particleStyle(i)" />
  </div>
</template>

<script setup lang="ts">
function particleStyle(i: number) {
  const angle = (i / 12) * Math.PI * 2
  const radius = 38 + (i % 3) * 6
  const x = 50 + Math.cos(angle) * radius
  const y = 50 + Math.sin(angle) * radius * 0.92
  const delay = (i * 0.35).toFixed(2)
  const size = 2 + (i % 3)
  const hues = ['#93c5fd', '#c4b5fd', '#f0abfc', '#fdba74', '#67e8f9']
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: hues[i % hues.length],
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
.orbit {
  position: relative;
  width: min(520px, 92vw);
  height: min(520px, 92vw);
  margin: 0 auto;
  isolation: isolate;
}

.orbit-glow {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(167, 139, 250, 0.35) 0%, transparent 55%),
    radial-gradient(circle at 35% 40%, rgba(56, 189, 248, 0.28) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(251, 146, 60, 0.22) 0%, transparent 48%);
  filter: blur(28px);
  animation: auraPulse 6s ease-in-out infinite;
}

.orbit-nebula {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    conic-gradient(
      from 210deg,
      transparent 0deg,
      rgba(96, 165, 250, 0.12) 40deg,
      transparent 90deg,
      rgba(167, 139, 250, 0.14) 160deg,
      transparent 220deg,
      rgba(251, 146, 60, 0.1) 280deg,
      transparent 360deg
    );
  filter: blur(8px);
  animation: nebulaSpin 28s linear infinite;
}

.orbit-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid transparent;
  pointer-events: none;
}

.ring-outer {
  inset: 6%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #38bdf8,
    #818cf8,
    #c084fc,
    #f472b6,
    #fb923c,
    #fbbf24,
    #38bdf8
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px));
  box-shadow:
    0 0 40px rgba(96, 165, 250, 0.25),
    0 0 80px rgba(167, 139, 250, 0.2);
  animation: ringSpin 18s linear infinite;
  opacity: 0.95;
}

.ring-outer::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.85) 6%,
    transparent 14%,
    transparent 52%,
    rgba(251, 146, 60, 0.9) 58%,
    transparent 68%
  );
  animation: ringSpin 10s linear infinite reverse;
  opacity: 0.9;
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 1px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 1px));
}

.ring-mid {
  inset: 18%;
  border: 1px solid rgba(167, 139, 250, 0.28);
  box-shadow:
    0 0 24px rgba(129, 140, 248, 0.18),
    inset 0 0 20px rgba(96, 165, 250, 0.08);
  animation: ringSpin 24s linear infinite reverse;
}

.ring-mid::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 1px dashed rgba(244, 114, 182, 0.2);
  animation: ringSpin 40s linear infinite;
}

.ring-inner {
  inset: 32%;
  border: 1px solid rgba(96, 165, 250, 0.22);
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.12);
  animation: ringSpin 14s linear infinite;
}

.orbit-dust {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1.2px 1.2px at 70% 25%, rgba(196, 181, 253, 0.8), transparent),
    radial-gradient(1px 1px at 40% 70%, rgba(251, 146, 60, 0.7), transparent),
    radial-gradient(1px 1px at 80% 60%, rgba(96, 165, 250, 0.75), transparent),
    radial-gradient(1.4px 1.4px at 55% 40%, rgba(255, 255, 255, 0.6), transparent);
  opacity: 0.7;
  animation: dustDrift 12s ease-in-out infinite alternate;
}

.orbit-core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 28%;
  height: 28%;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
}

.core-star {
  width: 18%;
  height: 18%;
  min-width: 10px;
  min-height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #e9d5ff 35%, #a78bfa 70%, transparent 100%);
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.9),
    0 0 50px rgba(167, 139, 250, 0.85),
    0 0 90px rgba(96, 165, 250, 0.55);
  animation: starPulse 2.8s ease-in-out infinite;
  z-index: 2;
}

.core-flare {
  position: absolute;
  left: 50%;
  top: 50%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    rgba(196, 181, 253, 0.95),
    rgba(255, 255, 255, 0.95),
    rgba(251, 146, 60, 0.7),
    rgba(255, 255, 255, 0.15),
    transparent
  );
  filter: blur(0.4px);
  transform-origin: center;
  animation: flareBreathe 3.2s ease-in-out infinite;
}

.core-flare.h {
  width: 140%;
  height: 2px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 12px rgba(196, 181, 253, 0.8);
}

.core-flare.v {
  width: 2px;
  height: 140%;
  transform: translate(-50%, -50%);
  background: linear-gradient(
    180deg,
    transparent,
    rgba(96, 165, 250, 0.5),
    rgba(255, 255, 255, 0.95),
    rgba(244, 114, 182, 0.55),
    transparent
  );
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.7);
  animation-delay: 0.4s;
}

.orbit-particle {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px currentColor;
  animation: particleTwinkle 3s ease-in-out infinite;
}

@keyframes ringSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes nebulaSpin {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes auraPulse {
  0%,
  100% {
    opacity: 0.75;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

@keyframes starPulse {
  0%,
  100% {
    transform: scale(0.9);
    filter: brightness(0.9);
  }
  40% {
    transform: scale(1.25);
    filter: brightness(1.5);
  }
  70% {
    transform: scale(1.05);
    filter: brightness(1.15);
  }
}

@keyframes flareBreathe {
  0%,
  100% {
    opacity: 0.55;
    filter: blur(0.4px) brightness(0.9);
  }
  50% {
    opacity: 1;
    filter: blur(0.2px) brightness(1.3);
  }
}

@keyframes dustDrift {
  from {
    transform: rotate(0deg) scale(1);
    opacity: 0.55;
  }
  to {
    transform: rotate(12deg) scale(1.04);
    opacity: 0.85;
  }
}

@keyframes particleTwinkle {
  0%,
  100% {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(0.7);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-glow,
  .orbit-nebula,
  .orbit-ring,
  .ring-outer::before,
  .ring-mid::after,
  .orbit-dust,
  .core-star,
  .core-flare,
  .orbit-particle {
    animation: none !important;
  }
}
</style>
