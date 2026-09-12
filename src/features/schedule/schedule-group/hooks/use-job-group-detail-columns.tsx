import { createAuditDetailColumns } from '@/components/table/audit-columns';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务分组详情描述列
 * @returns 详情列配置
 */
function useJobGroupDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('scheduleGroup.code'), prop: 'groupCode', labelWidth: 120, copy: true },
    { label: t('scheduleGroup.name'), prop: 'groupName', copy: true },
    { label: t('scheduleGroup.description'), prop: 'description', span: 2 },
    {
      label: t('scheduleGroup.status'),
      prop: 'status',
      cellRenderer: ({ value }) =>
        value ? (
          <ElTag type="success" effect="plain">
            {t('buttons.statusActiveText')}
          </ElTag>
        ) : (
          <ElTag type="danger" effect="plain">
            {t('buttons.statusInactiveText')}
          </ElTag>
        ),
    },
    {
      label: t('scheduleGroup.isSystem'),
      prop: 'isSystem',
      cellRenderer: ({ value }) => <span>{value ? t('buttons.permitText') : t('buttons.forbidText')}</span>,
    },
    { label: t('scheduleGroup.orderNum'), prop: 'orderNum' },
    ...createAuditDetailColumns(),
  ]);

  return { detailColumns };
}

export default useJobGroupDetailColumns;
