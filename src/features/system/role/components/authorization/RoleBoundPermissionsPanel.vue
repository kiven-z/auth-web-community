<script lang="ts" setup>
import type { PermissionReference } from '@/features/system/api/models/grant-table';
import type { RolePermissionPageQuery } from '@/features/system/api/role/role-authorization';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/use-common-boolean-status-options';
import type { AuthorizationSurfacePanelProps } from '@/features/system/_shared/types';
import usePermissionColumns from '@/features/system/_shared/columns/use-permission-columns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleBoundPermissionsPanel' });

/** 角色已绑定权限分页面板 */
type RoleBoundPermissionsPanelProps = AuthorizationSurfacePanelProps<PermissionReference, RolePermissionPageQuery>;

const props = defineProps<RoleBoundPermissionsPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { permissionColumns } = usePermissionColumns();
const searchFormRef = ref<FormInstance>();

const permissionState = usePaginationState<PermissionReference, RolePermissionPageQuery>({
  searchForm: reactive({
    permissionCode: undefined,
    permissionName: undefined,
    status: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = permissionState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="role-bound-permissions-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('permissions.field.permissionCode')" prop="permissionCode">
        <el-input
          v-model="searchForm.permissionCode"
          :placeholder="ph.input('permissions.field.permissionCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('permissions.field.permissionName')" prop="permissionName">
        <el-input
          v-model="searchForm.permissionName"
          :placeholder="ph.input('permissions.field.permissionName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('permissions.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('permissions.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in booleanStatusOptions"
            :key="String(option.value)"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="queryPerm" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="permissionColumns" :state="permissionState" :title="title" />
  </div>
</template>
