<template>
  <svg
    class="mark"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <!-- Endpoints sit on the circle's own extent along the diagonal, so the
           first and last stops actually land on the stroke instead of off-shape. -->
      <linearGradient :id="`${uid}-ring`" x1="16.5" y1="46.2" x2="47.5" y2="17.8" gradientUnits="userSpaceOnUse">
        <stop stop-color="#38bdf8" />
        <stop offset="0.22" stop-color="#60a5fa" />
        <stop offset="0.48" stop-color="#a78bfa" />
        <stop offset="0.68" stop-color="#e879f9" />
        <stop offset="1" stop-color="#fb923c" />
      </linearGradient>

      <radialGradient :id="`${uid}-star`" cx="0.5" cy="0.42" r="0.6">
        <stop stop-color="#ffffff" />
        <stop offset="0.35" stop-color="#ede9fe" />
        <stop offset="1" stop-color="#a78bfa" />
      </radialGradient>

      <radialGradient :id="`${uid}-flare`" cx="0.5" cy="0.5" r="0.5">
        <stop stop-color="#f5f3ff" stop-opacity="0.6" />
        <stop offset="0.45" stop-color="#e9d5ff" stop-opacity="0.32" />
        <stop offset="1" stop-color="#e9d5ff" stop-opacity="0" />
      </radialGradient>

      <filter :id="`${uid}-bloom`" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.4" />
      </filter>

      <!-- unit 4-point sparkle, scaled per instance -->
      <path
        :id="`${uid}-spark`"
        d="M0-1C.12-.35.35-.12 1 0 .35.12.12.35 0 1-.12.35-.35.12-1 0-.35-.12-.12-.35 0-1Z"
      />
    </defs>

    <!-- neon bloom: blurred copy under the crisp geometry -->
    <g :filter="`url(#${uid}-bloom)`" opacity="0.85">
      <circle cx="32" cy="32" r="21" :stroke="`url(#${uid}-ring)`" stroke-width="3.2" />
      <path :d="STAR" :fill="`url(#${uid}-star)`" />
    </g>

    <!-- ring -->
    <circle
      class="mark-ring"
      cx="32"
      cy="32"
      r="21"
      :stroke="`url(#${uid}-ring)`"
      stroke-width="2.4"
    />
    <circle cx="32" cy="32" r="21" stroke="#ffffff" stroke-width="0.7" opacity="0.42" />

    <!-- centre star + cross flare (flare fades out toward the ring) -->
    <path
      d="M32 17v30M17 32h30"
      :stroke="`url(#${uid}-flare)`"
      stroke-width="0.8"
      stroke-linecap="round"
    />
    <path :d="STAR" :fill="`url(#${uid}-star)`" />

    <!-- satellite sparkles: dropped at small sizes where they'd turn to mush -->
    <g v-if="detail" class="mark-sparks" fill="#dbeafe">
      <use :href="`#${uid}-spark`" transform="translate(55.5 14) scale(3)" fill="#fdba74" />
      <use :href="`#${uid}-spark`" transform="translate(9.5 21) scale(2.4)" fill="#93c5fd" />
      <use :href="`#${uid}-spark`" transform="translate(53 51) scale(2)" fill="#e9d5ff" />
      <use :href="`#${uid}-spark`" transform="translate(13 53) scale(1.7)" />
      <circle cx="47" cy="7" r="0.9" opacity="0.7" />
      <circle cx="6" cy="40" r="0.7" opacity="0.55" />
      <circle cx="58" cy="38" r="0.75" opacity="0.6" />
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ detail?: boolean }>(), { detail: false })

/** Unique per instance so gradient/filter ids never collide across mounted marks. */
const uid = useId()

/** 4-point sparkle, centred at 32,32 with 9u reach — leaves air inside the r=21 ring. */
const STAR =
  'M32 23C32.57 28.56 35.44 31.43 41 32C35.44 32.57 32.57 35.44 32 41C31.43 35.44 28.56 32.57 23 32C28.56 31.43 31.43 28.56 32 23Z'
</script>

<style scoped>
.mark {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
