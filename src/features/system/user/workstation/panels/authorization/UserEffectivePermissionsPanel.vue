<script lang="ts" setup>
import type { PermissionReference } from '@/features/system/api/models/grant-table';
import type { UserEffectivePermissionPageQuery } from '@/features/system/api/user/user-authorization';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import type { AuthorizationSurfacePanelProps } from '@/features/system/_shared/types';
import usePermissionColumns from '@/features/system/_shared/columns/use-permission-columns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserEffectivePermissionsPanel' });

/** 用户生效权限分页面板（仅启用，无 status 筛选） */
type UserEffectivePermissionsPanelProps = AuthorizationSurfacePanelProps<
  PermissionReference,
  UserEffectivePermissionPageQuery
>;

const props = defineProps<UserEffectivePermissionsPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { permissionColumns } = usePermissionColumns();
const searchFormRef = ref<FormInstance>();

const permissionState = usePaginationState<PermissionReference, UserEffectivePermissionPageQuery>({
  searchForm: reactive({
    permissionCode: undefined,
    permissionName: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = permissionState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="user-effective-permissions-panel">
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
