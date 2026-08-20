import { formatDateTime } from '@/shared/utils/date/dateTime';
import useAuthorizationAuditOptions from '@/features/log/authorization-audit-log/hooks/options/useAuthorizationAuditOptions';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限决策审计日志详情描述列
 * @returns 详情列配置
 */
function useAuthorizationAuditDetailColumns() {
  const { t } = useI18n();
  const { eventTypeOptions } = useAuthorizationAuditOptions();

  const detailColumns = computed(() => [
    {
      label: t('authorizationAudit.eventType'),
      prop: 'eventType',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: string }) => {
        const option = eventTypeOptions.value.find((item) => item.value === value);
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
    { label: t('authorizationAudit.sessionId'), prop: 'sessionId', labelWidth: 120, copy: true },
    { label: t('authorizationAudit.requiredPermission'), prop: 'requiredPermission', labelWidth: 120, copy: true },
    { label: t('authorizationAudit.requestMethod'), prop: 'requestMethod', labelWidth: 120 },
    { label: t('authorizationAudit.requestUri'), prop: 'requestUri', labelWidth: 120, copy: true },
    { label: t('authorizationAudit.requestIp'), prop: 'requestIp', labelWidth: 120, copy: true },
    { label: t('authorizationAudit.decisionReason'), prop: 'decisionReason', labelWidth: 120 },
    { label: t('authorizationAudit.decisionDetail'), prop: 'decisionDetail', labelWidth: 120, copy: true },
    { label: t('authorizationAudit.userPermissionsSummary'), prop: 'userPermissionsSummary', labelWidth: 120 },
    { label: t('authorizationAudit.policyCode'), prop: 'policyCode', labelWidth: 120, copy: true },
    { label: t('authorizationAudit.policyDecision'), prop: 'policyDecision', labelWidth: 120 },
    { label: t('authorizationAudit.className'), prop: 'className', labelWidth: 120, copy: true },
    { label: t('authorizationAudit.methodName'), prop: 'methodName', labelWidth: 120, copy: true },
    { label: t('authorizationAudit.methodParams'), prop: 'methodParams', labelWidth: 120 },
    { label: t('authorizationAudit.exceptionMessage'), prop: 'exceptionMessage', labelWidth: 120 },
    { label: t('authorizationAudit.remark'), prop: 'remark', labelWidth: 120, copy: true },
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

export default useAuthorizationAuditDetailColumns;
