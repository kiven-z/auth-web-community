import type { SysRolePageRow } from '@/features/system/api/role/role';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/BooleanStatusTag';
import { createAuditTableColumns } from '@/components/table/AuditColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色表格列
 * @returns 表格列定义
 */
function useRoleTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    // 角色编码
    { label: t('roles.field.roleCode'), prop: 'roleCode', minWidth: 130 },
    // 角色名称
    { label: t('roles.field.roleName'), prop: 'roleName', minWidth: 140 },
    // 状态
    {
      label: t('roles.field.status'),
      prop: 'status',
      minWidth: 100,
      render: ({ row }: { row: SysRolePageRow }) => (row.status ? renderActiveStatusTag() : renderInactiveStatusTag()),
    },
    // 排序号
    { label: t('roles.field.orderNum'), prop: 'orderNum', width: 100 },
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

export default useRoleTableColumns;
