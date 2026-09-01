import { formatDateTime } from '@/shared/utils/date/date-time';
import type { MeLoginLogPageRow } from '@/features/system/api/user/user-me';
import useLoginLogOptions from '@/components/domain/log/login-log-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 个人中心登录日志表格列
 * @returns 表格列定义
 */
function useMeLoginLogTableColumns() {
  const { t } = useI18n();
  const { loginResultOptions, loginTypeOptions } = useLoginLogOptions();

  const meLoginLogTableColumns = computed(() => [
    {
      label: t('loginLog.field.loginTime'),
      prop: 'loginTime',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: MeLoginLogPageRow }) => formatDateTime(row.loginTime),
    },
    {
      label: t('loginLog.field.loginRegion'),
      prop: 'loginRegion',
      minWidth: 140,
    },
    {
      label: t('loginLog.field.loginResult'),
      prop: 'loginResult',
      minWidth: 140,
      render: ({ row }: { row: MeLoginLogPageRow }) => {
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
      label: t('loginLog.field.loginType'),
      prop: 'loginType',
      minWidth: 130,
      render: ({ row }: { row: MeLoginLogPageRow }) => {
        if (!row.loginType) return '';
        const option = loginTypeOptions.value.find((item) => item.value === row.loginType);
        return option?.label ?? row.loginType;
      },
    },
  ]);

  return { meLoginLogTableColumns };
}

export default useMeLoginLogTableColumns;
