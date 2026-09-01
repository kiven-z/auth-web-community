import type { RoleReference } from '@/features/system/api/models/grant-table';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/boolean-status-tag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色固定列（grant_table 分配、详情反查、各主体「已绑角色」）
 * @returns 角色表格列定义
 */
function useRoleColumns() {
  const { t } = useI18n();

  const roleColumns = computed<TableColumnList>(() => [
    { label: t('roles.field.roleCode'), prop: 'roleCode', minWidth: 120 },
    { label: t('roles.field.roleName'), prop: 'roleName', minWidth: 120 },
    {
      label: t('roles.field.status'),
      prop: 'status',
      minWidth: 90,
      render: ({ row }: { row: RoleReference }) => (row.status ? renderActiveStatusTag() : renderInactiveStatusTag()),
    },
  ]);

  return { roleColumns };
}

export default useRoleColumns;
