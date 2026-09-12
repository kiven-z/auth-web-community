<script lang="tsx" setup>
import { renderDeptStatusTag } from '@/components/domain/system/status/dept-status-tag';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import type { AuthorizationSurfacePanelProps } from '@/features/system/_shared/types';
import type { UserDeptPageQuery, UserDeptPageRow } from '@/features/system/api/user/user-dept';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { ElCheckTag, type FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserBoundDeptsPanel' });

/** 用户关联部门分页面板 */
type UserBoundDeptsPanelProps = AuthorizationSurfacePanelProps<UserDeptPageRow, UserDeptPageQuery>;

const props = defineProps<UserBoundDeptsPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();

const searchFormRef = ref<FormInstance>();

const deptState = usePaginationState<UserDeptPageRow, UserDeptPageQuery>({
  searchForm: reactive({
    deptName: undefined,
    deptCode: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = deptState;

const userDeptBindingColumns = computed<TableColumnList>(() => [
  { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 120 },
  { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 120 },
  {
    label: t('dept.field.status'),
    prop: 'deptStatus',
    minWidth: 140,
    render: ({ row }: { row: UserDeptPageRow }) =>
      renderDeptStatusTag({
        status: row.deptStatus,
        effective: row.deptEffective,
      }),
  },
  {
    label: t('relation.isPrimary'),
    prop: 'isPrimary',
    minWidth: 110,
    render: ({ row }: { row: UserDeptPageRow }) =>
      row.isPrimary ? (
        <ElCheckTag checked type="danger">
          {t('relation.primary')}
        </ElCheckTag>
      ) : (
        <ElCheckTag checked={false} type="info">
          {t('relation.nonPrimary')}
        </ElCheckTag>
      ),
  },
]);

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="user-bound-depts-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('dept.field.deptName')" prop="deptName">
        <el-input
          v-model="searchForm.deptName"
          :placeholder="ph.input('dept.field.deptName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('dept.field.deptCode')" prop="deptCode">
        <el-input
          v-model="searchForm.deptCode"
          :placeholder="ph.input('dept.field.deptCode')"
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

    <ListTable :columns="userDeptBindingColumns" :state="deptState" :title="title" />
  </div>
</template>
