<template>
  <div class="eco" data-reveal aria-hidden="false">
    <div class="eco-glow" />
    <div class="eco-ring ring-a" />
    <div class="eco-ring ring-b" />
    <div class="eco-core">
      <img class="eco-logo" src="/brand/magies-logo-hero.png" alt="">
    </div>

    <div
      v-for="(node, i) in nodes"
      :key="node.key"
      class="eco-node"
      :style="nodeStyle(i)"
    >
      <span class="node-icon" :style="{ color: node.color, borderColor: node.color + '55' }">
        <component :is="node.icon" :size="16" :stroke-width="2" />
      </span>
      <div class="node-text">
        <strong>{{ node.name }}</strong>
        <span>{{ node.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Terminal,
  FileText,
  Database,
  Sparkles,
  Cloud,
  Boxes,
  Compass
} from 'lucide-vue-next'

const nodes = [
  { key: 'ai', name: 'Magies AI', desc: 'Intelligent Assistant', color: '#60a5fa', icon: Sparkles },
  { key: 'terminal', name: 'Magies Terminal', desc: 'Developer Tools', color: '#22d3ee', icon: Terminal },
  { key: 'studio', name: 'Magies Data Studio', desc: 'Data Collection', color: '#a78bfa', icon: Database },
  { key: 'pdf', name: 'Magies PDF', desc: 'Document Tools', color: '#f472b6', icon: FileText },
  { key: 'sdk', name: 'Magies SDK', desc: 'Developer SDKs', color: '#fb923c', icon: Boxes },
  { key: 'cloud', name: 'Magies Cloud', desc: 'Cloud Services', color: '#38bdf8', icon: Cloud },
  { key: 'nav', name: 'Magies Nav', desc: 'Unified Entry', color: '#818cf8', icon: Compass }
]

function nodeStyle(i: number) {
  const n = nodes.length
  const angle = (i / n) * Math.PI * 2 - Math.PI / 2
  const x = 50 + Math.cos(angle) * 38
  const y = 50 + Math.sin(angle) * 38
  return {
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${i * 0.12}s`
  }
}
</script>

<style scoped>
.eco {
  position: relative;
  width: min(460px, 100%);
  aspect-ratio: 1;
  margin: 0 auto;
}

.eco-glow {
  position: absolute;
  inset: 22%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(167, 139, 250, 0.35) 0%, transparent 65%),
    radial-gradient(circle at 30% 40%, rgba(56, 189, 248, 0.25) 0%, transparent 55%);
  filter: blur(20px);
  animation: glowPulse 5s ease-in-out infinite;
}

.eco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(167, 139, 250, 0.22);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.ring-a {
  width: 72%;
  height: 72%;
  box-shadow:
    0 0 30px rgba(96, 165, 250, 0.12),
    inset 0 0 30px rgba(167, 139, 250, 0.08);
  animation: ringRotate 30s linear infinite;
}

.ring-b {
  width: 48%;
  height: 48%;
  border-style: dashed;
  border-color: rgba(251, 146, 60, 0.22);
  animation: ringRotate 40s linear infinite reverse;
}

.eco-core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 96px;
  height: 96px;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  z-index: 2;
}

.eco-logo {
  width: 124px;
  max-width: none;
  height: 124px;
  object-fit: contain;
  mix-blend-mode: screen;
  -webkit-mask-image: radial-gradient(circle, #000 0 49%, rgba(0, 0, 0, 0.88) 52%, transparent 57%);
  mask-image: radial-gradient(circle, #000 0 49%, rgba(0, 0, 0, 0.88) 52%, transparent 57%);
  filter:
    saturate(1.08)
    drop-shadow(0 0 16px rgba(96, 165, 250, 0.3))
    drop-shadow(0 0 20px rgba(217, 70, 239, 0.22));
  animation: corePulse 2.6s ease-in-out infinite;
}

.eco-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 8px;
  border-radius: 14px;
  background: rgba(10, 12, 20, 0.78);
  border: 1px solid rgba(167, 139, 250, 0.18);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
  min-width: 148px;
  z-index: 3;
  animation: nodeFloat 4.5s ease-in-out infinite;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.eco-node:hover {
  border-color: rgba(167, 139, 250, 0.45);
  box-shadow:
    0 14px 36px rgba(0, 0, 0, 0.4),
    0 0 24px rgba(167, 139, 250, 0.18);
  z-index: 4;
}

.node-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid;
  box-shadow: 0 0 14px color-mix(in srgb, currentColor 25%, transparent);
}

.node-text {
  display: grid;
  gap: 1px;
  min-width: 0;
}

.node-text strong {
  font-size: 0.72rem;
  color: #f1f5f9;
  font-weight: 700;
  white-space: nowrap;
}

.node-text span {
  font-size: 0.62rem;
  color: #94a3b8;
  white-space: nowrap;
}

@keyframes ringRotate {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes corePulse {
  0%,
  100% {
    transform: scale(0.92);
  }
  50% {
    transform: scale(1.15);
  }
}

@keyframes nodeFloat {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -6px;
  }
}

@media (max-width: 640px) {
  .eco {
    width: 100%;
    max-width: 360px;
  }

  .eco-node {
    min-width: 0;
    padding: 6px;
    gap: 0;
  }

  .node-text {
    display: none;
  }

  .node-icon {
    width: 36px;
    height: 36px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .eco-glow,
  .eco-ring,
  .eco-logo,
  .eco-node {
    animation: none !important;
  }
}
</style>
