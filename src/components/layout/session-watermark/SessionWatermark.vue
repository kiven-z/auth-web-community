<script lang="ts" setup>
import { buildWatermarkDataUrl, useSessionWatermark } from './hooks/use-session-watermark';
import { computed } from 'vue';

defineOptions({
  name: 'SessionWatermark',
});

const { watermarkLines, watermarkColor, watermarkVisible } = useSessionWatermark();

/** 平铺背景，不包裹路由树，避免 MutationObserver 与 Transition 抢 DOM */
const watermarkStyle = computed(() => {
  const backgroundImage = buildWatermarkDataUrl(watermarkLines.value, watermarkColor.value);
  return backgroundImage ? { backgroundImage } : undefined;
});
</script>

<template>
  <div v-if="watermarkVisible && watermarkStyle" :style="watermarkStyle" aria-hidden="true" class="session-watermark" />
</template>

<style scoped>
.session-watermark {
  position: fixed;
  inset: 0;
  z-index: 1500;
  pointer-events: none;
  background-repeat: repeat;
}
</style>
