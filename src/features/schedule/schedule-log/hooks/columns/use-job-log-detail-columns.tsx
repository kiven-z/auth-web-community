import { formatDateTime } from '@/shared/utils/date/date-time';
import type { JobLogDetailRow } from '@/features/log/api/job-log';
import useJobLogOptions from '@/features/schedule/schedule-log/hooks/options/use-job-log-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务调度日志详情描述列
 * @returns 详情列配置
 */
function useJobLogDetailColumns() {
  const { t } = useI18n();
  const { statusOptions, triggerTypeOptions } = useJobLogOptions();

  const detailColumns = computed(() => [
    { label: t('logJob.field.jobId'), prop: 'jobId', labelWidth: 120, copy: true },
    { label: t('logJob.field.jobName'), prop: 'jobName', labelWidth: 120, copy: true },
    { label: t('logJob.field.jobGroup'), prop: 'jobGroup', labelWidth: 120, copy: true },
    { label: t('logJob.field.invokeTarget'), prop: 'invokeTarget', labelWidth: 120, copy: true },
    {
      label: t('logJob.field.triggerType'),
      prop: 'triggerType',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: string }) => {
        const option = triggerTypeOptions.value.find((item) => item.value === value);
        return <span>{option?.label ?? value ?? '—'}</span>;
      },
    },
    { label: t('logJob.field.jobMessage'), prop: 'jobMessage', labelWidth: 120, copy: true },
    {
      label: t('logJob.field.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: boolean }) => {
        const meta = statusOptions.value.find((item) => item.value === value) ?? statusOptions.value[1];
        return (
          <ElTag type={meta.tagType} effect="plain">
            {meta.label}
          </ElTag>
        );
      },
    },
    { label: t('logJob.field.exceptionInfo'), prop: 'exceptionInfo', labelWidth: 120, copy: true },
    { label: t('logJob.field.elapsedTime'), prop: 'elapsedTime' },
    {
      label: t('logJob.field.createdAt'),
      prop: 'createdAt',
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    {
      label: t('table.createdByName'),
      prop: 'createdByName',
      labelWidth: 120,
      cellRenderer: ({ value, row }: { value?: string | null; row: JobLogDetailRow }) => (
        <span>{value ?? row.createdBy ?? '—'}</span>
      ),
    },
  ]);

  return { detailColumns };
}

export default useJobLogDetailColumns;
