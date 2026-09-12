<script lang="ts" setup>
import { computed } from 'vue';

defineOptions({
  name: 'UserAvatar',
});

const props = withDefaults(
  defineProps<{
    /** 头像 URL；空则展示 name 首字 */
    avatar?: string | null;
    /** 展示名（昵称或用户名），用于无头像时的首字兜底 */
    name?: string | null;
    /** 头像尺寸（像素） */
    size?: number;
    /** 头像形状 */
    shape?: 'circle' | 'square';
  }>(),
  {
    size: 32,
    shape: 'circle',
  }
);

const avatarSource = computed(() => {
  const value = props.avatar?.trim();
  return value || undefined;
});

const fallbackInitial = computed(() => {
  const text = props.name?.trim();
  if (!text) {
    return '?';
  }
  return text.slice(0, 1);
});
</script>

<template>
  <el-avatar :shape="shape" :size="size" :src="avatarSource" class="user-avatar">
    {{ fallbackInitial }}
  </el-avatar>
</template>

<style lang="scss" scoped>
.user-avatar {
  flex-shrink: 0;
  color: var(--el-color-white);
  background: var(--el-color-primary-light-5);
}
</style>
