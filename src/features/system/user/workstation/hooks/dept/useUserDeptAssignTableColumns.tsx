import type { UserDeptPageRow } from '@/features/system/api/user/user-dept';
import { renderDeptStatusTag } from '@/components/domain/dept/DeptStatusTag';
import { createAuditTableColumns } from '@/components/table/AuditColumns';
import { ElCheckTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户部门关联抽屉表格列
 * @returns 表格列定义
 */
function useUserDeptAssignTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 120 },
    {
      label: t('dept.field.deptName'),
      prop: 'deptName',
      minWidth: 140,
      render: ({ row }: { row: UserDeptPageRow }) => (
        <span class={row.deptEffective === false ? 'text-(--el-text-color-secondary)' : undefined}>{row.deptName}</span>
      ),
    },
    {
      label: t('dept.field.status'),
      prop: 'deptStatus',
      minWidth: 140,
      render: ({ row }: { row: UserDeptPageRow }) =>
        renderDeptStatusTag({
          status: row.deptStatus,
          effective: row.deptEffective,
        }),
    },
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      minWidth: 110,
      render: ({ row }: { row: UserDeptPageRow }) =>
        row.isPrimary ? (
          <ElCheckTag checked type="danger">
            {t('relation.primary')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked type="primary">
            {t('relation.secondary')}
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

export default useUserDeptAssignTableColumns;
