<script lang="tsx" setup>
import useUserStatus from '@/components/domain/system/status/use-user-status';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import type { AuthorizationSurfacePanelProps } from '@/features/system/_shared/types';
import type { DeptUserPageQuery } from '@/features/system/api/dept/dept-authorization';
import type { BoundUserReference, UserReference } from '@/features/system/api/models/grant-table';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { ElCheckTag, type FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'SubjectBoundUsersPanel' });

/** 主体关联用户分页面板（部门 / 岗位） */
type SubjectBoundUsersPanelProps = AuthorizationSurfacePanelProps<BoundUserReference, DeptUserPageQuery>;

const props = defineProps<SubjectBoundUsersPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusFilterOptions, renderUserAccountStatus } = useUserStatus();
const searchFormRef = ref<FormInstance>();

const userState = usePaginationState<BoundUserReference, DeptUserPageQuery>({
  searchForm: reactive({
    keyword: undefined,
    status: undefined,
    isPrimary: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = userState;

const userRelationBindingColumns = computed<TableColumnList>(() => [
  { label: t('users.field.username'), prop: 'username', minWidth: 120 },
  { label: t('users.field.nickname'), prop: 'nickname', minWidth: 120 },
  { label: t('post.field.employeeNo'), prop: 'employeeNo', minWidth: 100 },
  {
    label: t('users.field.status'),
    prop: 'status',
    minWidth: 90,
    render: ({ row }: { row: UserReference }) => renderUserAccountStatus(row.status),
  },
  {
    label: t('relation.isPrimary'),
    prop: 'isPrimary',
    minWidth: 110,
    render: ({ row }: { row: BoundUserReference }) =>
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
  <div class="subject-bound-users-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('authorization.surface.keyword')" prop="keyword">
        <el-input
          v-model="searchForm.keyword"
          :placeholder="ph.input('authorization.surface.keyword')"
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
        <el-button v-auth="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="queryPerm" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="userRelationBindingColumns" :state="userState" :title="title" />
  </div>
</template>
