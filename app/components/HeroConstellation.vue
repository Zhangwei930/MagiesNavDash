<template>
  <div class="constellation" aria-label="Featured products">
    <div class="const-ambient" aria-hidden="true">
      <span class="blob b1" />
      <span class="blob b2" />
      <span class="blob b3" />
      <span class="spark sp1" />
      <span class="spark sp2" />
      <span class="spark sp3" />
      <span class="spark sp4" />
    </div>

    <svg class="const-lines" viewBox="0 0 420 380" fill="none" aria-hidden="true">
      <path
        class="line"
        d="M118 92 C160 140, 200 150, 248 128"
      />
      <path
        class="line"
        d="M248 148 C230 190, 190 220, 150 248"
      />
      <path
        class="line"
        d="M168 268 C230 255, 280 230, 312 200"
      />
    </svg>

    <NuxtLink
      v-for="(item, i) in display"
      :key="item.key"
      class="const-card"
      :class="`pos-${i + 1}`"
      :to="item.to"
      :style="{ '--neon': item.color, '--delay': `${i * 0.35}s` }"
    >
      <span
        class="const-icon"
        :data-logo="item.logo ? '' : null"
        :data-logo-lg="item.logoLarge || null"
      >
        <img
          v-if="item.logo"
          class="const-logo"
          :class="{ 'const-logo-lg': item.logoLarge }"
          :src="item.logo"
          :alt="item.name"
          :width="item.logoLarge ? 30 : 22"
          :height="item.logoLarge ? 30 : 22"
          decoding="async"
        />
        <component v-else :is="item.icon" :size="18" :stroke-width="1.75" />
      </span>
      <div class="const-meta">
        <strong>{{ item.name }}</strong>
        <span>{{ item.short }}</span>
      </div>
      <span class="const-arrow" aria-hidden="true">→</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { type LucideIcon } from 'lucide-vue-next'
import { toolLogo, toolLogoIsLarge } from '~/utils/toolMeta'

export type ConstellationItem = {
  key: string
  name: string
  short?: string
  color: string
  icon?: LucideIcon
  logo?: string | null
  logoLarge?: boolean
  to: string
}

const props = defineProps<{
  items?: ConstellationItem[]
}>()

const FALLBACK: ConstellationItem[] = [
  {
    key: 'terminal',
    name: 'Terminal',
    short: 'Dev workspace',
    color: '#22d3ee',
    logo: toolLogo('magies-terminal'),
    to: '/products/magies-terminal'
  },
  {
    key: 'nav',
    name: 'Nav',
    short: 'Unified entry',
    color: '#60a5fa',
    logo: toolLogo('magies-nav'),
    logoLarge: toolLogoIsLarge('magies-nav'),
    to: '/products/magies-nav'
  },
  {
    key: 'office',
    name: 'Office',
    short: 'AI documents',
    color: '#f472b6',
    logo: toolLogo('magies-office'),
    logoLarge: toolLogoIsLarge('magies-office'),
    to: '/products/magies-office'
  },
  {
    key: 'studio',
    name: 'Data Studio',
    short: 'Collect & clean',
    color: '#a78bfa',
    logo: toolLogo('magies-data-studio'),
    logoLarge: toolLogoIsLarge('magies-data-studio'),
    to: '/products/magies-data-studio'
  }
]

function shortenName(name: string) {
  return name.replace(/^Magies\s+/i, '').trim() || name
}

const display = computed(() => {
  const src = props.items?.length ? props.items.slice(0, 4) : FALLBACK
  return src.map((item, i) => ({
    ...item,
    name: shortenName(item.name),
    short: item.short || FALLBACK[i]?.short || 'Explore'
  }))
})
</script>

<style scoped>
.constellation {
  position: relative;
  width: min(440px, 100%);
  height: min(400px, 72vw);
  margin: 0 auto;
  isolation: isolate;
}

/* Soft depth, no hard circle frame */
.const-ambient {
  position: absolute;
  inset: 6% 4%;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(36px);
  opacity: 0.75;
}

.blob.b1 {
  width: 58%;
  height: 48%;
  left: 18%;
  top: 22%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.45), transparent 70%);
}

