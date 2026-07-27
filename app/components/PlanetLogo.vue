<template>
  <div class="planet" aria-hidden="true">
    <img src="/brand/logo-mark-512.png" width="512" height="512" alt="" decoding="async" fetchpriority="high">
  </div>
</template>

<style scoped>
/* The mark render already carries its own orbit ring, dust and sparkles, so this
   only supplies the ambient halo and a slow breath — the old CSS orbits doubled
   up on the artwork and the circular crop clipped its outer dust. */
.planet {
  position: relative;
  width: min(320px, 74vw);
  height: min(320px, 74vw);
  margin: 0 auto;
  display: grid;
  place-items: center;
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
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: planetBreath 7s ease-in-out infinite;
}

@keyframes planetAura {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.07);
  }
}

@keyframes planetBreath {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

@media (prefers-reduced-motion: reduce) {
  .planet::before,
  .planet img {
    animation: none;
  }
}
</style>
