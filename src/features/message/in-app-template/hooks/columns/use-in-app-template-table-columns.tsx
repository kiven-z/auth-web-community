import type { MessageTemplatePageRow } from '@/features/message/api/message-template';
import { createAuditTableColumns } from '@/components/table/audit-columns';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信模板表格列配置（查询页）
 * @returns 表格列定义
 */
function useInAppTemplateTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    { label: t('inAppTemplate.templateCode'), prop: 'templateCode', minWidth: 160 },
    { label: t('inAppTemplate.templateName'), prop: 'templateName', minWidth: 160 },
    { label: t('inAppTemplate.subject'), prop: 'subject', minWidth: 200 },
    { label: t('inAppTemplate.contentType'), prop: 'imMessageType', width: 120 },
    { label: t('inAppTemplate.description'), prop: 'description', minWidth: 200 },
    { label: t('inAppTemplate.priority'), prop: 'priority', width: 120 },
    {
      label: t('inAppTemplate.status'),
      prop: 'status',
      width: 110,
      render: ({ row }: { row: MessageTemplatePageRow }) => {
        return row.status ? (
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

export default useInAppTemplateTableColumns;
