<script lang="tsx" setup>
import type { DetailDialog } from '@/shared/types/dialog';
import type { SysJobDetailRow } from '@/features/schedule/api/job';
import Description from '@/components/ui/description';
import { createAuditDetailColumns } from '@/components/table/audit-columns';
import { formatDateTime } from '@/shared/utils/date/date-time';
import useJobFormOptions from '@/features/schedule/schedule-task/hooks/options/use-job-form-options';
import useJobRuntimeStatusOptions from '@/features/schedule/schedule-task/hooks/options/use-job-runtime-status-options';
import type { DescriptionItemProps } from 'element-plus';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobDescriptionDialog',
});

type JobDescriptionDialogProps = DetailDialog<SysJobDetailRow>;

/** 与 Description 组件 columns 项结构一致 */
type DescriptionColumn = Partial<DescriptionItemProps> & {
  label: string;
  prop: string;
  copy?: boolean;
  span?: number;
  cellRenderer?: (params: { value: any; data: any; index: number; row: SysJobDetailRow }) => any;
};

defineProps<JobDescriptionDialogProps>();
const { t } = useI18n();
const { taskTypeOptions, timeZoneOptions, misfirePolicyOptions } = useJobFormOptions();
const { quartzRuntimeStatusOptions, lastExecutionStatusOptions } = useJobRuntimeStatusOptions();

const descriptionColumns = computed(() => {
  const columns: DescriptionColumn[] = [
    { label: t('table.id'), prop: 'id', labelWidth: 120, copy: true },
    { label: t('scheduleTask.fields.jobName'), prop: 'jobName', labelWidth: 120, copy: true },
    { label: t('scheduleTask.fields.jobGroup'), prop: 'jobGroup', labelWidth: 120, copy: true },
    { label: t('scheduleTask.fields.jobGroupName'), prop: 'jobGroupName', labelWidth: 120 },
    {
      label: t('scheduleTask.fields.taskType'),
      prop: 'taskType',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        const option = taskTypeOptions.value.find((item) => item.value === value);
        if (!option) {
          return <span>{value ?? '—'}</span>;
        }
        return (
          <ElTag effect="plain" type="info">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.fields.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (value == null) {
          return <span>{'—'}</span>;
        }
        return value ? (
          <ElTag type="success" effect="plain">
            {t('buttons.statusActiveText')}
          </ElTag>
        ) : (
          <ElTag type="danger" effect="plain">
            {t('buttons.statusInactiveText')}
          </ElTag>
        );
      },
    },
    { label: t('scheduleTask.fields.invokeTarget'), prop: 'invokeTarget', labelWidth: 120, span: 2, copy: true },
    { label: t('scheduleTask.fields.jobClass'), prop: 'jobClass', labelWidth: 120, span: 2, copy: true },
    { label: t('scheduleTask.fields.cronExpression'), prop: 'cronExpression', labelWidth: 120, copy: true },
    {
      label: t('scheduleTask.fields.timeZone'),
      prop: 'timeZone',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        const option = timeZoneOptions.value.find((item) => item.value === value);
        return <span>{option?.label ?? value}</span>;
      },
    },
    {
      label: t('scheduleTask.fields.misfirePolicy'),
      prop: 'misfirePolicy',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        const option = misfirePolicyOptions.value.find((item) => item.value === value);
        return <span>{option?.label ?? '—'}</span>;
      },
    },
    {
      label: t('scheduleTask.fields.concurrent'),
      prop: 'concurrent',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (value == null) {
          return <span>{'—'}</span>;
        }
        return value ? (
          <ElTag type="success" effect="plain">
            {t('scheduleTask.enums.concurrent.allowed')}
          </ElTag>
        ) : (
          <ElTag type="info" effect="plain">
            {t('scheduleTask.enums.concurrent.forbidden')}
          </ElTag>
        );
      },
    },
    { label: t('scheduleTask.fields.startTime'), prop: 'startTime', labelWidth: 120 },
    { label: t('scheduleTask.fields.endTime'), prop: 'endTime', labelWidth: 120 },
    {
      label: t('scheduleTask.fields.previousFireTime'),
      prop: 'previousFireTime',
      labelWidth: 120,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    {
      label: t('scheduleTask.fields.nextFireTime'),
      prop: 'nextFireTime',
      labelWidth: 120,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    {
      label: t('scheduleTask.fields.quartzRuntimeStatus'),
      prop: 'quartzRuntimeStatus',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        const option = quartzRuntimeStatusOptions.value.find((item) => item.value === value);
        if (!option) {
          return <span>{value ?? '—'}</span>;
        }
        return (
          <ElTag effect="plain" type={option.tagType}>
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.fields.quartzFireTime'),
      prop: 'quartzFireTime',
      labelWidth: 120,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    {
      label: t('scheduleTask.fields.lastExecutionStatus'),
      prop: 'lastExecutionStatus',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        const option = lastExecutionStatusOptions.value.find((item) => item.value === value);
        if (!option) {
          return <span>{value ?? '—'}</span>;
        }
        return (
          <ElTag effect="plain" type={option.tagType}>
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.fields.lastExecutionTime'),
      prop: 'lastExecutionTime',
      labelWidth: 120,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    { label: t('scheduleTask.fields.jobParams'), prop: 'jobParams', labelWidth: 120, span: 2, copy: true },
    { label: t('scheduleTask.fields.remark'), prop: 'remark', labelWidth: 120, span: 2 },
    ...createAuditDetailColumns(),
  ];

  return columns;
});
</script>

<template>
  <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />
</template>
