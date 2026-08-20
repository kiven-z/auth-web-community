import { renderDeptStatusTag } from '@/components/domain/dept/DeptStatusTag';
import type { SysDeptRow } from '@/features/system/dept/hooks/useDeptPageState';
import { createAuditTableColumns } from '@/components/table/AuditColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门表格列定义
 * @returns 表格列定义
 */
function useDeptTableColumns() {
  const { t } = useI18n();

  const tableColumns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      width: 60,
    },
    // 部门名称
    { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 160 },
    // 部门编码
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 140 },
    // 显示顺序
    { label: t('dept.field.orderNum'), prop: 'orderNum', width: 100 },
    // 状态（含祖先停用传播）
    {
      label: t('dept.field.status'),
      prop: 'status',
      width: 150,
      render: ({ row }: { row: SysDeptRow }) => renderDeptStatusTag(row),
    },
    ...createAuditTableColumns(),
    { label: t('table.actions'), fixed: 'right', minWidth: 240, slot: 'actions' },
  ]);

  return { tableColumns };
}

export default useDeptTableColumns;
