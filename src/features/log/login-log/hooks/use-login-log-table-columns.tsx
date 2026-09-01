import { formatDateTime } from '@/shared/utils/date/date-time';
import type { LoginLogPageRow } from '@/features/log/api/login-log';
import { selectUserinfo } from '@/components/domain/user/user-profile';
import useLoginLogOptions from '@/components/domain/log/login-log-options';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useLoginLogTableColumns() {
  const { t } = useI18n();
  const { loginResultOptions, loginTypeOptions } = useLoginLogOptions();

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
      label: t('loginLog.field.user'),
      prop: 'username',
      minWidth: 130,
      render: ({ row }: { row: LoginLogPageRow }) => {
        const uid = row.userId;
        const displayName = row.username?.trim() || '—';
        if (!uid) {
          return <span>{displayName}</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(uid, row.username)}>
            {displayName}
          </ElButton>
        );
      },
    },
    {
      label: t('loginLog.field.loginResult'),
      prop: 'loginResult',
      minWidth: 140,
      render: ({ row }: { row: LoginLogPageRow }) => {
        const code = row.loginResult;
        if (code === undefined || code === null) return <span>—</span>;
        const option = loginResultOptions.value.find((item) => item.value === code);
        if (!option) return <span>{String(code)}</span>;

        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('loginLog.field.loginTime'),
      prop: 'loginTime',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: LoginLogPageRow }) => formatDateTime(row.loginTime),
    },
    {
      label: t('loginLog.field.loginRegion'),
      prop: 'loginRegion',
      minWidth: 140,
    },
    {
      label: t('loginLog.field.loginType'),
      prop: 'loginType',
      minWidth: 130,
      render: ({ row }: { row: LoginLogPageRow }) => {
        if (!row.loginType) return '';
        const option = loginTypeOptions.value.find((item) => item.value === row.loginType);
        return option?.label ?? row.loginType;
      },
    },
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: LoginLogPageRow }) => formatDateTime(row.createdAt),
    },
    {
      label: t('table.createdByName'),
      prop: 'createdBy',
      minWidth: 130,
      render: ({ row }: { row: LoginLogPageRow }) => {
        if (!row.createdBy) {
          return <span>—</span>;
        }
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
      label: t('table.actions'),
      fixed: 'right',
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useLoginLogTableColumns;
