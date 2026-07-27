<template>
  <img
    class="mark"
    :src="src"
    :width="detail ? 256 : 64"
    :height="detail ? 256 : 64"
    alt=""
    aria-hidden="true"
    decoding="async"
  >
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ detail?: boolean }>(), { detail: false })

/**
 * Two renders of the same mark: the small one is cropped to the ring, because
 * the full art's outer dust turns to noise below ~56px.
 */
const src = computed(() =>
  props.detail ? '/brand/logo-mark-256.png' : '/brand/logo-mark-64.png'
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
