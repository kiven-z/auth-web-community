<script lang="ts" setup>
import { getUserProfile } from '@/features/system/api/user/userBase';
import { getUserRoles, putUserRoles } from '@/features/system/api/user/userRole';
import { errorMessage, message } from '@/services/feedback/message';
import RoleAssignPanel from '@/features/system/_shared/components/RoleAssignPanel.vue';
import { SYS_USER_ROLE_PERMS } from '@/features/system/user/constants/permissions';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

defineOptions({ name: 'UserWorkstationGrantRolePanel' });

const route = useRoute();
const { t } = useI18n();

const userId = computed(() => String(route.params.userId ?? ''));
const loading = ref(false);
const saving = ref(false);
const username = ref('');
const nickname = ref<string | null>(null);
const selectedKeys = ref<string[]>([]);
/** 递增以重挂载分配台账（重置本地勾选） */
const assignPanelKey = ref(0);

/**
 * 拉取当前用户已分配角色，供 AssignPanel 灌种
 * @returns 已分配角色种子
 */
async function loadAssigned() {
  const rows = await getUserRoles(userId.value);
  return rows.map((roleRow) => ({ key: roleRow.id, label: roleRow.roleName }));
}

/**
 * 拉取用户展示名
 */
async function loadUserTitle() {
  if (!userId.value) {
    username.value = '';
    nickname.value = null;
    return;
  }
  loading.value = true;
  try {
    const profile = await getUserProfile(userId.value);
    username.value = profile.username;
    nickname.value = profile.nickname;
  } catch (error: unknown) {
    errorMessage(error);
    username.value = '';
    nickname.value = null;
  } finally {
    loading.value = false;
  }
}

/**
 * 全量覆盖保存角色分配
 */
async function handleSave() {
  if (!userId.value) {
    return;
  }
  saving.value = true;
  try {
    await putUserRoles(userId.value, { roleIds: selectedKeys.value });
    message(t('tips.assignSaveSuccess'), { type: 'success' });
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    saving.value = false;
  }
}

watch(userId, () => void loadUserTitle(), { immediate: true });
</script>

<template>
  <div v-loading="loading || saving" class="grant-role-panel">
    <div class="grant-role-panel__actions">
      <el-button v-auth="SYS_USER_ROLE_PERMS.UPDATE" :loading="saving" type="primary" @click="handleSave">
        {{ t('account.action.save') }}
      </el-button>
      <el-button :disabled="saving" @click="assignPanelKey += 1">
        {{ t('account.action.reset') }}
      </el-button>
    </div>

    <div class="grant-role-panel__body">
      <RoleAssignPanel
        v-if="userId"
        :key="assignPanelKey"
        v-model="selectedKeys"
        :left-subtitle="nickname || username"
        :left-title="t('users.assign.current')"
        :load-assigned="loadAssigned"
        :table-title="t('users.workstation.nav.grantRole')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grant-role-panel {
  display: flex;
  flex-direction: column;
  gap: var(--auth-size-3);
  height: 100%;
  min-height: 0;
  overflow: hidden;

  &__actions {
    display: flex;
    flex-shrink: 0;
    justify-content: flex-end;

    .el-button {
      width: 160px;
    }
  }

  &__body {
    flex: 1 1 0;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
