<script lang="ts" setup>
import ListTable from '@/components/table/list-table';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/use-collapsible-search-form';
import { SYS_USER_PERMS } from '@/features/system/user/constants/permissions';
import useUserStatus, { USER_ACCOUNT_STATUS } from '@/components/domain/user/user-status';
import { useOpenUserWorkstation } from '@/features/system/user/hooks/use-open-user-workstation';
import useUserAdvanceAction from '@/features/system/user/list/hooks/actions/use-user-advance-action';
import useUserTableAction from '@/features/system/user/list/hooks/actions/use-user-table-action';
import useUserTableColumns from '@/features/system/user/list/hooks/columns/use-user-table-columns';
import useUserPageState from '@/features/system/user/list/hooks/use-user-page-state';
import type { FormInstance } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'UserTablePanel',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusFilterOptions: userStatusOptions } = useUserStatus();
const { columns } = useUserTableColumns();
const searchFormRef = ref<FormInstance>();

const { tableState, fetchUserTable, resetUserSearch } = useUserPageState();
const { loading, searchForm, selectedRows } = tableState;

const { openCreateDialog, batchUpdateStatus } = useUserTableAction({
  fetchTableData: fetchUserTable,
  selectedRows,
});

const { openImportDialog, deleteBatchRows, batchKickAll, batchRefreshAuth } = useUserAdvanceAction({
  fetchTableData: fetchUserTable,
  selectedRows,
});

const { openUserWorkstation } = useOpenUserWorkstation();
const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(6);

const hasSelection = computed(() => selectedRows.value.length > 0);
</script>

<template>
  <div class="user-table-panel list-table-host">
    <div class="user-table-panel__search shrink-0">
      <el-form
        ref="searchFormRef"
        v-enter-submit="fetchUserTable"
        :model="searchForm"
        class="user-table-panel__form overflow-auto bg-auth-container pt-3 pl-8"
        inline
      >
        <el-form-item :label="t('users.field.username')" prop="username">
          <el-input
            v-model="searchForm.username"
            :placeholder="ph.input('users.field.username')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item :label="t('users.field.nickname')" prop="nickname">
          <el-input
            v-model="searchForm.nickname"
            :placeholder="ph.input('users.field.nickname')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item :label="t('users.field.phone')" prop="phone">
          <el-input v-model="searchForm.phone" :placeholder="ph.input('users.field.phone')" class="w-45!" clearable />
        </el-form-item>
        <el-form-item :label="t('users.field.email')" prop="email">
          <el-input v-model="searchForm.email" :placeholder="ph.input('users.field.email')" class="w-45!" clearable />
        </el-form-item>
        <template v-if="showAdvancedSearchToggle">
          <el-form-item v-show="searchExpanded" :label="t('relation.employeeNo')" prop="employeeNo">
            <el-input
              v-model="searchForm.employeeNo"
              :placeholder="ph.input('relation.employeeNo')"
              class="w-45!"
              clearable
            />
          </el-form-item>
          <el-form-item v-show="searchExpanded" :label="t('users.field.status')" prop="status">
            <el-select
              v-model="searchForm.status"
              :placeholder="ph.selectFilter('users.field.status')"
              class="w-45!"
              clearable
            >
              <el-option v-for="opt in userStatusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button v-auth="SYS_USER_PERMS.QUERY" :loading="loading" type="primary" @click="fetchUserTable">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-auth="SYS_USER_PERMS.QUERY" @click="resetUserSearch(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
          <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
            {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <ListTable :columns="columns" :state="tableState" :title="t('routes.userManagement')" adaptive="fill">
      <template #buttons>
        <el-button v-auth="SYS_USER_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchEnable'),
              permission: SYS_USER_PERMS.UPDATE,
              disabled: !hasSelection,
              onClick: () => batchUpdateStatus(selectedRows, USER_ACCOUNT_STATUS.normal),
            },
            {
              label: t('buttons.actionBatchLock'),
              permission: SYS_USER_PERMS.UPDATE,
              disabled: !hasSelection,
              onClick: () => batchUpdateStatus(selectedRows, USER_ACCOUNT_STATUS.locked),
            },
            {
              label: t('buttons.actionBatchDisable'),
              permission: SYS_USER_PERMS.UPDATE,
              disabled: !hasSelection,
              onClick: () => batchUpdateStatus(selectedRows, USER_ACCOUNT_STATUS.disabled),
            },
          ]"
        >
          <el-button :disabled="!hasSelection" type="warning">
            {{ t('buttons.actionBatchStatus') }}
          </el-button>
        </AuthDropdown>

        <AuthDropdown
          :items="[
            { label: t('buttons.importExcel'), permission: SYS_USER_PERMS.IMPORT, onClick: openImportDialog },
            {
              label: t('buttons.actionBatchDelete'),
              permission: SYS_USER_PERMS.DELETE,
              disabled: !hasSelection,
              onClick: deleteBatchRows,
            },
            {
              label: t('users.kick.batchAction'),
              permission: SYS_USER_PERMS.KICK_ALL,
              disabled: !hasSelection,
              onClick: batchKickAll,
            },
            {
              label: t('users.authRefresh.batchAction'),
              permission: SYS_USER_PERMS.AUTH_REFRESH,
              disabled: !hasSelection,
              onClick: batchRefreshAuth,
            },
          ]"
        >
          <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
        </AuthDropdown>
      </template>

      <template #actions="{ row }">
        <el-button v-auth="SYS_USER_PERMS.QUERY" link type="primary" @click="openUserWorkstation(row.id)">
          {{ t('users.workstation.open') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>

<style lang="scss" scoped>
.user-table-panel {
  flex: 1;

  &__form {
    width: 100%;
  }
}
</style>
