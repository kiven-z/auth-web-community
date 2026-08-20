<script lang="ts" setup>
import { clearMyPreferences } from '@/features/system/api/user/user-preferences';
import { createDefaultUiPreferences } from '@/core/preferences/defaults/preference-defaults';
import { resetLocalUiPreferences } from '@/core/preferences/persistence/storage';
import { useChangePasswordAction } from '@/components/domain/user/ChangePasswordDialog';
import ActionRow from '@/components/ui/ActionRow';
import { multiConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfileSecurityCard',
});

const { t } = useI18n();
const resetting = ref(false);

const { openSelfChangePasswordDialog } = useChangePasswordAction();

/**
 * 二次确认后清空服务端 UI 偏好、重置内存态并刷新页面
 */
async function handleResetPreferences() {
  const confirmed = await multiConfirm([
    {
      title: t('account.preferences.confirmFirst'),
      message: t('account.preferences.title'),
    },
  ]);
  if (!confirmed) {
    return;
  }

  resetting.value = true;
  try {
    await clearMyPreferences();
    resetLocalUiPreferences(createDefaultUiPreferences());
    message(t('account.preferences.resetSuccess'), { type: 'success' });
    globalThis.location.reload();
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    resetting.value = false;
  }
}
</script>

<template>
  <div class="profile-security-card">
    <ActionRow>
      <template #title>{{ t('users.password.reset') }}</template>
      <template #description>{{ t('users.password.old') }} / {{ t('users.password.new') }}</template>
      <template #actions>
        <el-button type="primary" @click="openSelfChangePasswordDialog">
          {{ t('users.password.reset') }}
        </el-button>
      </template>
    </ActionRow>

    <el-divider />
    <ActionRow>
      <template #title>{{ t('account.preferences.title') }}</template>
      <template #description>{{ t('account.preferences.subtitle') }}</template>
      <template #actions>
        <el-button :loading="resetting" type="warning" @click="handleResetPreferences">
          {{ t('account.preferences.reset') }}
        </el-button>
      </template>
    </ActionRow>
  </div>
</template>

<style lang="scss" scoped>
.profile-security-card {
  display: flex;
  flex-direction: column;
}
</style>
