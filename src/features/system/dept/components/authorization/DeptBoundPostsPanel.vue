<script lang="tsx" setup>
import ListTable, { usePaginationState } from '@/components/table/list-table';
import type { AuthorizationSurfacePanelProps } from '@/features/system/_shared/types';
import type { DeptPostPageQuery } from '@/features/system/api/dept/dept-authorization';
import type { PostReference } from '@/features/system/api/models/grant-table';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/use-common-boolean-status-options';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { ElTag, type FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'DeptBoundPostsPanel' });

/** 部门下属岗位分页面板 */
type DeptBoundPostsPanelProps = AuthorizationSurfacePanelProps<PostReference, DeptPostPageQuery>;

const props = defineProps<DeptBoundPostsPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const searchFormRef = ref<FormInstance>();

const postState = usePaginationState<PostReference, DeptPostPageQuery>({
  searchForm: reactive({
    postCode: undefined,
    postName: undefined,
    status: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = postState;

const postColumns = computed<TableColumnList>(() => [
  { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120 },
  { label: t('post.field.postName'), prop: 'postName', minWidth: 120 },
  {
    label: t('post.field.status'),
    prop: 'status',
    minWidth: 90,
    render: ({ row }: { row: PostReference }) =>
      row.status ? (
        <ElTag type="success" effect="plain">
          {t('buttons.statusActiveText')}
        </ElTag>
      ) : (
        <ElTag type="danger" effect="plain">
          {t('buttons.statusInactiveText')}
        </ElTag>
      ),
  },
]);

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="dept-bound-posts-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('post.field.postName')" prop="postName">
        <el-input
          v-model="searchForm.postName"
          :placeholder="ph.input('post.field.postName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.postCode')" prop="postCode">
        <el-input
          v-model="searchForm.postCode"
          :placeholder="ph.input('post.field.postCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('post.field.status')"
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

    <ListTable :columns="postColumns" :state="postState" :title="title" />
  </div>
</template>
