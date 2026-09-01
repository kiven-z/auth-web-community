<script lang="ts" setup>
import { deleteUsers } from '@/features/system/api/user/user';
import { getUserProfile } from '@/features/system/api/user/user-base';
import { hasAuth } from '@/auth/permission/has-auth';
import { useChangePasswordAction } from '@/components/domain/user/change-password-dialog';
import ActionRow from '@/components/ui/action-row';
import { deleteConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { SYS_USER_PERMS } from '@/features/system/user/constants/permissions';
import useUserSecurityAction from '@/features/system/user/workstation/hooks/security/use-user-security-action';
import AdminSessionsPanel from '@/features/system/user/workstation/panels/security/AdminSessionsPanel.vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'UserWorkstationSecurityPanel',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const deleting = ref(false);
const username = ref('');
const sessionsPanelRef = ref<{ loadSessions: () => Promise<void> } | null>(null);

const userId = computed(() => String(route.params.userId ?? ''));

const showActionsSection = computed(
  () =>
    hasAuth(SYS_USER_PERMS.UPDATE) ||
    hasAuth(SYS_USER_PERMS.AUTH_REFRESH) ||
    hasAuth(SYS_USER_PERMS.KICK_ALL) ||
    hasAuth(SYS_USER_PERMS.DELETE)
);

const { openAdminResetPasswordDialog } = useChangePasswordAction();
const { kickAllForUser, refreshUserAuth } = useUserSecurityAction();

/**
 * 拉取用户名供弹窗标题与会话字幕
 */
async function loadUsername() {
  if (!userId.value) {
    username.value = '';
    return;
  }

  loading.value = true;
  try {
    const profile = await getUserProfile(userId.value);
    username.value = profile.username;
  } catch (error: unknown) {
    errorMessage(error);
    username.value = '';
  } finally {
    loading.value = false;
  }
}

/**
 * 踢出全部会话并刷新列表
 */
async function handleKickAll() {
  if (!userId.value) {
    return;
  }
  await kickAllForUser(userId.value, {
    successI18nKey: 'users.session.kickAllSuccess',
    onSuccess: () => sessionsPanelRef.value?.loadSessions(),
  });
}

/**
 * 删除当前用户并返回列表
 */
async function handleDeleteUser() {
  if (!userId.value) {
    return;
  }

  const confirmed = await deleteConfirm();
  if (!confirmed) {
    return;
  }

  deleting.value = true;
  try {
    await deleteUsers([userId.value]);
    message(t('tips.deleteSuccess'), { type: 'success' });
    if (router.hasRoute('SystemUser')) {
      await router.push({ name: 'SystemUser' });
      return;
    }
    await router.push('/');
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    deleting.value = false;
  }
}

watch(userId, () => void loadUsername(), { immediate: true });
</script>

<template>
  <div v-loading="loading" class="security-panel">
    <section v-if="hasAuth(SYS_USER_PERMS.VIEW_SESSIONS)" class="security-panel__section">
      <el-divider content-position="left">{{ t('account.session.title') }}</el-divider>
      <AdminSessionsPanel ref="sessionsPanelRef" :user-id="userId" :username="username" />
    </section>

    <section v-if="showActionsSection" class="security-panel__section">
      <el-divider content-position="left">{{ t('account.section.accountActions') }}</el-divider>

      <div class="security-panel__actions">
        <ActionRow v-if="hasAuth(SYS_USER_PERMS.UPDATE)">
          <template #title>{{ t('users.password.reset') }}</template>
          <template #description>{{ t('users.workstation.security.passwordDesc') }}</template>
          <template #actions>
            <el-button type="primary" @click="openAdminResetPasswordDialog(userId, username)">
              {{ t('users.password.reset') }}
            </el-button>
          </template>
        </ActionRow>

        <ActionRow v-if="hasAuth(SYS_USER_PERMS.AUTH_REFRESH)">
          <template #title>{{ t('users.workstation.security.authRefresh') }}</template>
          <template #description>{{ t('users.workstation.security.authRefreshDesc') }}</template>
          <template #actions>
            <el-button type="warning" @click="refreshUserAuth(userId)">
              {{ t('users.workstation.security.authRefresh') }}
            </el-button>
          </template>
        </ActionRow>

        <ActionRow v-if="hasAuth(SYS_USER_PERMS.KICK_ALL)">
          <template #title>{{ t('users.session.kickAll') }}</template>
          <template #description>{{ t('users.workstation.security.kickDesc') }}</template>
          <template #actions>
            <el-button type="danger" @click="handleKickAll">
              {{ t('users.session.kickAll') }}
            </el-button>
          </template>
        </ActionRow>

        <ActionRow v-if="hasAuth(SYS_USER_PERMS.DELETE)">
          <template #title>{{ t('users.workstation.security.delete') }}</template>
          <template #description>{{ t('users.workstation.security.deleteDesc') }}</template>
          <template #actions>
            <el-button :loading="deleting" type="danger" @click="handleDeleteUser">
              {{ t('users.workstation.security.delete') }}
            </el-button>
          </template>
        </ActionRow>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.security-panel {
  &__actions {
    display: flex;
    flex-direction: column;

    > .action-row + .action-row {
      padding-top: 24px;
      margin-top: 24px;
      border-top: 1px solid var(--el-border-color-lighter);
    }
  }
}
</style>
