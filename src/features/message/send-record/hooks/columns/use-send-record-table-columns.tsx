import type { ChannelDeliveryPageRow } from '@/features/message/api/channel-delivery';
import { createAuditTableColumns } from '@/components/table/audit-columns';
import { formatDateTime } from '@/shared/utils/date/date-time';
import useSendRecordOptions from '@/features/message/send-record/hooks/options/use-send-record-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 发送记录表格列配置
 * @returns 表格列定义
 */
function useSendRecordTableColumns() {
  const { t } = useI18n();
  const { channelOptions, statusOptions } = useSendRecordOptions();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', width: 48 },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('sendRecord.field.taskId'),
      prop: 'taskId',
      minWidth: 180,
    },
    {
      label: t('sendRecord.field.channel'),
      prop: 'channel',
      minWidth: 120,
      render: ({ row }: { row: ChannelDeliveryPageRow }) => {
        const option = channelOptions.value.find((item) => item.value === row.channel);
        return option?.label ?? row.channel ?? '—';
      },
    },
    {
      label: t('sendRecord.field.status'),
      prop: 'status',
      minWidth: 110,
      render: ({ row }: { row: ChannelDeliveryPageRow }) => {
        const option = statusOptions.value.find((item) => item.value === row.status);
        if (!option) {
          return <span>{row.status || '—'}</span>;
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
      minWidth: 160,
    },
    {
      label: t('sendRecord.field.errorCode'),
      prop: 'errorCode',
      minWidth: 120,
    },
    {
      label: t('sendRecord.field.sentAt'),
      prop: 'sentAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: ChannelDeliveryPageRow }) => formatDateTime(row.sentAt),
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useSendRecordTableColumns;
