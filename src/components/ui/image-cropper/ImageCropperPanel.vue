<script lang="ts" setup>
import 'cropperjs/dist/cropper.css';
import { computed, unref } from 'vue';
import { useCropper } from 'vue-picture-cropper';
import 'vue-picture-cropper/style.css';
import type { ImageCropperPanelExpose, ImageCropperPanelProps } from './types';

defineOptions({
  name: 'ImageCropperPanel',
});

const props = withDefaults(defineProps<ImageCropperPanelProps>(), {
  aspectRatio: 1,
  exportSize: 512,
  maxHeight: '420px',
  loading: false,
});

const cropperConfig = computed(() => ({
  img: props.imageUrl,
  boxStyle: {
    width: '100%',
    maxHeight: props.maxHeight,
    backgroundColor: 'var(--auth-bg-secondary)',
  },
  options: {
    viewMode: 1,
    dragMode: 'move' as const,
    autoCropArea: 1,
    background: false,
    guides: true,
    movable: true,
    zoomable: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    responsive: true,
    ...props.cropOptions,
    aspectRatio: props.aspectRatio,
  },
}));

// vue-picture-cropper 将 useCropper 参数收窄为 WritableComputedRef，运行时 ComputedRef 可正常工作
const [CropperComponent, cropperApi] = useCropper(cropperConfig as Parameters<typeof useCropper>[0]);

const isLoading = computed(() => unref(props.loading));

/**
 * 获取裁剪后的图片 Blob
 * @returns 裁剪结果，失败时返回 `null`
 */
async function getCroppedBlob(): Promise<Blob | null> {
  const exportHeight = Math.round(props.exportSize / props.aspectRatio);
  return cropperApi.getBlob({
    width: props.exportSize,
    height: exportHeight,
    imageSmoothingQuality: 'high',
  });
}

/**
 * 重置裁剪区域
 */
function resetCropper(): void {
  cropperApi.reset();
}

defineExpose<ImageCropperPanelExpose>({
  getCroppedBlob,
  resetCropper,
});
</script>

<template>
  <div v-loading="isLoading" class="image-cropper-panel">
    <div class="image-cropper-panel__content">
      <component :is="CropperComponent" v-if="imageUrl" />
      <el-empty v-else :description="labels.empty" />

      <el-text type="info">{{ labels.hint }}</el-text>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-cropper-panel {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
