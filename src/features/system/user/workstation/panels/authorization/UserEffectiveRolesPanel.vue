<script lang="ts" setup>
import type { RoleReference } from '@/features/system/api/models/grantTable';
import type { UserEffectiveRolePageQuery } from '@/features/system/api/user/userAuthorization';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { AuthorizationSurfacePanelProps } from '@/features/system/_shared/types';
import useRoleColumns from '@/features/system/_shared/columns/useRoleColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserEffectiveRolesPanel' });

/** 用户生效角色分页面板（仅启用，无 status 筛选） */
type UserEffectiveRolesPanelProps = AuthorizationSurfacePanelProps<RoleReference, UserEffectiveRolePageQuery>;

const props = defineProps<UserEffectiveRolesPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { roleColumns } = useRoleColumns();
const searchFormRef = ref<FormInstance>();

const roleState = usePaginationState<RoleReference, UserEffectiveRolePageQuery>({
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = roleState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="user-effective-roles-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
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
      <el-form-item>
        <el-button v-auth="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="queryPerm" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="roleColumns" :state="roleState" :title="title" />
  </div>
</template>
