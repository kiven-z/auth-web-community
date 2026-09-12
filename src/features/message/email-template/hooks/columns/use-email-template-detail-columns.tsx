import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 邮件模板详情描述列
 * @returns 详情列配置
 */
function useEmailTemplateDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('emailTemplate.templateCode'), prop: 'templateCode', labelWidth: 120, copy: true },
    { label: t('emailTemplate.templateName'), prop: 'templateName', labelWidth: 120, copy: true },
    { label: t('emailTemplate.subject'), prop: 'subject', labelWidth: 120, copy: true, span: 2 },
    { label: t('messageTemplate.previewSubject'), prop: 'previewSubject', labelWidth: 120, copy: true, span: 2 },
    { label: t('emailTemplate.description'), prop: 'description', labelWidth: 120, copy: true, span: 2 },
    { label: t('emailTemplate.priority'), prop: 'priority', labelWidth: 120, copy: true },
    {
      label: t('emailTemplate.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }) =>
        value ? (
          <ElTag type="success" effect="plain">
            {t('buttons.statusActiveText')}
          </ElTag>
        ) : (
          <ElTag type="danger" effect="plain">
            {t('buttons.statusInactiveText')}
          </ElTag>
        ),
    },
    {
      label: t('messageTemplate.requireFieldsJson'),
      prop: 'requireFields',
      labelWidth: 120,
      span: 2,
      cellRenderer: ({ value }) => (
        <span class="text-left break-all whitespace-pre-wrap">{JSON.stringify(value ?? [])}</span>
      ),
    },
  ]);

  return { detailColumns };
}

export default useEmailTemplateDetailColumns;
