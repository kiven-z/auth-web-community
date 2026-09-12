import type { InAppMessageCategoryPageRow } from '@/features/message/api/in-app-category';
import { createAuditTableColumns } from '@/components/table/audit-columns';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信业务分类树表列配置
 * @returns 表格列定义
 */
function useInAppCategoryTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    {
      label: t('inAppCategory.field.name'),
      prop: 'name',
      minWidth: 180,
      align: 'left',
    },
    {
      label: t('inAppCategory.field.code'),
      prop: 'code',
      minWidth: 160,
    },
    {
      label: t('inAppCategory.field.parentName'),
      prop: 'parentName',
      minWidth: 140,
      render: ({ row }: { row: InAppMessageCategoryPageRow }) =>
        row.parentId === TREE_ROOT_PARENT_ID ? t('inAppCategory.rootLabel') : row.parentName || '—',
    },
    {
      label: t('inAppCategory.field.sortOrder'),
      prop: 'sortOrder',
      minWidth: 90,
    },
    {
      label: t('inAppCategory.field.status'),
      prop: 'status',
      minWidth: 100,
      render: ({ row }: { row: InAppMessageCategoryPageRow }) =>
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
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 300,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useInAppCategoryTableColumns;
