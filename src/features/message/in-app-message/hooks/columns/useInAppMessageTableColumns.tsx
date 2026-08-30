import type { InAppSendTaskPageRow } from '@/features/message/api/inAppMessage';
import { createAuditTableColumns } from '@/components/table/AuditColumns';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import useInAppMessageOptions from '@/features/message/_shared/hooks/options/useInAppMessageOptions';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信发送任务表格列配置
 * @returns 表格列定义
 */
function useInAppMessageTableColumns() {
  const { t } = useI18n();
  const { statusOptions, sourceOptions, scopeOptions } = useInAppMessageOptions();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', width: 48 },
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
      label: t('inAppMessage.field.totalCount'),
      prop: 'totalCount',
      minWidth: 100,
    },
    {
      label: t('inAppMessage.field.successCount'),
      prop: 'successCount',
      minWidth: 100,
    },
    {
      label: t('inAppMessage.field.failCount'),
      prop: 'failCount',
      minWidth: 100,
    },
    {
      label: t('inAppMessage.field.sceneCode'),
      prop: 'sceneCode',
      minWidth: 140,
    },
    {
      label: t('inAppMessage.field.recalledAt'),
      prop: 'recalledAt',
      minWidth: 170,
      render: ({ row }: { row: InAppSendTaskPageRow }) => formatDateTime(row.recalledAt),
    },
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

export default useInAppMessageTableColumns;
