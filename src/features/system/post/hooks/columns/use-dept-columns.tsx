import type { DeptReference } from '@/features/system/api/models/grant-table';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门固定列（纯部门本体，不含 isPrimary）
 * @returns 部门表格列与描述列定义
 */
function useDeptColumns() {
  const { t } = useI18n();

  const deptColumns = computed<TableColumnList>(() => [
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 120 },
    { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 120 },
    {
      label: t('dept.field.status'),
      prop: 'status',
      minWidth: 90,
      render: ({ row }: { row: DeptReference }) =>
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
  ]);

  const deptDescriptionColumns = computed(() => [
    { label: t('dept.field.deptCode'), prop: 'deptCode', labelWidth: 120, copy: true },
    { label: t('dept.field.deptName'), prop: 'deptName', labelWidth: 120, copy: true },
    {
      label: t('dept.field.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }) =>
        value ? (
          <ElTag type="success" effect="plain">
            {t('buttons.statusActiveText')}
          </ElTag>
        ) : (
          <ElTag type="danger" effect="plain">
            {t('buttons.statusInactiveText')}
          </ElTag>
        ),
    },
  ]);

  return { deptColumns, deptDescriptionColumns };
}

export default useDeptColumns;
