import type { PermissionReference } from '@/features/system/api/models/grant-table';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/BooleanStatusTag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限固定列（角色/菜单详情「已分配权限」等）
 * @returns 权限表格列定义
 */
function usePermissionColumns() {
  const { t } = useI18n();

  const permissionColumns = computed<TableColumnList>(() => [
    { label: t('permissions.field.permissionCode'), prop: 'permissionCode', minWidth: 140 },
    { label: t('permissions.field.permissionName'), prop: 'permissionName', minWidth: 120 },
    {
      label: t('permissions.field.status'),
      prop: 'status',
      minWidth: 90,
      render: ({ row }: { row: PermissionReference }) =>
        row.status ? renderActiveStatusTag() : renderInactiveStatusTag(),
    },
  ]);

  return { permissionColumns };
}

export default usePermissionColumns;
