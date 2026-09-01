import type { UserSessionIndex } from '@/api/auth/session';
import { formatMillisTimestamp } from '@/core/session/session-time';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户活跃会话表格列
 * @returns 表格列定义
 */
function useUserSessionTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { label: t('users.session.device'), prop: 'deviceType', minWidth: 90, align: 'center' },
    {
      label: t('users.session.browser'),
      prop: 'browserType',
      minWidth: 100,
      align: 'center',
    },
    { label: t('users.session.os'), prop: 'osType', minWidth: 100, align: 'center' },
    {
      label: t('users.field.lastLoginIp'),
      prop: 'ipAddress',
      minWidth: 120,
      align: 'center',
    },
    {
      label: t('users.field.lastLoginRegion'),
      prop: 'ipRegion',
      minWidth: 120,
      align: 'center',
    },
    {
      label: t('users.session.loginAt'),
      minWidth: 170,
      align: 'center',
      render: ({ row }: { row: UserSessionIndex }) => formatMillisTimestamp(row.loginAt),
    },
    {
      label: t('users.session.rememberMe'),
      minWidth: 80,
      align: 'center',
      render: ({ row }: { row: UserSessionIndex }) => (row.rememberMe ? t('status.yes') : t('status.no')),
    },
    {
      label: t('users.session.expiresAt'),
      minWidth: 160,
      align: 'center',
      render: ({ row }: { row: UserSessionIndex }) => formatMillisTimestamp(row.refreshTokenExpiresAt),
    },
    { label: t('table.actions'), fixed: 'right', align: 'center', slot: 'actions' },
  ]);

  return { columns };
}

export default useUserSessionTableColumns;
