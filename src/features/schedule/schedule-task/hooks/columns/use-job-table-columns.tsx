import type { SysJobPageRow } from '@/features/schedule/api/job';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/boolean-status-tag';
import { createAuditTableColumns } from '@/components/table/audit-columns';
import { formatDateTime } from '@/shared/utils/date/date-time';
import useJobFormOptions from '@/features/schedule/schedule-task/hooks/options/use-job-form-options';
import useJobRuntimeStatusOptions from '@/features/schedule/schedule-task/hooks/options/use-job-runtime-status-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useJobTableColumns() {
  const { t } = useI18n();
  const { taskTypeOptions, misfirePolicyOptions } = useJobFormOptions();
  const { lastExecutionStatusOptions } = useJobRuntimeStatusOptions();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('scheduleTask.fields.jobName'), prop: 'jobName', minWidth: 160 },
    { label: t('scheduleTask.fields.jobGroup'), prop: 'jobGroup', minWidth: 130 },
    {
      label: t('scheduleTask.fields.taskType'),
      prop: 'taskType',
      minWidth: 120,
      render: ({ row }: { row: SysJobPageRow }) => {
        const option = taskTypeOptions.value.find((item) => item.value === row.taskType);
        return option?.label ?? row.taskType ?? '-';
      },
    },
    { label: t('scheduleTask.fields.cronExpression'), prop: 'cronExpression', minWidth: 150 },
    {
      label: t('scheduleTask.fields.misfirePolicy'),
      prop: 'misfirePolicy',
      minWidth: 140,
      render: ({ row }: { row: SysJobPageRow }) => {
        const option = misfirePolicyOptions.value.find((item) => item.value === row.misfirePolicy);
        return option?.label ?? '-';
      },
    },
    {
      label: t('scheduleTask.fields.concurrent'),
      prop: 'concurrent',
      minWidth: 110,
      render: ({ row }: { row: SysJobPageRow }) => {
        if (row.concurrent == null) {
          return '-';
        }
        return (
          <ElTag type={row.concurrent ? 'success' : 'info'} effect="plain">
            {row.concurrent ? t('scheduleTask.enums.concurrent.allowed') : t('scheduleTask.enums.concurrent.forbidden')}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.fields.status'),
      prop: 'status',
      minWidth: 100,
      render: ({ row }: { row: SysJobPageRow }) => {
        if (row.status == null) {
          return '-';
        }
        return row.status ? renderActiveStatusTag() : renderInactiveStatusTag();
      },
    },
    {
      label: t('scheduleTask.fields.lastExecutionStatus'),
      prop: 'lastExecutionStatus',
      minWidth: 110,
      render: ({ row }: { row: SysJobPageRow }) => {
        const option = lastExecutionStatusOptions.value.find((item) => item.value === row.lastExecutionStatus);
        if (!option) {
          return row.lastExecutionStatus ?? '-';
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.fields.lastExecutionTime'),
      prop: 'lastExecutionTime',
      minWidth: 170,
      render: ({ row }: { row: SysJobPageRow }) => formatDateTime(row.lastExecutionTime),
    },
    { label: t('scheduleTask.fields.invokeTarget'), prop: 'invokeTarget', minWidth: 180 },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 280,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useJobTableColumns;
