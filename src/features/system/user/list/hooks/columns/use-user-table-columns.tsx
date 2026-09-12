import type { SysUserPageRow } from '@/features/system/api/user/user';
import useUserStatus from '@/components/domain/system/status/use-user-status';
import { selectUserinfo, UserAvatar } from '@/components/domain/user/user-profile';
import { Auth } from '@/auth/permission';
import { SYS_USER_PERMS } from '@/features/system/user/constants/permissions';
import { createAuditTableColumns } from '@/components/table/audit-columns';
import { ElButton } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户表格列
 * @returns 表格列定义
 */
function useUserTableColumns() {
  const { t } = useI18n();
  const { renderUserAccountStatus } = useUserStatus();
  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    {
      label: t('users.field.username'),
      prop: 'username',
      minWidth: 120,
      render: ({ row }: { row: SysUserPageRow }) => (
        <Auth code={SYS_USER_PERMS.QUERY}>
          <ElButton link type="primary" onClick={() => selectUserinfo(row.id, row.username)}>
            {row.username}
          </ElButton>
        </Auth>
      ),
    },
    { label: t('users.field.nickname'), prop: 'nickname', minWidth: 120 },
    {
      label: t('users.field.avatarURL'),
      prop: 'avatar',
      minWidth: 72,
      render: ({ row }: { row: SysUserPageRow }) => (
        <UserAvatar avatar={row.avatar} name={row.nickname || row.username} size={32} />
      ),
    },
    { label: t('users.field.phone'), prop: 'phone', minWidth: 130 },
    { label: t('users.field.email'), prop: 'email', minWidth: 160 },
    { label: t('relation.employeeNo'), prop: 'employeeNo', minWidth: 100 },
    {
      label: t('users.field.status'),
      prop: 'status',
      minWidth: 100,
      render: ({ row }: { row: SysUserPageRow }) => renderUserAccountStatus(row.status),
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      minWidth: 100,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useUserTableColumns;
