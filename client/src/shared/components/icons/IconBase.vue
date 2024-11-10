<script setup lang="ts">
interface Props {
  width?: number | string
  height?: number | string
  iconColor?: string
}

withDefaults(defineProps<Props>(), {
  width: 26,
  height: 26,
  iconColor: 'currentColor'
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 27 26"
    role="presentation"
  >
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template> 