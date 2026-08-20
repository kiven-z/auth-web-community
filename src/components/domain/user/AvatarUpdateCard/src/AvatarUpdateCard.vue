<script lang="ts" setup>
import AvatarEditor from '@/components/domain/user/AvatarEditor';
import { message } from '@/services/feedback/message';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { AvatarUpdateCardProps } from './types';

defineOptions({
  name: 'AvatarUpdateCard',
});

const props = withDefaults(defineProps<AvatarUpdateCardProps>(), {
  avatar: null,
  size: undefined,
});

const emit = defineEmits<{
  success: [avatarUrl: string];
}>();

const { t } = useI18n();
const displayAvatar = ref(props.avatar ?? null);

watch(
  () => props.avatar,
  (avatar) => {
    displayAvatar.value = avatar ?? null;
  }
);

/**
 * 头像上传成功后调用注入的持久化逻辑
 * @param avatarUrl 新头像 URL
 */
async function handleAvatarUploaded(avatarUrl: string): Promise<void> {
  await props.persist(avatarUrl);
  displayAvatar.value = avatarUrl;
  message(t('tips.editSuccess'), { type: 'success' });
  emit('success', avatarUrl);
}
</script>

<template>
  <div class="avatar-update-card">
    <el-alert
      :closable="false"
      :title="t('account.avatar.uploadHint')"
      class="avatar-update-card__hint"
      show-icon
      type="info"
    />

    <div class="avatar-update-card__body">
      <AvatarEditor :avatar="displayAvatar" :size="size" @uploaded="handleAvatarUploaded" />
      <div v-if="$slots.meta" class="avatar-update-card__meta">
        <slot name="meta" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar-update-card {
  &__hint {
    margin-bottom: 16px;
  }

  &__body {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  &__meta {
    flex: 1;
    min-width: 0;
  }
}
</style>
