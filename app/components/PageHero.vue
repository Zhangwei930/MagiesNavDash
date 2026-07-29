<template>
  <header class="page-hero" :class="{ center, compact }">
    <div class="page-hero-glow" aria-hidden="true" />
    <div class="page-hero-inner" :class="{ narrow }">
      <p v-if="eyebrow" class="page-hero-eyebrow">{{ eyebrow }}</p>
      <h1 class="page-hero-title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p v-if="desc || $slots.desc" class="page-hero-desc">
        <slot name="desc">{{ desc }}</slot>
      </p>
      <div v-if="$slots.actions" class="page-hero-actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    desc?: string
    eyebrow?: string
    center?: boolean
    compact?: boolean
    narrow?: boolean
  }>(),
  {
    title: '',
    desc: '',
    eyebrow: '',
    center: true,
    compact: false,
    narrow: false
  }
)
</script>

<style scoped>
.page-hero {
  position: relative;
  padding: 36px 0 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.page-hero.compact {
  padding: 20px 0 0;
  margin-bottom: 4px;
}

.page-hero-glow {
  position: absolute;
  left: 50%;
  top: -40%;
  width: min(720px, 100%);
  height: 220px;
  transform: translateX(-50%);
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 40%, rgba(167, 139, 250, 0.28) 0%, transparent 60%),
    radial-gradient(ellipse at 30% 60%, rgba(56, 189, 248, 0.14) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 50%);
  filter: blur(4px);
}

.page-hero-inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.page-hero-inner.narrow {
  max-width: 560px;
}

.page-hero:not(.center) .page-hero-inner {
  margin: 0;
  max-width: none;
}

.page-hero.center {
  text-align: center;
}

.page-hero-eyebrow {
  display: inline-block;
  margin: 0 0 12px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--badge-text);
  background: var(--badge-bg);
  border: 1px solid rgba(167, 139, 250, 0.2);
}

.page-hero-title {
  margin: 0 0 12px;
  font-size: clamp(1.75rem, 3.6vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--text-heading);
  background: linear-gradient(105deg, #e2e8f0 0%, #c4b5fd 45%, #fdba74 100%);
  background-size: 180% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-hero-desc {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-muted);
}

.page-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.page-hero.center .page-hero-actions {
  justify-content: center;
}

.compact .page-hero-title {
  font-size: clamp(1.45rem, 3vw, 1.9rem);
}
</style>
