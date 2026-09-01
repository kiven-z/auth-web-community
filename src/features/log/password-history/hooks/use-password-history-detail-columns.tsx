import { formatDateTime } from '@/shared/utils/date/date-time';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 密码历史详情描述列
 * @returns 详情列配置
 */
function usePasswordHistoryDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    {
      label: t('passwordHistory.userId'),
      prop: 'userId',
      labelWidth: 120,
      copy: true,
      cellRenderer: ({ value }: { value?: string | null }) => <span>{value ?? '—'}</span>,
    },
    {
      label: t('passwordHistory.username'),
      prop: 'username',
      labelWidth: 120,
      copy: true,
      cellRenderer: ({ value }: { value?: string | null }) => <span>{value ?? '—'}</span>,
    },
    {
      label: t('passwordHistory.changeTime'),
      prop: 'createdAt',
      copy: true,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    { label: t('passwordHistory.changeIp'), prop: 'changeIp' },
    {
      label: t('table.updatedAt'),
      prop: 'updatedAt',
      cellRenderer: ({ value }) => formatDateTime(value),
    },
  ]);

  return { detailColumns };
}

export default usePasswordHistoryDetailColumns;
