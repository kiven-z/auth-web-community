import type { OnlineUserPageRow } from '@/api/auth/online-user';
import { formatMillisTimestamp } from '@/core/session/session-time';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 在线用户表格列
 * @returns 表格列定义
 */
function useOnlineUserTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    { label: t('users.field.username'), prop: 'username', minWidth: 120 },
    { label: t('users.field.nickname'), prop: 'nickname', minWidth: 120 },
    {
      label: t('onlineUser.field.sessionCount'),
      prop: 'activeSessionCount',
      minWidth: 110,
    },
    {
      label: t('onlineUser.field.loginAt'),
      minWidth: 170,
      render: ({ row }: { row: OnlineUserPageRow }) => formatMillisTimestamp(row.lastLoginAt),
    },
    { label: t('table.actions'), fixed: 'right', minWidth: 200, slot: 'actions' },
  ]);

  return { columns };
}

export default useOnlineUserTableColumns;
