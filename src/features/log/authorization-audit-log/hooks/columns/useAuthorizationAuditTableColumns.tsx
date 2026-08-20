import { formatDateTime } from '@/shared/utils/date/dateTime';
import type { AuthorizationAuditPageRow } from '@/features/log/api/authorization-audit';
import { selectUserinfo } from '@/components/domain/user/UserProfile';
import useAuthorizationAuditOptions from '@/features/log/authorization-audit-log/hooks/options/useAuthorizationAuditOptions';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useAuthorizationAuditTableColumns() {
  const { t } = useI18n();
  const { eventTypeOptions } = useAuthorizationAuditOptions();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'selection',
      width: 50,
    },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('authorizationAudit.eventType'),
      prop: 'eventType',
      minWidth: 110,
      render: ({ row }: { row: AuthorizationAuditPageRow }) => {
        if (!row.eventType) {
          return <span>—</span>;
        }
        const option = eventTypeOptions.value.find((item) => item.value === row.eventType);
        if (!option) {
          return <span>{row.eventType}</span>;
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('authorizationAudit.decisionReason'),
      prop: 'decisionReason',
      minWidth: 140,
    },
    {
      label: t('authorizationAudit.className'),
      prop: 'className',
      minWidth: 200,
    },
    {
      label: t('authorizationAudit.methodName'),
      prop: 'methodName',
      minWidth: 160,
    },
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: AuthorizationAuditPageRow }) => formatDateTime(row.createdAt),
    },
    {
      label: t('table.createdByName'),
      prop: 'createdBy',
      minWidth: 130,
      render: ({ row }: { row: AuthorizationAuditPageRow }) => {
        return (
          row.createdBy && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createdBy, row.createdByName)}>
              {row.createdByName}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.updatedByName'),
      prop: 'updatedBy',
      minWidth: 130,
      render: ({ row }: { row: AuthorizationAuditPageRow }) => {
        return (
          row.updatedBy && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updatedBy, row.updatedByName)}>
              {row.updatedByName}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useAuthorizationAuditTableColumns;
