import type { JobLogPageRow } from '@/features/log/api/jobLog';
import { selectUserinfo } from '@/components/domain/user/UserProfile';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import useJobLogOptions from '@/features/schedule/schedule-log/hooks/options/useJobLogOptions';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务调度日志表格列
 * @returns 表格列定义
 */
function useJobLogTableColumns() {
  const { t } = useI18n();
  const { statusOptions, triggerTypeOptions } = useJobLogOptions();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', width: 50 },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('logJob.field.jobId'), prop: 'jobId', minWidth: 180 },
    { label: t('logJob.field.jobName'), prop: 'jobName', minWidth: 160 },
    { label: t('logJob.field.jobGroup'), prop: 'jobGroup', minWidth: 140 },
    { label: t('logJob.field.invokeTarget'), prop: 'invokeTarget', minWidth: 200 },
    {
      label: t('logJob.field.triggerType'),
      prop: 'triggerType',
      minWidth: 120,
      render: ({ row }: { row: JobLogPageRow }) => {
        const option = triggerTypeOptions.value.find((item) => item.value === row.triggerType);
        return option?.label ?? row.triggerType ?? '-';
      },
    },
    {
      label: t('logJob.field.status'),
      prop: 'status',
      minWidth: 100,
      render: ({ row }: { row: JobLogPageRow }) => {
        const meta = statusOptions.value.find((item) => item.value === row.status) ?? statusOptions.value[1];
        return (
          <ElTag type={meta.tagType} effect="plain">
            {meta.label}
          </ElTag>
        );
      },
    },
    { label: t('logJob.field.elapsedTime'), prop: 'elapsedTime', minWidth: 120 },
    {
      label: t('logJob.field.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: JobLogPageRow }) => formatDateTime(row.createdAt),
    },
    {
      label: t('table.createdByName'),
      prop: 'createdBy',
      minWidth: 130,
      render: ({ row }: { row: JobLogPageRow }) => {
        return (
          row.createdBy && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createdBy, row.createdByName)}>
              {row.createdByName}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useJobLogTableColumns;
