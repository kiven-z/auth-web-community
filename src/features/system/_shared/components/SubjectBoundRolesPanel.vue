<script lang="ts" setup>
import type { RoleReference } from '@/features/system/api/models/grant-table';
import type { UserRolePageQuery } from '@/features/system/api/user/user-role';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import type { AuthorizationSurfacePanelProps } from '@/features/system/_shared/types';
import useRoleColumns from '@/features/system/_shared/columns/useRoleColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'SubjectBoundRolesPanel' });

/** 主体已授角色分页面板 */
type SubjectBoundRolesPanelProps = AuthorizationSurfacePanelProps<RoleReference, UserRolePageQuery>;

const props = defineProps<SubjectBoundRolesPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { roleColumns } = useRoleColumns();
const searchFormRef = ref<FormInstance>();

const roleState = usePaginationState<RoleReference, UserRolePageQuery>({
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = roleState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="subject-bound-roles-panel">
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
      <el-form-item :label="t('roles.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('roles.field.status')"
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

    <ListTable :columns="roleColumns" :state="roleState" :title="title" />
  </div>
</template>
