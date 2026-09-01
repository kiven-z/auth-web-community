import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/boolean-status-tag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信模板详情描述列
 * @returns 详情列配置
 */
function useInAppTemplateDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('inAppTemplate.templateCode'), prop: 'templateCode', labelWidth: 140, copy: true },
    { label: t('inAppTemplate.templateName'), prop: 'templateName', labelWidth: 140, copy: true },
    { label: t('inAppTemplate.subject'), prop: 'subject', labelWidth: 140, copy: true, span: 2 },
    { label: t('messageTemplate.previewSubject'), prop: 'previewSubject', labelWidth: 140, copy: true, span: 2 },
    { label: t('inAppTemplate.description'), prop: 'description', labelWidth: 140, copy: true, span: 2 },
    { label: t('inAppTemplate.contentType'), prop: 'imMessageType', labelWidth: 140, copy: true },
    { label: t('inAppTemplate.linkUrl'), prop: 'linkUrl', labelWidth: 140, copy: true, span: 2 },
    { label: t('inAppTemplate.priority'), prop: 'priority', labelWidth: 140, copy: true },
    {
      label: t('inAppTemplate.status'),
      prop: 'status',
      labelWidth: 140,
      cellRenderer: ({ value }: { value: boolean }) => (value ? renderActiveStatusTag() : renderInactiveStatusTag()),
    },
    {
      label: t('messageTemplate.requireFieldsJson'),
      prop: 'requireFields',
      labelWidth: 140,
      span: 2,
      cellRenderer: ({ value }: { value: unknown }) => (
        <span class="whitespace-pre-wrap break-all text-left">{JSON.stringify(value ?? [])}</span>
      ),
    },
  ]);

  return { detailColumns };
}

export default useInAppTemplateDetailColumns;
