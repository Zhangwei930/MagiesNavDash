<template>
  <div class="galaxy" aria-hidden="true">
    <!-- 1. 银河背景：星尘带 + 深空 -->
    <div class="mw-void" />
    <div class="mw-band band-a" />
    <div class="mw-band band-b" />
    <div class="mw-dust" />
    <span
      v-for="i in 40"
      :key="'s' + i"
      class="mw-star"
      :style="fieldStar(i)"
    />

    <!-- 2. 星系：旋臂盘面 -->
    <div class="disc">
      <div class="disc-glow" />
      <div class="disc-plane" />
      <div class="arm arm-1" />
      <div class="arm arm-2" />
      <div class="arm arm-3" />
      <div class="disc-haze" />
    </div>

    <!-- 轨道环（实体细轨，非虚线框） -->
    <div class="orbit-rail rail-outer" />
    <div class="orbit-rail rail-mid" />
    <div class="orbit-rail rail-inner" />

    <!-- 3. 沿轨道公转 + 闪耀 -->
    <div class="sat-path path-outer">
      <span class="sat sat-lg">
        <i class="sat-glow" />
        <i class="sat-body" />
        <i class="sat-spark s1" />
        <i class="sat-spark s2" />
        <i class="sat-spark s3" />
        <i class="sat-spark s4" />
      </span>
    </div>
    <div class="sat-path path-mid">
      <span class="sat sat-md">
        <i class="sat-glow" />
        <i class="sat-body warm" />
        <i class="sat-spark s1" />
        <i class="sat-spark s2" />
        <i class="sat-spark s3" />
      </span>
    </div>
    <div class="sat-path path-inner">
      <span class="sat sat-sm">
        <i class="sat-glow" />
        <i class="sat-body cool" />
        <i class="sat-spark s1" />
        <i class="sat-spark s2" />
      </span>
    </div>
    <!-- 相位错开的第二组，更丰满 -->
    <div class="sat-path path-outer delay">
      <span class="sat sat-xs">
        <i class="sat-glow" />
        <i class="sat-body cool" />
        <i class="sat-spark s1" />
      </span>
    </div>
    <div class="sat-path path-mid delay">
      <span class="sat sat-xs">
        <i class="sat-glow" />
        <i class="sat-body" />
        <i class="sat-spark s1" />
        <i class="sat-spark s2" />
      </span>
    </div>

    <!-- 星系核心：超亮星核 -->
    <div class="core">
      <span class="core-bloom" />
      <span class="core-disk" />
      <span class="core-flare h" />
      <span class="core-flare v" />
      <span class="core-star" />
    </div>
  </div>
</template>

<script setup lang="ts">
/** 银河背景星点：伪随机但稳定 */
function fieldStar(i: number) {
  const seed = i * 97
  const x = (seed * 13) % 100
  const y = (seed * 29) % 100
  const size = 0.8 + ((seed * 7) % 18) / 10
  const hues = ['#fff', '#e0e7ff', '#c4b5fd', '#93c5fd', '#fde68a', '#fbcfe8']
  const delay = ((seed * 3) % 40) / 10
  const dur = 2.2 + ((seed * 5) % 30) / 10
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: hues[i % hues.length],
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
    opacity: 0.35 + ((seed * 11) % 50) / 100
  }
}
</script>

<style scoped>
.galaxy {
  position: relative;
  width: min(560px, 94vw);
  height: min(560px, 94vw);
  margin: 0 auto;
  isolation: isolate;
  border-radius: 50%;
  overflow: hidden;
  filter: drop-shadow(0 0 60px rgba(129, 140, 248, 0.28));
}

/* ========== 1. 银河 ========== */
.mw-void {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 48%, #1a1035 0%, #0a0818 42%, #03040a 72%, #000 100%);
}

/* 对角银河带 */
.mw-band {
  position: absolute;
  inset: -10%;
  border-radius: 50%;
  pointer-events: none;
}

