<template>
  <span
    class="brand-logo"
    :class="[`size-${size}`, { stacked, glow }]"
    :aria-label="showWordmark ? 'Magies' : 'Magies logo'"
  >
    <span class="brand-logo-mark-wrap">
      <MagiesMark :detail="detail" />
    </span>
    <span v-if="showWordmark" class="brand-logo-word">
      <span class="brand-logo-name">MAGIES</span>
      <span v-if="tagline" class="brand-logo-tag">{{ tagline }}</span>
    </span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'nav' | 'lg' | 'xl'
    showWordmark?: boolean
    tagline?: string
    stacked?: boolean
    glow?: boolean
  }>(),
  {
    size: 'md',
    showWordmark: true,
    tagline: '',
    stacked: false,
    glow: false
  }
)

/** Satellite sparkles only read as sparkles above ~56px. */
const detail = computed(() => props.size === 'lg' || props.size === 'xl')
</script>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: inherit;
}

.brand-logo.stacked {
  flex-direction: column;
  gap: 18px;
  text-align: center;
}

.brand-logo-mark-wrap {
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

/* Ambient halo — only on the hero/feature mark, never on nav or footer chrome
   (stacking a CSS glow behind the SVG's own bloom is what made it look foggy). */
.brand-logo.glow .brand-logo-mark-wrap::before {
  content: "";
  position: absolute;
  inset: -30%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, transparent 62%),
    radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 55%),
    radial-gradient(circle at 70% 55%, rgba(249, 115, 22, 0.16) 0%, transparent 55%);
  filter: blur(14px);
  z-index: 0;
  pointer-events: none;
  animation: logoAura 6s ease-in-out infinite;
}

.brand-logo-mark-wrap :deep(.mark) {
  position: relative;
  z-index: 1;
}

.size-sm .brand-logo-mark-wrap {
  width: 30px;
  height: 30px;
}
.size-md .brand-logo-mark-wrap {
  width: 36px;
  height: 36px;
}
.size-nav .brand-logo-mark-wrap {
  width: 40px;
  height: 40px;
}
.size-lg .brand-logo-mark-wrap {
  width: 72px;
  height: 72px;
}
.size-xl .brand-logo-mark-wrap {
  width: 120px;
  height: 120px;
}

.brand-logo.size-nav {
  gap: 12px;
}
.brand-logo.size-nav .brand-logo-name {
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  font-weight: 800;
}

.brand-logo-word {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.05;
}

.brand-logo-name {
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--text-heading, #f8fafc);
  font-size: 0.98rem;
}

.size-sm .brand-logo-name {
  font-size: 0.9rem;
  letter-spacing: 0.14em;
}

.size-lg .brand-logo-name,
.size-xl .brand-logo-name {
  font-size: clamp(1.75rem, 4.4vw, 2.7rem);
  letter-spacing: 0.22em;
}

.brand-logo-tag {
  margin-top: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--text-muted, #94a3b8);
}

.stacked .brand-logo-name {
  background: linear-gradient(
    105deg,
    #93c5fd 0%,
    #c4b5fd 28%,
    #ffffff 48%,
    #f0abfc 58%,
    #fdba74 78%,
    #93c5fd 100%
  );
  background-size: 240% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: wordShimmer 8s ease-in-out infinite;
  filter: drop-shadow(0 0 18px rgba(168, 85, 247, 0.35));
}

@keyframes wordShimmer {
  0%,
  15% {
    background-position: 100% 0;
  }
  70%,
  100% {
    background-position: 0% 0;
  }
}

@keyframes logoAura {
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

@media (prefers-reduced-motion: reduce) {
  .stacked .brand-logo-name,
  .brand-logo.glow .brand-logo-mark-wrap::before {
    animation: none;
  }
}
</style>
