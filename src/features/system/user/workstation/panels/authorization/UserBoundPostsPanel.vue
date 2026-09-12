<script lang="tsx" setup>
import { renderPostStatusTag } from '@/components/domain/system/status/post-status-tag';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import type { AuthorizationSurfacePanelProps } from '@/features/system/_shared/types';
import type { UserPostPageQuery, UserPostPageRow } from '@/features/system/api/user/user-post';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { ElCheckTag, type FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserBoundPostsPanel' });

/** 用户-岗位关联分页面板 */
type UserBoundPostsPanelProps = AuthorizationSurfacePanelProps<UserPostPageRow, UserPostPageQuery>;

const props = defineProps<UserBoundPostsPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();

const postState = usePaginationState<UserPostPageRow, UserPostPageQuery>({
  searchForm: reactive({
    postCode: undefined,
    postName: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = postState;

const userPostBindingColumns = computed<TableColumnList>(() => [
  { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120 },
  {
    label: t('post.field.postName'),
    prop: 'postName',
    minWidth: 140,
  },
  {
    label: t('post.field.status'),
    prop: 'postStatus',
    minWidth: 150,
    render: ({ row }: { row: UserPostPageRow }) => {
      return renderPostStatusTag({
        status: row.postStatus === true,
        effective: row.postEffective,
      });
    },
  },
  {
    label: t('post.field.isPrimaryPosition'),
    prop: 'isPrimary',
    minWidth: 110,
    render: ({ row }: { row: UserPostPageRow }) =>
      row.isPrimary ? (
        <ElCheckTag checked type="danger">
          {t('post.enums.primary.yes')}
        </ElCheckTag>
      ) : (
        <ElCheckTag checked type="primary">
          {t('post.enums.primary.no')}
        </ElCheckTag>
      ),
  },
]);

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="user-bound-posts-panel">
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
      <el-form-item>
        <el-button v-auth="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="queryPerm" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="userPostBindingColumns" :state="postState" :title="title" />
  </div>
</template>
