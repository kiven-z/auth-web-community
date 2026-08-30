import type { UserPostPageRow } from '@/features/system/api/user/userPost';
import { renderPostStatusTag } from '@/components/domain/post/PostStatusTag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useUserProfileDisplay from '../hooks/useUserProfileDisplay';

/**
 * 岗位档案描述列与用户-岗位绑定表格列
 * @returns 岗位相关列定义
 */
function useProfilePostColumns() {
  const { t } = useI18n();
  const { renderPostPrimaryTag, renderPostNonPrimaryTag } = useUserProfileDisplay();

  const postColumns = computed(() => [
    { label: t('post.field.postName'), prop: 'postName', copy: true },
    { label: t('post.field.postCode'), prop: 'postCode', copy: true },
    {
      label: t('post.field.isPrimaryPosition'),
      prop: 'isPrimary',
      cellRenderer: ({ value }: { value: boolean | number }) => {
        const primary = value === true || value === 1;
        return primary ? renderPostPrimaryTag() : renderPostNonPrimaryTag();
      },
    },
  ]);

  const userPostBindingColumns = computed<TableColumnList>(() => [
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120 },
    {
      label: t('post.field.postName'),
      prop: 'postName',
      minWidth: 140,
      render: ({ row }: { row: UserPostPageRow }) => (
        <span class={row.postEffective === false ? 'text-(--el-text-color-secondary)' : undefined}>{row.postName}</span>
      ),
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
      render: ({ row }: { row: UserPostPageRow }) => {
        return row.isPrimary ? renderPostPrimaryTag() : renderPostNonPrimaryTag();
      },
    },
  ]);

  return {
    postColumns,
    userPostBindingColumns,
  };
}

export default useProfilePostColumns;
