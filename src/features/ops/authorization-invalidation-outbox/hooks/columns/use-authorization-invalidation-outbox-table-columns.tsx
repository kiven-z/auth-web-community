import { formatDateTime } from '@/shared/utils/date/date-time';
import type { AuthorizationInvalidationOutboxPageRow } from '@/features/ops/api/authorization-invalidation-outbox';
import { selectUserinfo } from '@/components/domain/user/user-profile';
import useAuthorizationInvalidationOptions from '@/features/ops/_shared/hooks/options/use-authorization-invalidation-options';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效 Outbox 表格列
 * @returns 表格列定义
 */
function useAuthorizationInvalidationOutboxTableColumns() {
  const { t } = useI18n();
  const { changeKindOptions, outboxStatusOptions } = useAuthorizationInvalidationOptions();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('authorizationInvalidation.eventId'),
      prop: 'eventId',
      minWidth: 220,
    },
    {
      label: t('authorizationInvalidation.changeKind'),
      prop: 'changeKind',
      minWidth: 120,
      render: ({ row }: { row: AuthorizationInvalidationOutboxPageRow }) => {
        const option = changeKindOptions.value.find((item) => item.value === row.changeKind);
        return option?.label ?? row.changeKind ?? '-';
      },
    },
    {
      label: t('authorizationInvalidation.outboxStatus'),
      prop: 'status',
      minWidth: 110,
      render: ({ row }: { row: AuthorizationInvalidationOutboxPageRow }) => {
        if (!row.status) {
          return '-';
        }
        const option = outboxStatusOptions.value.find((item) => item.value === row.status);
        if (!option) {
          return row.status;
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('authorizationInvalidation.retryCount'),
      prop: 'retryCount',
      minWidth: 90,
      render: ({ row }: { row: AuthorizationInvalidationOutboxPageRow }) => {
        return `${row.retryCount}/${row.maxRetry}`;
      },
    },
    {
      label: t('authorizationInvalidation.nextRetryAt'),
      prop: 'nextRetryAt',
      minWidth: 170,
      render: ({ row }: { row: AuthorizationInvalidationOutboxPageRow }) => formatDateTime(row.nextRetryAt),
    },
    {
      label: t('authorizationInvalidation.lastError'),
      prop: 'lastError',
      minWidth: 180,
      render: ({ row }: { row: AuthorizationInvalidationOutboxPageRow }) => {
        const error = row.lastError;
        if (!error) return '-';
        return error.length > 40 ? `${error.slice(0, 40)}…` : error;
      },
    },
    {
      label: t('authorizationInvalidation.sourceModule'),
      prop: 'sourceModule',
      minWidth: 120,
    },
    {
      label: t('authorizationInvalidation.sourceBizId'),
      prop: 'sourceBizId',
      minWidth: 160,
    },
    {
      label: t('authorizationInvalidation.processedAt'),
      prop: 'processedAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: AuthorizationInvalidationOutboxPageRow }) => formatDateTime(row.processedAt),
    },
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: AuthorizationInvalidationOutboxPageRow }) => formatDateTime(row.createdAt),
    },
    {
      label: t('table.createdByName'),
      prop: 'createdBy',
      minWidth: 130,
      render: ({ row }: { row: AuthorizationInvalidationOutboxPageRow }) => {
        return row.createdBy ? (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createdBy, row.createdByName)}>
            {row.createdByName}
          </ElButton>
        ) : (
          '-'
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 140,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useAuthorizationInvalidationOutboxTableColumns;
