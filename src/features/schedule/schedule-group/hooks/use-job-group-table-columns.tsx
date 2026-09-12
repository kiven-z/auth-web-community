import type { SysJobGroupPageRow } from '@/features/schedule/api/job-group';
import { createAuditTableColumns } from '@/components/table/audit-columns';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useJobGroupTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    // 分组编码
    { label: t('scheduleGroup.code'), prop: 'groupCode', minWidth: 140 },
    // 分组名称
    { label: t('scheduleGroup.name'), prop: 'groupName', minWidth: 140 },
    // 分组状态
    {
      label: t('scheduleGroup.status'),
      prop: 'status',
      minWidth: 100,
      render: ({ row }: { row: SysJobGroupPageRow }) =>
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
    // 是否系统内置
    {
      label: t('scheduleGroup.isSystem'),
      prop: 'isSystem',
      minWidth: 110,
      render: ({ row }: { row: SysJobGroupPageRow }) => {
        return row.isSystem ? 'Y' : 'N';
      },
    },
    // 排序号
    { label: t('scheduleGroup.orderNum'), prop: 'orderNum', minWidth: 90 },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 240,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useJobGroupTableColumns;
