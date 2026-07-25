<template>
  <div class="planet" aria-hidden="true">
    <div class="planet-orbit planet-orbit-a" />
    <div class="planet-orbit planet-orbit-b" />
    <div class="planet-core">
      <img src="/brand/logo-dark-256.png" width="256" height="256" alt="" decoding="async" fetchpriority="high" />
    </div>
    <span class="planet-spark s1" />
    <span class="planet-spark s2" />
    <span class="planet-spark s3" />
    <span class="planet-spark s4" />
  </div>
</template>

<style scoped>
.planet {
  position: relative;
  width: min(280px, 68vw);
  height: min(280px, 68vw);
  margin: 0 auto;
  perspective: 900px;
}

.planet-core {
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.08), transparent 55%);
  box-shadow:
    0 0 40px rgba(167, 139, 250, 0.35),
    0 0 80px rgba(96, 165, 250, 0.2),
    inset 0 0 30px rgba(167, 139, 250, 0.15);
  animation: planetSpin 18s linear infinite;
  z-index: 2;
}

.planet-core img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transform: scale(1.08);
}

.planet-orbit {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  border: 1.5px solid transparent;
  border-top-color: rgba(96, 165, 250, 0.85);
  border-right-color: rgba(167, 139, 250, 0.55);
  border-bottom-color: rgba(251, 146, 60, 0.75);
  border-left-color: rgba(244, 114, 182, 0.45);
  transform-style: preserve-3d;
  pointer-events: none;
  z-index: 1;
}

.planet-orbit-a {
  width: 92%;
  height: 92%;
  margin: -46% 0 0 -46%;
  transform: rotateX(68deg) rotateZ(0deg);
  animation: orbitA 10s linear infinite;
  box-shadow: 0 0 18px rgba(167, 139, 250, 0.25);
}

.planet-orbit-b {
  width: 78%;
  height: 78%;
  margin: -39% 0 0 -39%;
  transform: rotateX(68deg) rotateZ(40deg);
  opacity: 0.55;
  animation: orbitB 14s linear infinite reverse;
  border-width: 1px;
}

.planet-spark {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px #c4b5fd, 0 0 18px #60a5fa;
  z-index: 3;
  animation: twinkle 2.8s ease-in-out infinite;
}

.s1 { top: 12%; left: 22%; }
.s2 { top: 18%; right: 16%; animation-delay: 0.7s; background: #fdba74; box-shadow: 0 0 10px #fb923c; }
.s3 { bottom: 20%; left: 14%; animation-delay: 1.2s; background: #93c5fd; }
.s4 { bottom: 14%; right: 20%; animation-delay: 1.8s; }

@keyframes planetSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes orbitA {
  from { transform: rotateX(68deg) rotateZ(0deg); }
  to { transform: rotateX(68deg) rotateZ(360deg); }
}

@keyframes orbitB {
  from { transform: rotateX(68deg) rotateZ(40deg); }
  to { transform: rotateX(68deg) rotateZ(400deg); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.35; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.25); }
}

@media (prefers-reduced-motion: reduce) {
  .planet-core,
  .planet-orbit-a,
  .planet-orbit-b,
  .planet-spark {
    animation: none;
  }
}
</style>
