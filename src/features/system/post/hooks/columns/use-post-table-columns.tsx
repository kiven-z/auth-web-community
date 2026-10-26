import { createAuditTableColumns } from '@/components/table/audit-columns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位表格列
 * @returns 表格列定义
 */
function usePostTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 130 },
    { label: t('post.field.postName'), prop: 'postName', minWidth: 140 },
    { label: t('post.field.deptName'), prop: 'deptName', minWidth: 140 },
    { label: t('post.field.orderNum'), prop: 'orderNum', width: 100 },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      minWidth: 240,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default usePostTableColumns;
