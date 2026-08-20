import { createAuditDetailColumns } from '@/components/table/AuditColumns';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/BooleanStatusTag';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信业务分类详情描述列
 * @returns 详情列配置
 */
function useInAppCategoryDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('inAppCategory.field.code'), prop: 'code', labelWidth: 120, copy: true },
    { label: t('inAppCategory.field.name'), prop: 'name', labelWidth: 120, copy: true },
    {
      label: t('inAppCategory.field.parentName'),
      prop: 'parentId',
      labelWidth: 120,
      cellRenderer: ({ row }) => {
        const parentId = row?.parentId;
        if (!parentId || parentId === TREE_ROOT_PARENT_ID) {
          return <span>{t('inAppCategory.rootLabel')}</span>;
        }
        return <span>{row?.parentName || row?.parentCode || '—'}</span>;
      },
    },
    { label: t('inAppCategory.field.parentCode'), prop: 'parentCode', labelWidth: 120, copy: true },
    { label: t('inAppCategory.field.sortOrder'), prop: 'sortOrder', labelWidth: 120 },
    {
      label: t('inAppCategory.field.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: boolean }) => (value ? renderActiveStatusTag() : renderInactiveStatusTag()),
    },
    { label: t('inAppCategory.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
    ...createAuditDetailColumns(),
  ]);

  return { detailColumns };
}

export default useInAppCategoryDetailColumns;