.band-a {
  background: linear-gradient(
    128deg,
    transparent 28%,
    rgba(96, 165, 250, 0.06) 38%,
    rgba(196, 181, 253, 0.18) 48%,
    rgba(255, 255, 255, 0.14) 50%,
    rgba(251, 146, 60, 0.12) 54%,
    rgba(244, 114, 182, 0.08) 60%,
    transparent 72%
  );
  filter: blur(6px);
  animation: bandDrift 28s ease-in-out infinite alternate;
}

.band-b {
  background: linear-gradient(
    128deg,
    transparent 34%,
    rgba(129, 140, 248, 0.1) 44%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(167, 139, 250, 0.1) 56%,
    transparent 68%
  );
  filter: blur(14px);
  opacity: 0.85;
  animation: bandDrift 36s ease-in-out infinite alternate-reverse;
}

.mw-dust {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-image:
    radial-gradient(1px 1px at 12% 20%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1.2px 1.2px at 30% 55%, rgba(196, 181, 253, 0.65), transparent),
    radial-gradient(1px 1px at 48% 32%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1.4px 1.4px at 62% 70%, rgba(251, 146, 60, 0.45), transparent),
    radial-gradient(1px 1px at 78% 28%, rgba(96, 165, 250, 0.6), transparent),
    radial-gradient(1px 1px at 88% 60%, rgba(244, 114, 182, 0.4), transparent),
    radial-gradient(1.2px 1.2px at 22% 78%, rgba(255, 255, 255, 0.45), transparent),
    radial-gradient(1px 1px at 55% 88%, rgba(167, 139, 250, 0.5), transparent);
  opacity: 0.85;
  animation: dustBreathe 12s ease-in-out infinite alternate;
}

.mw-star {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px currentColor;
  animation: twinkle ease-in-out infinite;
  pointer-events: none;
}

/* ========== 2. 星系盘 ========== */
.disc {
  position: absolute;
  inset: 14%;
  border-radius: 50%;
  z-index: 1;
}

.disc-glow {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(196, 181, 253, 0.25) 18%, rgba(96, 165, 250, 0.12) 40%, transparent 68%);
  filter: blur(8px);
  animation: coreAura 5s ease-in-out infinite;
}

.disc-plane {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse 100% 70% at 50% 50%,
    rgba(167, 139, 250, 0.18) 0%,
    rgba(96, 165, 250, 0.1) 35%,
    rgba(251, 146, 60, 0.06) 55%,
    transparent 75%
  );
  transform: rotateX(58deg) scale(1.15);
  transform-style: preserve-3d;
  animation: discSpin 48s linear infinite;
  filter: blur(0.5px);
}

.arm {
  position: absolute;
  inset: 5%;
  border-radius: 50%;
  transform: rotateX(58deg) scale(1.2);
  opacity: 0.75;
  animation: discSpin 48s linear infinite;
  pointer-events: none;
}

.arm-1 {
  background: conic-gradient(
    from 20deg,
    transparent 0deg,
    rgba(96, 165, 250, 0.35) 25deg,
    transparent 55deg,
    transparent 180deg,
    rgba(167, 139, 250, 0.3) 205deg,
    transparent 240deg,
    transparent 360deg
  );
  filter: blur(3px);
}

.arm-2 {
  animation-duration: 56s;
  animation-direction: reverse;
  background: conic-gradient(
    from 100deg,
    transparent 0deg,
    rgba(251, 146, 60, 0.22) 30deg,
    transparent 60deg,
    transparent 200deg,
    rgba(244, 114, 182, 0.2) 230deg,
    transparent 265deg,
    transparent 360deg
  );
  filter: blur(4px);
  opacity: 0.65;
}

.arm-3 {
  animation-duration: 64s;
  background: conic-gradient(
    from 280deg,
    transparent 0deg,
    rgba(255, 255, 255, 0.12) 18deg,
    transparent 40deg,
    transparent 160deg,
    rgba(129, 140, 248, 0.18) 185deg,
    transparent 210deg,
    transparent 360deg
  );
  filter: blur(2px);
  opacity: 0.7;
}

.disc-haze {
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 55%
  );
  animation: coreAura 6s ease-in-out infinite reverse;
}

