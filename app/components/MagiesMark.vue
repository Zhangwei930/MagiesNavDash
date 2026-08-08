<template>
  <img
    class="mark"
    :src="src"
    :width="detail ? 256 : 128"
    :height="detail ? 256 : 128"
    alt=""
    aria-hidden="true"
    decoding="async"
  >
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ detail?: boolean }>(), { detail: false })

/** Same full-art framing at every size; the small file is a 2x render so the
    dust stays resolved rather than aliasing at nav size. */
const src = computed(() =>
  props.detail ? '/brand/logo-mark-256.png' : '/brand/logo-mark-128.png'
)
</script>

<style scoped>
.mark {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