.blob.b2 {
  width: 42%;
  height: 38%;
  right: 4%;
  top: 8%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.32), transparent 70%);
}

.blob.b3 {
  width: 40%;
  height: 36%;
  left: 8%;
  bottom: 10%;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.22), transparent 70%);
}

.spark {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px 2px rgba(196, 181, 253, 0.7);
  opacity: 0.55;
}

.spark.sp1 { left: 22%; top: 18%; }
.spark.sp2 { right: 18%; top: 36%; width: 2px; height: 2px; opacity: 0.4; }
.spark.sp3 { left: 42%; bottom: 22%; opacity: 0.5; }
.spark.sp4 { right: 28%; bottom: 30%; width: 2px; height: 2px; }

.const-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.55;
}

.const-lines .line {
  stroke: rgba(167, 139, 250, 0.28);
  stroke-width: 1;
  stroke-dasharray: 4 6;
  stroke-linecap: round;
}

.const-card {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 168px;
  max-width: 210px;
  padding: 12px 14px;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  background:
    linear-gradient(145deg, rgba(28, 30, 48, 0.88), rgba(12, 14, 24, 0.78));
  border: 1px solid color-mix(in srgb, var(--neon) 35%, rgba(255, 255, 255, 0.08));
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.38),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 0 28px color-mix(in srgb, var(--neon) 18%, transparent);
  backdrop-filter: blur(14px) saturate(1.2);
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  animation: cardFloat 5.5s ease-in-out infinite;
  animation-delay: var(--delay);
}

.const-card:hover {
  transform: translateY(-6px) scale(1.03);
  border-color: color-mix(in srgb, var(--neon) 55%, rgba(255, 255, 255, 0.2));
  box-shadow:
    0 22px 48px rgba(0, 0, 0, 0.45),
    0 0 36px color-mix(in srgb, var(--neon) 32%, transparent);
  z-index: 3;
}

.const-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: var(--neon);
  background:
    radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--neon) 35%, transparent), transparent 60%),
    rgba(8, 10, 18, 0.65);
  border: 1px solid color-mix(in srgb, var(--neon) 40%, transparent);
  box-shadow: 0 0 16px color-mix(in srgb, var(--neon) 22%, transparent);
}

.const-icon[data-logo] {
  background: rgba(8, 10, 18, 0.45);
  padding: 4px;
}

.const-icon[data-logo-lg] {
  width: 42px;
  height: 42px;
  padding: 5px;
}

.const-logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
  border-radius: 5px;
  display: block;
}

.const-logo-lg {
  width: 30px;
  height: 30px;
  border-radius: 6px;
}

.const-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.const-meta strong {
  font-size: 0.88rem;
  font-weight: 650;
  letter-spacing: -0.01em;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.const-meta span {
  font-size: 0.7rem;
  color: var(--text-muted, #94a3b8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.const-arrow {
  flex-shrink: 0;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--neon) 70%, #fff);
  opacity: 0.55;
  transition: opacity 0.2s, transform 0.2s;
}

.const-card:hover .const-arrow {
  opacity: 1;
  transform: translateX(2px);
}

/* Asymmetric constellation layout */
.pos-1 {
  top: 8%;
  left: 6%;
  z-index: 2;
}

.pos-2 {
  top: 18%;
  right: 2%;
  min-width: 150px;
  animation-duration: 6.2s;
}

.pos-3 {
  bottom: 18%;
  left: 2%;
  min-width: 156px;
  animation-duration: 5.8s;
}

.pos-4 {
  bottom: 10%;
  right: 6%;
  z-index: 2;
  animation-duration: 6.6s;
}

@keyframes cardFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

@media (max-width: 960px) {
  .constellation {
    height: 320px;
    max-width: 400px;
  }

  .const-card {
    min-width: 148px;
    padding: 10px 12px;
  }

  .const-meta strong {
    font-size: 0.82rem;
  }
}

@media (max-width: 560px) {
  .constellation {
    height: 300px;
  }

  .const-card {
    min-width: 136px;
    max-width: 170px;
    gap: 10px;
  }

  .const-icon {
    width: 32px;
    height: 32px;
    border-radius: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .const-card {
    animation: none;
  }

  .const-card:hover {
    transform: none;
  }
}
</style>