/* 轨道细轨 */
.orbit-rail {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(196, 181, 253, 0.18);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
  box-shadow: 0 0 16px rgba(129, 140, 248, 0.08);
}

.rail-outer {
  width: 88%;
  height: 88%;
  border-color: rgba(147, 197, 253, 0.22);
  box-shadow:
    0 0 20px rgba(96, 165, 250, 0.1),
    inset 0 0 20px rgba(96, 165, 250, 0.05);
}

.rail-mid {
  width: 68%;
  height: 68%;
  border-color: rgba(196, 181, 253, 0.2);
}

.rail-inner {
  width: 48%;
  height: 48%;
  border-color: rgba(251, 191, 36, 0.16);
}

/* ========== 3. 轨道卫星 + 闪耀 ========== */
.sat-path {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
}

.path-outer {
  width: 88%;
  height: 88%;
  animation: orbitSpin 18s linear infinite;
}

.path-mid {
  width: 68%;
  height: 68%;
  animation: orbitSpin 12s linear infinite reverse;
}

.path-inner {
  width: 48%;
  height: 48%;
  animation: orbitSpin 8s linear infinite;
}

.path-outer.delay {
  animation-duration: 26s;
  animation-delay: -9s;
}

.path-mid.delay {
  animation-duration: 16s;
  animation-delay: -5s;
}

/* 卫星挂在轨道顶部，随父级旋转 */
.sat {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
}

.sat-lg {
  width: 18px;
  height: 18px;
}

.sat-md {
  width: 14px;
  height: 14px;
  /* 错开相位：放在轨道另一侧 */
  top: auto;
  bottom: 0;
}

.sat-sm {
  width: 11px;
  height: 11px;
  left: auto;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
}

.sat-xs {
  width: 8px;
  height: 8px;
}

.path-outer.delay .sat-xs {
  top: auto;
  bottom: 0;
  left: 18%;
  transform: translate(-50%, 50%);
}

.path-mid.delay .sat-xs {
  left: auto;
  right: 0;
  top: 28%;
  transform: translate(50%, -50%);
}

.sat-body {
  display: block;
  width: 55%;
  height: 55%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff 0%, #e9d5ff 30%, #a78bfa 70%, #6366f1 100%);
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.95),
    0 0 22px rgba(167, 139, 250, 0.85),
    0 0 36px rgba(96, 165, 250, 0.45);
  animation: bodyPulse 2.2s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.sat-body.warm {
  background: radial-gradient(circle at 35% 30%, #fff 0%, #fde68a 35%, #fb923c 75%, #ea580c 100%);
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.9),
    0 0 22px rgba(251, 146, 60, 0.85),
    0 0 34px rgba(244, 114, 182, 0.4);
}

.sat-body.cool {
  background: radial-gradient(circle at 35% 30%, #fff 0%, #a5f3fc 35%, #38bdf8 75%, #0284c7 100%);
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.9),
    0 0 20px rgba(56, 189, 248, 0.85),
    0 0 32px rgba(34, 211, 238, 0.4);
}

.sat-glow {
  position: absolute;
  inset: -80%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, rgba(167, 139, 250, 0.2) 40%, transparent 70%);
  animation: glowPulse 2.2s ease-in-out infinite;
  z-index: 1;
}

/* 四向星芒闪耀 */
.sat-spark {
  position: absolute;
  left: 50%;
  top: 50%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.95),
    transparent
  );
  transform-origin: center;
  z-index: 3;
  animation: sparkFlash 1.8s ease-in-out infinite;
}

.sat-spark.s1 {
  width: 220%;
  height: 1.5px;
  transform: translate(-50%, -50%);
}

.sat-spark.s2 {
  width: 1.5px;
  height: 220%;
  transform: translate(-50%, -50%);
  background: linear-gradient(
    180deg,
    transparent,
    rgba(255, 255, 255, 0.95),
    transparent
  );
  animation-delay: 0.15s;
}

.sat-spark.s3 {
  width: 160%;
  height: 1px;
  transform: translate(-50%, -50%) rotate(45deg);
  opacity: 0.7;
  animation-delay: 0.3s;
}

