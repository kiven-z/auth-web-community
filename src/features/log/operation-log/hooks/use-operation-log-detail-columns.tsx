import { formatDateTime } from '@/shared/utils/date/date-time';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 操作日志详情描述列
 * @returns 详情列配置
 */
function useOperationLogDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('operationLog.userId'), prop: 'userId', labelWidth: 120, copy: true },
    { label: t('operationLog.username'), prop: 'username', labelWidth: 120, copy: true },
    { label: t('operationLog.module'), prop: 'module', labelWidth: 120, copy: true },
    {
      label: t('operationLog.operationType'),
      prop: 'operationType',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: string }) => {
        const key = `operationLog.operationTypeEnum.${value}`;
        const label = t(key);
        return <span>{label === key ? value : label}</span>;
      },
    },
    { label: t('operationLog.targetType'), prop: 'targetType', labelWidth: 120 },
    { label: t('operationLog.targetId'), prop: 'targetId', labelWidth: 120, copy: true },
    { label: t('operationLog.requestMethod'), prop: 'requestMethod', labelWidth: 120 },
    { label: t('operationLog.requestUri'), prop: 'requestUri', labelWidth: 120, copy: true },
    { label: t('operationLog.requestParams'), prop: 'requestParams', labelWidth: 120 },
    { label: t('operationLog.responseStatus'), prop: 'responseStatus', labelWidth: 120 },
    { label: t('operationLog.responseMessage'), prop: 'responseMessage', labelWidth: 120 },
    { label: t('operationLog.executionTimeMs'), prop: 'executionTimeMs', labelWidth: 120 },
    { label: t('operationLog.ipAddress'), prop: 'ipAddress', labelWidth: 120, copy: true },
    { label: t('operationLog.userAgent'), prop: 'userAgent', labelWidth: 120 },
    { label: t('operationLog.remark'), prop: 'remark', labelWidth: 120, copy: true },
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      cellRenderer: ({ value }) => formatDateTime(value),
    },

    {
      label: t('table.updatedAt'),
      prop: 'updatedAt',
      cellRenderer: ({ value }) => formatDateTime(value),
    },
  ]);

  return { detailColumns };
}

export default useOperationLogDetailColumns;
