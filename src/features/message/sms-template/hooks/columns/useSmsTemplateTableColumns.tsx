import type { MessageTemplatePageRow } from '@/features/message/api/message-template';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/BooleanStatusTag';
import { createAuditTableColumns } from '@/components/table/AuditColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 短信模板表格列配置
 * @returns 表格列定义
 */
function useSmsTemplateTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    { label: t('smsTemplate.templateCode'), prop: 'templateCode', minWidth: 160 },
    { label: t('smsTemplate.templateName'), prop: 'templateName', minWidth: 160 },
    { label: t('smsTemplate.description'), prop: 'description', minWidth: 200 },
    { label: t('smsTemplate.priority'), prop: 'priority', width: 120 },
    {
      label: t('smsTemplate.status'),
      prop: 'status',
      width: 110,
      render: ({ row }: { row: MessageTemplatePageRow }) => {
        return row.status ? renderActiveStatusTag() : renderInactiveStatusTag();
      },
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

export default useSmsTemplateTableColumns;
