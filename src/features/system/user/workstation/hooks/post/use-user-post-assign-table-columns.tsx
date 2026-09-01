import type { UserPostPageRow } from '@/features/system/api/user/user-post';
import { renderPostStatusTag } from '@/components/domain/post/post-status-tag';
import { createAuditTableColumns } from '@/components/table/audit-columns';
import { ElCheckTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户岗位关联抽屉表格列
 * @returns 表格列定义
 */
function useUserPostAssignTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
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
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      slot: 'actions',
      minWidth: 140,
    },
  ]);

  return { columns };
}

export default useUserPostAssignTableColumns;
