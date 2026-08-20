import type { RoleBoundMenuItem } from '@/features/system/api/models/role';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/BooleanStatusTag';
import { useMenuTypeOptions } from '@/features/system/_shared/hooks/options/useMenuTypeOptions';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 菜单固定列（角色详情「已绑菜单」）
 * @returns 菜单表格列定义
 */
function useMenuColumns() {
  const { t } = useI18n();
  const menuTypeOptions = useMenuTypeOptions();

  const menuColumns = computed<TableColumnList>(() => [
    {
      label: t('sysMenu.menuTitle'),
      prop: 'title',
      minWidth: 120,
      render: ({ row }: { row: RoleBoundMenuItem }) => t(row.title),
    },
    {
      label: t('sysMenu.routeName'),
      prop: 'name',
      minWidth: 140,
      render: ({ row }: { row: RoleBoundMenuItem }) => row.name ?? '-',
    },
    {
      label: t('sysMenu.path'),
      prop: 'path',
      minWidth: 140,
    },
    {
      label: t('sysMenu.menuType'),
      prop: 'menuType',
      minWidth: 100,
      render: ({ row }: { row: RoleBoundMenuItem }) => {
        const option = menuTypeOptions.value.find((item) => item.value === row.menuType);
        return option?.label ?? String(row.menuType ?? '');
      },
    },
    {
      label: t('sysMenu.status'),
      prop: 'status',
      minWidth: 90,
      render: ({ row }: { row: RoleBoundMenuItem }) => {
        return row.status ? renderActiveStatusTag() : renderInactiveStatusTag();
      },
    },
  ]);

  return { menuColumns };
}

export default useMenuColumns;
