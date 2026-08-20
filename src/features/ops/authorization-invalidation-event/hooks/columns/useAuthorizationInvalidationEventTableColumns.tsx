import { formatDateTime } from '@/shared/utils/date/dateTime';
import type { AuthorizationInvalidationEventPageRow } from '@/features/ops/api/authorization-invalidation-event';
import { selectUserinfo } from '@/components/domain/user/UserProfile';
import useAuthorizationInvalidationOptions from '@/features/ops/_shared/hooks/options/useAuthorizationInvalidationOptions';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效幂等事件表格列
 * @returns 表格列定义
 */
function useAuthorizationInvalidationEventTableColumns() {
  const { t } = useI18n();
  const { changeKindOptions, processingFilterOptions } = useAuthorizationInvalidationOptions();

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
      render: ({ row }: { row: AuthorizationInvalidationEventPageRow }) => {
        const option = changeKindOptions.value.find((item) => item.value === row.changeKind);
        return option?.label ?? row.changeKind ?? '-';
      },
    },
    {
      label: t('authorizationInvalidation.processing'),
      prop: 'processing',
      minWidth: 110,
      render: ({ row }: { row: AuthorizationInvalidationEventPageRow }) => {
        if (!row.processing) {
          return '-';
        }
        const option = processingFilterOptions.value.find((item) => item.value === row.processing);
        if (!option) {
          return '-';
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('authorizationInvalidation.impactedUserCount'),
      prop: 'impactedUserCount',
      minWidth: 110,
      render: ({ row }: { row: AuthorizationInvalidationEventPageRow }) => row.impactedUserCount ?? '-',
    },
    {
      label: t('authorizationInvalidation.versionBumpedCount'),
      prop: 'versionBumpedCount',
      minWidth: 130,
      render: ({ row }: { row: AuthorizationInvalidationEventPageRow }) => row.versionBumpedCount ?? '-',
    },
    {
      label: t('authorizationInvalidation.profileRefreshedCount'),
      prop: 'profileRefreshedCount',
      minWidth: 130,
      render: ({ row }: { row: AuthorizationInvalidationEventPageRow }) => row.profileRefreshedCount ?? '-',
    },
    {
      label: t('authorizationInvalidation.profileEvictedCount'),
      prop: 'profileEvictedCount',
      minWidth: 130,
      render: ({ row }: { row: AuthorizationInvalidationEventPageRow }) => row.profileEvictedCount ?? '-',
    },
    {
      label: t('authorizationInvalidation.processedAt'),
      prop: 'processedAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: AuthorizationInvalidationEventPageRow }) => formatDateTime(row.processedAt),
    },
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: AuthorizationInvalidationEventPageRow }) => formatDateTime(row.createdAt),
    },
    {
      label: t('table.createdByName'),
      prop: 'createdBy',
      minWidth: 130,
      render: ({ row }: { row: AuthorizationInvalidationEventPageRow }) => {
        if (!row.createdBy) {
          return '-';
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createdBy, row.createdByName)}>
            {row.createdByName}
          </ElButton>
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right',
      width: 160,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useAuthorizationInvalidationEventTableColumns;
