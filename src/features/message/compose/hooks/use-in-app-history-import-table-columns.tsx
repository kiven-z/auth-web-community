import type { InAppSendTaskPageRow } from '@/features/message/api/in-app-message';
import { formatDateTime } from '@/shared/utils/date/date-time';
import useInAppMessageOptions from '@/features/message/_shared/hooks/options/use-in-app-message-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信历史发送导入弹窗表格列
 * @returns 表格列定义
 */
function useInAppHistoryImportTableColumns() {
  const { t } = useI18n();
  const { statusOptions, sourceOptions, scopeOptions } = useInAppMessageOptions();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('inAppMessage.field.title'),
      prop: 'title',
      minWidth: 180,
    },
    {
      label: t('inAppMessage.field.status'),
      prop: 'status',
      minWidth: 120,
      render: ({ row }: { row: InAppSendTaskPageRow }) => {
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
      label: t('inAppMessage.field.recipientScopeType'),
      prop: 'recipientScopeType',
      minWidth: 120,
      render: ({ row }: { row: InAppSendTaskPageRow }) => {
        const option = scopeOptions.value.find((item) => item.value === row.recipientScopeType);
        return option?.label ?? row.recipientScopeType ?? '—';
      },
    },
    {
      label: t('inAppMessage.field.sourceType'),
      prop: 'sourceType',
      minWidth: 130,
      render: ({ row }: { row: InAppSendTaskPageRow }) => {
        const option = sourceOptions.value.find((item) => item.value === row.sourceType);
        return option?.label ?? row.sourceType ?? '—';
      },
    },
    {
      label: t('inAppMessage.field.contentType'),
      prop: 'contentType',
      minWidth: 110,
    },
    {
      label: t('inAppMessage.field.categoryName'),
      prop: 'categoryName',
      minWidth: 110,
    },
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: InAppSendTaskPageRow }) => formatDateTime(row.createdAt),
    },
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 150,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useInAppHistoryImportTableColumns;
