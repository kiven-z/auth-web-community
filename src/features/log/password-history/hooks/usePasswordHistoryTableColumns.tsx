import { formatDateTime } from '@/shared/utils/date/dateTime';
/**
 * 密码历史日志表格列定义
 */
import type { PasswordHistoryPageRow } from '@/features/log/api/password-history';
import { selectUserinfo } from '@/components/domain/user/UserProfile';
import { ElButton } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function usePasswordHistoryTableColumns() {
  const { t } = useI18n();

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
    // 用户
    {
      label: t('passwordHistory.userId'),
      prop: 'username',
      minWidth: 130,
      render: ({ row }: { row: PasswordHistoryPageRow }) => {
        const uid = row.userId;
        if (!uid) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(uid, row.username)}>
            {row.username ?? uid}
          </ElButton>
        );
      },
    },
    // 修改IP地址
    {
      label: t('passwordHistory.changeIp'),
      prop: 'changeIp',
      minWidth: 140,
    },
    // 修改时间
    {
      label: t('passwordHistory.changeTime'),
      prop: 'changeTime',
      sortable: true,
      minWidth: 160,
      render: ({ row }: { row: PasswordHistoryPageRow }) => formatDateTime(row.changeTime),
    },
    // 创建时间
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: PasswordHistoryPageRow }) => formatDateTime(row.createdAt),
    },
    // 创建人
    {
      label: t('table.createdByName'),
      prop: 'createdBy',
      minWidth: 130,
      render: ({ row }: { row: PasswordHistoryPageRow }) => {
        if (!row.createdBy) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createdBy, row.createdByName)}>
            {row.createdByName ?? row.createdBy}
          </ElButton>
        );
      },
    },
    // 更新人
    {
      label: t('table.updatedByName'),
      prop: 'updatedBy',
      minWidth: 130,
      render: ({ row }: { row: PasswordHistoryPageRow }) => {
        if (!row.updatedBy) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.updatedBy, row.updatedByName)}>
            {row.updatedByName ?? row.updatedBy}
          </ElButton>
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

export default usePasswordHistoryTableColumns;