.sat-spark.s4 {
  width: 160%;
  height: 1px;
  transform: translate(-50%, -50%) rotate(-45deg);
  opacity: 0.7;
  animation-delay: 0.45s;
}

.sat-sm .sat-spark.s1,
.sat-xs .sat-spark.s1 {
  width: 180%;
}

/* ========== 核心 ========== */
.core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 28%;
  height: 28%;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  z-index: 5;
}

.core-bloom {
  position: absolute;
  inset: -20%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.55) 0%,
    rgba(196, 181, 253, 0.35) 28%,
    rgba(96, 165, 250, 0.15) 50%,
    transparent 70%
  );
  filter: blur(6px);
  animation: coreAura 3.2s ease-in-out infinite;
}

.core-disk {
  position: absolute;
  inset: 22%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(167, 139, 250, 0.2) 45%,
    transparent 70%
  );
}

.core-star {
  width: 18%;
  height: 18%;
  min-width: 12px;
  min-height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #e9d5ff 28%, #a78bfa 60%, transparent 100%);
  box-shadow:
    0 0 20px rgba(255, 255, 255, 1),
    0 0 48px rgba(196, 181, 253, 0.95),
    0 0 90px rgba(167, 139, 250, 0.7),
    0 0 130px rgba(96, 165, 250, 0.35);
  animation: starPulse 2.6s ease-in-out infinite;
  z-index: 3;
}

.core-flare {
  position: absolute;
  left: 50%;
  top: 50%;
  animation: flareBreathe 2.8s ease-in-out infinite;
}

.core-flare.h {
  width: 180%;
  height: 2px;
  transform: translate(-50%, -50%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(96, 165, 250, 0.5),
    rgba(255, 255, 255, 0.95),
    rgba(251, 146, 60, 0.7),
    transparent
  );
  box-shadow: 0 0 16px rgba(196, 181, 253, 0.85);
}

.core-flare.v {
  width: 2px;
  height: 180%;
  transform: translate(-50%, -50%);
  background: linear-gradient(
    180deg,
    transparent,
    rgba(167, 139, 250, 0.5),
    rgba(255, 255, 255, 0.95),
    rgba(244, 114, 182, 0.55),
    transparent
  );
  box-shadow: 0 0 16px rgba(96, 165, 250, 0.75);
  animation-delay: 0.3s;
}

/* keyframes */
@keyframes orbitSpin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes discSpin {
  to {
    transform: rotateX(58deg) scale(1.15) rotate(360deg);
  }
}

@keyframes bandDrift {
  from {
    transform: rotate(-2deg) scale(1);
    opacity: 0.75;
  }
  to {
    transform: rotate(3deg) scale(1.04);
    opacity: 1;
  }
}

@keyframes dustBreathe {
  from {
    opacity: 0.55;
  }
  to {
    opacity: 0.95;
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(0.75);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.35);
  }
}

@keyframes coreAura {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(0.96);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
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
    filter: brightness(1.55);
  }
  70% {
    transform: scale(1.05);
    filter: brightness(1.15);
  }
}

@keyframes flareBreathe {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}

@keyframes bodyPulse {
  0%,
  100% {
    transform: scale(0.92);
    filter: brightness(0.95);
  }
  50% {
    transform: scale(1.12);
    filter: brightness(1.35);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

@keyframes sparkFlash {
  0%,
  100% {
    opacity: 0.25;
    filter: brightness(0.8);
  }
  40% {
    opacity: 1;
    filter: brightness(1.6);
  }
  70% {
    opacity: 0.5;
    filter: brightness(1.1);
  }
}

/* discSpin for arms needs matching transform base */
.arm-1,
.arm-2,
.arm-3 {
  animation-name: armSpin;
}

@keyframes armSpin {
  to {
    transform: rotateX(58deg) scale(1.2) rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mw-band,
  .mw-dust,
  .mw-star,
  .disc-plane,
  .arm,
  .disc-glow,
  .disc-haze,
  .sat-path,
  .core-bloom,
  .core-star,
  .core-flare,
  .sat-body,
  .sat-glow,
  .sat-spark {
    animation: none !important;
  }
}
</style>
