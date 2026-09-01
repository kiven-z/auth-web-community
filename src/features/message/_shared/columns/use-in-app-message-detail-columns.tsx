import { createAuditDetailColumns } from '@/components/table/audit-columns';
import { formatDateTime } from '@/shared/utils/date/date-time';
import useInAppMessageOptions from '@/features/message/_shared/hooks/options/use-in-app-message-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信发送任务详情描述列
 * @returns 详情列配置
 */
function useInAppMessageDetailColumns() {
  const { t } = useI18n();
  const { statusOptions, sourceOptions, scopeOptions } = useInAppMessageOptions();

  const detailColumns = computed(() => [
    {
      label: t('inAppMessage.field.title'),
      prop: 'title',
      labelWidth: 120,
      copy: true,
      span: 2,
    },
    {
      label: t('inAppMessage.field.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const option = statusOptions.value.find((item) => item.value === value);
        if (!option) {
          return <span>{value}</span>;
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('inAppMessage.field.sourceType'),
      prop: 'sourceType',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const option = sourceOptions.value.find((item) => item.value === value);
        return <span>{option?.label ?? value}</span>;
      },
    },
    {
      label: t('inAppMessage.field.recipientScopeType'),
      prop: 'recipientScopeType',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const option = scopeOptions.value.find((item) => item.value === value);
        return <span>{option?.label ?? value}</span>;
      },
    },
    {
      label: t('inAppMessage.field.recipientScopeIds'),
      prop: 'recipientScopeIds',
      labelWidth: 120,
      span: 2,
      copy: true,
      cellRenderer: ({ value }) => {
        if (!Array.isArray(value) || value.length === 0) {
          return <span>—</span>;
        }
        return <span class="break-all">{value.join(', ')}</span>;
      },
    },
    {
      label: t('inAppMessage.field.includeChildren'),
      prop: 'includeChildren',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (value === null || value === undefined) {
          return <span>—</span>;
        }
        return <span>{value ? t('status.yes') : t('status.no')}</span>;
      },
    },
    { label: t('inAppMessage.field.contentType'), prop: 'contentType', labelWidth: 120 },
    { label: t('inAppMessage.field.categoryName'), prop: 'categoryName', labelWidth: 120 },
    { label: t('inAppMessage.field.sceneCode'), prop: 'sceneCode', labelWidth: 120, copy: true },
    { label: t('inAppMessage.field.senderUserId'), prop: 'senderUserId', labelWidth: 120, copy: true },
    {
      label: t('inAppMessage.field.linkUrl'),
      prop: 'linkUrl',
      labelWidth: 120,
      span: 2,
      copy: true,
    },
    { label: t('inAppMessage.field.totalCount'), prop: 'totalCount', labelWidth: 120 },
    { label: t('inAppMessage.field.successCount'), prop: 'successCount', labelWidth: 120 },
    { label: t('inAppMessage.field.failCount'), prop: 'failCount', labelWidth: 120 },
    {
      label: t('inAppMessage.field.recalledAt'),
      prop: 'recalledAt',
      labelWidth: 120,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    { label: t('inAppMessage.field.recallUserId'), prop: 'recallUserId', labelWidth: 120, copy: true },
    { label: t('inAppMessage.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
    ...createAuditDetailColumns(),
  ]);

  return { detailColumns };
}

export default useInAppMessageDetailColumns;
