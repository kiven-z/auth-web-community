<script lang="ts">
/** 更新用户头像面板属性 */
export interface AvatarUpdatePanelProps {
  /** 目标用户主键 */
  userId: string;
  /** 目标用户名 */
  username: string;
  /** 当前头像 URL */
  avatar?: string | null;
}
</script>

<script lang="ts" setup>
import { updateUserAvatar } from '@/features/system/api/user/user';
import AvatarUpdateCard from '@/components/domain/user/AvatarUpdateCard';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AvatarUpdatePanel',
});

const props = defineProps<AvatarUpdatePanelProps>();

const emit = defineEmits<{
  success: [avatarUrl: string];
}>();

const { t } = useI18n();

/**
 * 持久化目标用户头像
 * @param avatarUrl 新头像 URL
 */
async function persistAvatar(avatarUrl: string): Promise<void> {
  await updateUserAvatar({ userId: props.userId, avatar: avatarUrl });
}
</script>

<template>
  <AvatarUpdateCard :avatar="avatar" :persist="persistAvatar" :size="96" @success="emit('success', $event)">
    <template #meta>
      <p class="avatar-update-panel__username">{{ username }}</p>
      <p class="avatar-update-panel__tip">{{ t('users.avatar.updateHint') }}</p>
    </template>
  </AvatarUpdateCard>
</template>

<style lang="scss" scoped>
.avatar-update-panel {
  &__username {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  &__tip {
    margin: 8px 0 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}
</style>
