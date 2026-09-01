import type { SysPermissionPageRow } from '@/features/system/api/permission/permission';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/boolean-status-tag';
import { createAuditTableColumns } from '@/components/table/audit-columns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限表格列
 * @returns 表格列定义
 */
function usePermissionTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    // 权限编码
    { label: t('permissions.field.permissionCode'), prop: 'permissionCode', minWidth: 150 },
    // 权限名称
    { label: t('permissions.field.permissionName'), prop: 'permissionName', minWidth: 150 },
    // 状态
    {
      label: t('permissions.field.status'),
      prop: 'status',
      minWidth: 100,
      render: ({ row }: { row: SysPermissionPageRow }) =>
        row.status ? renderActiveStatusTag() : renderInactiveStatusTag(),
    },
    // 排序号
    { label: t('permissions.field.orderNum'), prop: 'orderNum', width: 100 },
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

export default usePermissionTableColumns;
