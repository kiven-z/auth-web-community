import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信模板导入弹窗表格列（仅启用模板）
 * @returns 表格列定义
 */
function useInAppTemplateImportTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
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
    { label: t('inAppTemplate.description'), prop: 'description', minWidth: 180 },
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 150,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useInAppTemplateImportTableColumns;
