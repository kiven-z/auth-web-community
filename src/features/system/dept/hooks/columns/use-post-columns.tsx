import type { PostReference } from '@/features/system/api/models/grant-table';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/boolean-status-tag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位固定列（纯岗位本体，不含 isPrimary）
 * @returns 岗位表格列定义
 */
function usePostColumns() {
  const { t } = useI18n();

  const postColumns = computed<TableColumnList>(() => [
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120 },
    { label: t('post.field.postName'), prop: 'postName', minWidth: 120 },
    {
      label: t('post.field.status'),
      prop: 'status',
      minWidth: 90,
      render: ({ row }: { row: PostReference }) => (row.status ? renderActiveStatusTag() : renderInactiveStatusTag()),
    },
  ]);

  return { postColumns };
}

export default usePostColumns;
