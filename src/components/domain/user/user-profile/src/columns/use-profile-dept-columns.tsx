import type { UserDeptPageRow } from '@/features/system/api/user/user-dept';
import { renderDeptStatusTag } from '@/components/domain/dept/dept-status-tag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useUserProfileDisplay from '../hooks/use-user-profile-display';

/**
 * 部门档案描述列与用户-部门绑定表格列
 * @returns 部门相关列定义
 */
function useProfileDeptColumns() {
  const { t } = useI18n();
  const { renderDeptPrimaryTag, renderDeptNonPrimaryTag } = useUserProfileDisplay();

  const deptColumns = computed(() => [
    { label: t('dept.field.deptName'), prop: 'deptName', copy: true },
    { label: t('dept.field.deptCode'), prop: 'deptCode', copy: true },
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      cellRenderer: ({ value }: { value: boolean }) => (value ? renderDeptPrimaryTag() : renderDeptNonPrimaryTag()),
    },
  ]);

  const userDeptBindingColumns = computed<TableColumnList>(() => [
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
      render: ({ row }: { row: UserDeptPageRow }) => {
        return row.isPrimary ? renderDeptPrimaryTag() : renderDeptNonPrimaryTag();
      },
    },
  ]);

  return {
    deptColumns,
    userDeptBindingColumns,
  };
}

export default useProfileDeptColumns;
