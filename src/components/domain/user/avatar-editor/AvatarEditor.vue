<script lang="ts" setup>
import { useAvatarCropFlow } from './hooks/use-avatar-crop-flow';
import { Camera, Loading } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';

defineOptions({
  name: 'AvatarEditor',
});

const props = withDefaults(
  defineProps<{
    /** 当前头像 URL */
    avatar?: string | null;
    /** 头像展示尺寸（像素） */
    size?: number;
  }>(),
  {
    size: 72,
  }
);

const emit = defineEmits<{
  /** 文件上传至存储后触发，由调用方完成业务保存 */
  uploaded: [avatarUrl: string];
}>();

const avatarHovering = ref(false);

const editorStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));

const { avatarUploadRef, avatarUploading, avatarCropping, handleAvatarChange } = useAvatarCropFlow({
  showSuccessMessage: false,
  onAvatarUploaded: async (avatarUrl: string) => {
    emit('uploaded', avatarUrl);
  },
});
</script>

<template>
  <div
    :style="editorStyle"
    class="avatar-editor"
    @mouseenter="avatarHovering = true"
    @mouseleave="avatarHovering = false"
  >
    <el-avatar :size="size" :src="avatar || undefined" class="avatar-editor__preview" />
    <div v-show="avatarHovering && !avatarUploading && !avatarCropping" class="avatar-editor__mask">
      <el-icon :size="24"><Camera /></el-icon>
    </div>
    <div v-if="avatarUploading || avatarCropping" class="avatar-editor__loading">
      <el-icon :size="24" class="avatar-editor__loading-icon">
        <Loading />
      </el-icon>
    </div>
    <el-upload
      ref="avatarUploadRef"
      :auto-upload="false"
      :disabled="avatarUploading || avatarCropping"
      :show-file-list="false"
      accept="image/jpeg,image/png,image/webp"
      class="avatar-editor__upload"
      @change="handleAvatarChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.avatar-editor {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;

  &__preview {
    width: 100%;
    height: 100%;
  }

  &__mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--auth-text-anti);
    pointer-events: none;
    background: rgb(0 0 0 / 45%);
    border-radius: 50%;
  }

  &__loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    background: rgb(0 0 0 / 45%);
    border-radius: 50%;
  }

  &__loading-icon {
    color: var(--auth-text-anti);
    animation: avatar-editor-rotating 1.5s linear infinite;
  }

  &__upload {
    position: absolute;
    inset: 0;
    opacity: 0;

    :deep(.el-upload) {
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes avatar-editor-rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (hover: none) {
  .avatar-editor__mask {
    opacity: 0.85;
  }
}
</style>
