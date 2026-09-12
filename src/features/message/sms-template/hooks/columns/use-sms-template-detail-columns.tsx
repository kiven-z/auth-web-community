import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 短信模板详情描述列
 * @returns 详情列配置
 */
function useSmsTemplateDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('smsTemplate.templateCode'), prop: 'templateCode', labelWidth: 140, copy: true },
    { label: t('smsTemplate.templateName'), prop: 'templateName', labelWidth: 140, copy: true },
    {
      label: t('smsTemplate.providerTemplateCode'),
      prop: 'providerTemplateCode',
      labelWidth: 140,
      copy: true,
      span: 2,
    },
    { label: t('smsTemplate.description'), prop: 'description', labelWidth: 140, copy: true, span: 2 },
    { label: t('smsTemplate.priority'), prop: 'priority', labelWidth: 140, copy: true },
    {
      label: t('smsTemplate.status'),
      prop: 'status',
      labelWidth: 140,
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
      labelWidth: 140,
      span: 2,
      cellRenderer: ({ value }) => (
        <span class="text-left break-all whitespace-pre-wrap">{JSON.stringify(value ?? [])}</span>
      ),
    },
  ]);

  return { detailColumns };
}

export default useSmsTemplateDetailColumns;
