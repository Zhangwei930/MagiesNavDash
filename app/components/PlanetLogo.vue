<template>
  <div class="planet" aria-hidden="true">
    <img class="planet-ring" src="/brand/logo-mark-ring-512.png" width="512" height="512" alt="" decoding="async" fetchpriority="high">
    <img class="planet-star" src="/brand/logo-mark-star-512.png" width="512" height="512" alt="" decoding="async" fetchpriority="high">
    <span class="planet-spark s1" />
    <span class="planet-spark s2" />
    <span class="planet-spark s3" />
    <span class="planet-spark s4" />
  </div>
</template>

<style scoped>
/* The mark ships as two layers split at the empty band between the star flare
   and the ring, so the orbit band can spin without dragging the star with it. */
.planet {
  position: relative;
  width: min(320px, 74vw);
  height: min(320px, 74vw);
  margin: 0 auto;
}

.planet::before {
  content: "";
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 62%),
    radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.18) 0%, transparent 58%),
    radial-gradient(circle at 72% 58%, rgba(249, 115, 22, 0.14) 0%, transparent 58%);
  filter: blur(26px);
  animation: planetAura 7s ease-in-out infinite;
}

.planet img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.planet-ring {
  animation: planetSpin 32s linear infinite;
}

.planet-star {
  animation: planetTwinkle 3.6s ease-in-out infinite;
}

.planet-spark {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px #c4b5fd, 0 0 18px #60a5fa;
  animation: twinkle 2.8s ease-in-out infinite;
}

.s1 { top: 10%; left: 20%; }
.s2 { top: 16%; right: 14%; animation-delay: 0.7s; background: #fdba74; box-shadow: 0 0 10px #fb923c; }
.s3 { bottom: 18%; left: 12%; animation-delay: 1.2s; background: #93c5fd; }
.s4 { bottom: 12%; right: 18%; animation-delay: 1.8s; }

@keyframes planetSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Double flash rather than a single swell, so it reads as a star twinkling
   instead of the whole layer breathing. */
@keyframes planetTwinkle {
  0%, 100% {
    transform: scale(0.94);
    filter: brightness(0.85);
  }
  30% {
    transform: scale(1.12);
    filter: brightness(1.55) drop-shadow(0 0 20px rgba(216, 140, 255, 0.6));
  }
  48% {
    transform: scale(1);
    filter: brightness(1);
  }
  68% {
    transform: scale(1.18);
    filter: brightness(1.7) drop-shadow(0 0 26px rgba(216, 140, 255, 0.7));
  }
  86% {
    transform: scale(0.99);
    filter: brightness(0.95);
  }
}

@keyframes planetAura {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.07); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.35; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.25); }
}

@media (prefers-reduced-motion: reduce) {
  .planet::before,
  .planet-ring,
  .planet-star,
  .planet-spark {
    animation: none;
  }
}
</style>
