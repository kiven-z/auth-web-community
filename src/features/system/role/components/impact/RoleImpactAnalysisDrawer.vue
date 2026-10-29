<script lang="tsx" setup>
import useUserStatus from '@/components/domain/user/user-status';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import AuthorizationSurfaceShell from '@/features/system/_shared/components/AuthorizationSurfaceShell.vue';
import type { UserReference } from '@/features/system/api/models/grant-table';
import {
  getRoleImpactUsersPage,
  refreshRoleImpactedProfiles,
  type RoleImpactUserPageQuery,
} from '@/features/system/api/role/role-impact';
import { SYS_ROLE_PERMS } from '@/features/system/role/constants/permissions';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleImpactAnalysisDrawer' });

/** 角色影响分析抽屉入参 */
interface RoleImpactAnalysisDrawerProps {
  roleId: string;
}

const props = defineProps<RoleImpactAnalysisDrawerProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusFilterOptions, renderUserAccountStatus } = useUserStatus();

const refreshLoading = ref(false);
const searchFormRef = ref<FormInstance>();

const impactUserColumns = computed<TableColumnList>(() => [
  { type: 'selection', align: 'left', width: 48 },
  { label: t('users.field.username'), prop: 'username', minWidth: 120 },
  { label: t('users.field.nickname'), prop: 'nickname', minWidth: 120 },
  { label: t('post.field.employeeNo'), prop: 'employeeNo', minWidth: 100 },
  {
    label: t('users.field.status'),
    prop: 'status',
    minWidth: 90,
    render: ({ row }: { row: UserReference }) => renderUserAccountStatus(row.status),
  },
]);

const impactUserState = usePaginationState<UserReference, RoleImpactUserPageQuery>({
  searchForm: reactive({
    keyword: undefined,
    status: undefined,
  }),
  fetchApi: (query) => getRoleImpactUsersPage(props.roleId, query),
});
const { fetchTableData, resetQuery, loading, searchForm, selectedRows } = impactUserState;

const hasSelection = computed(() => selectedRows.value.length > 0);

/**
 * 刷新受影响用户画像（全量或当前勾选）
 * @param selectedOnly 是否仅刷新勾选用户
 */
async function handleRefresh(selectedOnly: boolean) {
  if (selectedOnly && !hasSelection.value) {
    return;
  }

  const confirmed = await operationConfirm();
  if (!confirmed) {
    return;
  }

  refreshLoading.value = true;
  try {
    const userIds = selectedOnly ? selectedRows.value : undefined;
    const result = await refreshRoleImpactedProfiles(props.roleId, userIds);
    message(t('roles.impact.refreshSuccess', { count: result.refreshedUserCount }), { type: 'success' });
    await fetchTableData();
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    refreshLoading.value = false;
  }
}

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <AuthorizationSurfaceShell>
    <template #actions>
      <el-button
        v-auth="SYS_ROLE_PERMS.UPDATE"
        :disabled="!hasSelection"
        :loading="refreshLoading"
        type="warning"
        @click="handleRefresh(true)"
      >
        {{ t('roles.impact.refreshSelected') }}
      </el-button>
      <el-button v-auth="SYS_ROLE_PERMS.UPDATE" :loading="refreshLoading" type="danger" @click="handleRefresh(false)">
        {{ t('roles.impact.refreshAll') }}
      </el-button>
    </template>

    <el-alert :closable="false" :title="t('roles.impact.tip')" class="mb-3" show-icon type="info" />

    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('roles.authorizationSurface.keyword')" prop="keyword">
        <el-input
          v-model="searchForm.keyword"
          :placeholder="ph.input('roles.authorizationSurface.keyword')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('users.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('users.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in statusFilterOptions"
            :key="String(option.value)"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="SYS_ROLE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_ROLE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="impactUserColumns" :state="impactUserState" :title="t('roles.impact.impactedUsers')" />
  </AuthorizationSurfaceShell>
</template>
