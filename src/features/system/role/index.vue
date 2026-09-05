<script lang="ts" setup>
import { getRolePage } from '@/features/system/api/role/role';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { SYS_ROLE_PERMS } from '@/features/system/role/constants/permissions';
import useRoleAdvanceAction from '@/features/system/role/hooks/actions/use-role-advance-action';
import useRoleMoreAction from '@/features/system/role/hooks/actions/use-role-more-action';
import useOpenRoleAuthorizationSurface from '@/features/system/role/hooks/authorization/use-open-role-authorization-surface';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/use-common-boolean-status-options';
import useRoleTableAction from '@/features/system/role/hooks/actions/use-role-table-action';
import useRoleTableColumns from '@/features/system/role/hooks/columns/use-role-table-columns';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemRole',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();

const { columns } = useRoleTableColumns();

const searchFormRef = ref<FormInstance>();

const roleState = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: undefined,
  }),
});

const { loading, searchForm, selectedRows, fetchTableData, resetQuery } = roleState;

const { openImportDialog } = useRoleAdvanceAction({
  fetchTableData,
});

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow, batchUpdateStatus } = useRoleTableAction({
  fetchTableData,
});

const { openRoleAuthorizationSurface } = useOpenRoleAuthorizationSurface();
const { openAssignPermissionDrawer, openDataScopeDialog } = useRoleMoreAction();

const hasSelection = computed(() => selectedRows.value.length > 0);

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="w-[99/100] overflow-auto bg-auth-container pt-3 pl-8"
      inline
    >
      <el-form-item :label="t('roles.field.roleCode')" prop="roleCode">
        <el-input
          v-model="searchForm.roleCode"
          :placeholder="ph.input('roles.field.roleCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('roles.field.roleName')" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          :placeholder="ph.input('roles.field.roleName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('roles.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('roles.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in booleanStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
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

    <ListTable :columns="columns" :state="roleState" :title="t('roles.title.page')">
      <template #buttons>
        <el-button v-auth="SYS_ROLE_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchEnable'),
              permission: SYS_ROLE_PERMS.UPDATE,
              disabled: !hasSelection,
              onClick: () => batchUpdateStatus(selectedRows, true),
            },
            {
              label: t('buttons.actionBatchDisable'),
              permission: SYS_ROLE_PERMS.UPDATE,
              disabled: !hasSelection,
              onClick: () => batchUpdateStatus(selectedRows, false),
            },
          ]"
        >
          <el-button :disabled="!hasSelection" type="warning">
            {{ t('buttons.actionBatchStatus') }}
          </el-button>
        </AuthDropdown>

        <AuthDropdown
          :items="[{ label: t('buttons.importExcel'), permission: SYS_ROLE_PERMS.IMPORT, onClick: openImportDialog }]"
        >
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>
        </AuthDropdown>
      </template>

      <template #actions="{ row }">
        <div class="flex flex-wrap items-center gap-x-1">
          <el-button v-auth="SYS_ROLE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
            {{ t('buttons.actionView') }}
          </el-button>
          <el-button v-auth="SYS_ROLE_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
            {{ t('buttons.actionEdit') }}
          </el-button>
          <el-button v-auth="SYS_ROLE_PERMS.DELETE" link type="danger" @click="deleteRow(row)">
            {{ t('buttons.actionDelete') }}
          </el-button>

          <AuthDropdown
            :items="[
              {
                label: t('roles.menu.authorizationSurface'),
                permission: SYS_ROLE_PERMS.QUERY,
                onClick: () =>
                  openRoleAuthorizationSurface({
                    roleId: row.id,
                    roleCode: row.roleCode,
                    roleName: row.roleName,
                  }),
              },
              {
                label: t('roles.assign.permission'),
                permission: SYS_ROLE_PERMS.UPDATE,
                onClick: () => openAssignPermissionDrawer(row),
              },
              {
                label: t('roles.menu.dataScope'),
                permission: SYS_ROLE_PERMS.UPDATE,
                onClick: () => openDataScopeDialog(row),
              },
            ]"
          >
            <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          </AuthDropdown>
        </div>
      </template>
    </ListTable>
  </div>
</template>
