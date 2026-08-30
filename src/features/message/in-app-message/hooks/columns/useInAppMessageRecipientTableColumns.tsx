import type { InAppSendTaskRecipientPageRow } from '@/features/message/api/in-app-message';
import { selectUserinfo } from '@/components/domain/user/UserProfile';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信任务收件人表格列配置
 * @returns 表格列定义
 */
function useInAppMessageRecipientTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('inAppMessage.field.username'),
      prop: 'username',
      minWidth: 140,
      render: ({ row }: { row: InAppSendTaskRecipientPageRow }) => {
        return (
          row.userId && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.userId, row.username)}>
              {row.username || row.userId}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('inAppMessage.field.isRead'),
      prop: 'isRead',
      minWidth: 100,
      render: ({ row }: { row: InAppSendTaskRecipientPageRow }) => {
        return (
          <ElTag type={row.isRead ? 'success' : 'info'} effect="plain">
            {row.isRead ? t('inAppMessage.readStatus.read') : t('inAppMessage.readStatus.unread')}
          </ElTag>
        );
      },
    },
    {
      label: t('inAppMessage.field.readTime'),
      prop: 'readTime',
      minWidth: 170,
      render: ({ row }: { row: InAppSendTaskRecipientPageRow }) => formatDateTime(row.readTime),
    },
    {
      label: t('inAppMessage.field.isDeleted'),
      prop: 'isDeleted',
      minWidth: 110,
      render: ({ row }: { row: InAppSendTaskRecipientPageRow }) => {
        return (
          <ElTag type={row.isDeleted ? 'danger' : 'success'} effect="plain">
            {row.isDeleted ? t('inAppMessage.deletedStatus.deleted') : t('inAppMessage.deletedStatus.active')}
          </ElTag>
        );
      },
    },
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      minWidth: 170,
      render: ({ row }: { row: InAppSendTaskRecipientPageRow }) => formatDateTime(row.createdAt),
    },
    {
      label: t('table.updatedAt'),
      prop: 'updatedAt',
      minWidth: 170,
      render: ({ row }: { row: InAppSendTaskRecipientPageRow }) => formatDateTime(row.updatedAt),
    },
  ]);

  return { columns };
}

export default useInAppMessageRecipientTableColumns;
