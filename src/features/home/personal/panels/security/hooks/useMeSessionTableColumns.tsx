import type { MeUserSession } from '@/features/system/api/user/userMe';
import { formatMillisTimestamp } from '@/core/session/sessionTime';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 个人中心活跃会话表格列
 * @returns 表格列定义
 */
function useMeSessionTableColumns() {
  const { t } = useI18n();

  const meSessionTableColumns = computed<TableColumnList>(() => [
    { label: t('account.session.device'), prop: 'deviceType', minWidth: 90 },
    { label: t('users.session.browser'), prop: 'browserType', minWidth: 100 },
    { label: t('users.session.os'), prop: 'osType', minWidth: 100 },
    { label: t('account.session.region'), prop: 'ipRegion', minWidth: 120 },
    {
      label: t('account.session.loginAt'),
      minWidth: 170,
      render: ({ row }: { row: MeUserSession }) => formatMillisTimestamp(row.loginAt),
    },
    {
      label: t('account.session.current'),
      minWidth: 100,
      render: ({ row }: { row: MeUserSession }) =>
        row.current ? (
          <ElTag type="success" effect="plain">
            {t('account.session.current')}
          </ElTag>
        ) : (
          <span>—</span>
        ),
    },
    { label: t('table.actions'), fixed: 'right', minWidth: 90, slot: 'actions' },
  ]);

  return { meSessionTableColumns };
}

export default useMeSessionTableColumns;
