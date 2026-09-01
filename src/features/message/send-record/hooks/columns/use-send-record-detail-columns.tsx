import { createAuditDetailColumns } from '@/components/table/audit-columns';
import { formatDateTime } from '@/shared/utils/date/date-time';
import useSendRecordOptions from '@/features/message/send-record/hooks/options/use-send-record-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 发送记录详情描述列
 * @returns 详情列配置
 */
function useSendRecordDetailColumns() {
  const { t } = useI18n();
  const { channelOptions, statusOptions } = useSendRecordOptions();

  const detailColumns = computed(() => [
    {
      label: t('sendRecord.field.taskId'),
      prop: 'taskId',
      labelWidth: 120,
      copy: true,
    },
    {
      label: t('sendRecord.field.channel'),
      prop: 'channel',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const option = channelOptions.value.find((item) => item.value === value);
        return <span>{option?.label ?? value}</span>;
      },
    },
    {
      label: t('sendRecord.field.targetValue'),
      prop: 'targetValue',
      labelWidth: 120,
      copy: true,
    },
    {
      label: t('sendRecord.field.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const option = statusOptions.value.find((item) => item.value === value);
        if (!option) {
          return <span>{value}</span>;
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('sendRecord.field.providerMsgId'),
      prop: 'providerMsgId',
      labelWidth: 120,
      copy: true,
    },
    {
      label: t('sendRecord.field.errorCode'),
      prop: 'errorCode',
      labelWidth: 120,
      copy: true,
    },
    {
      label: t('sendRecord.field.errorMessage'),
      prop: 'errorMessage',
      labelWidth: 120,
      span: 2,
    },
    {
      label: t('sendRecord.field.sentAt'),
      prop: 'sentAt',
      cellRenderer: ({ value }) => formatDateTime(value),
      labelWidth: 120,
    },
    {
      label: t('sendRecord.field.retryCount'),
      prop: 'retryCount',
      labelWidth: 120,
    },
    {
      label: t('sendRecord.field.remark'),
      prop: 'remark',
      labelWidth: 120,
      span: 2,
    },
    ...createAuditDetailColumns(),
  ]);

  return { detailColumns };
}

export default useSendRecordDetailColumns;
