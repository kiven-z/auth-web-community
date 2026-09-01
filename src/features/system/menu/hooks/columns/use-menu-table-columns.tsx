import { formatDateTime } from '@/shared/utils/date/date-time';
import { useRenderIcon } from '@/components/ui/icon';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/boolean-status-tag';
import { transformI18n } from '@/app/plugins/i18n';
import type { SysMenuRow } from '@/features/system/menu/hooks/use-menu-page-state';
import { ElTag, ElText } from 'element-plus';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMenuTypeOptions } from '@/features/system/_shared/hooks/options/use-menu-type-options';

/**
 * 菜单管理表格列（表格视图与树形视图共用）
 * @returns `tableColumns` 列定义
 */
function useMenuTableColumns() {
  const { t } = useI18n();
  const menuTypeOptions = useMenuTypeOptions();

  const tableColumns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      width: 60,
    },
    {
      label: t('sysMenu.menuTitle'),
      prop: 'title',
      render: ({ row }: { row: SysMenuRow }) => {
        return <ElText>{transformI18n(row.title)}</ElText>;
      },
      minWidth: 160,
    },
    { label: t('sysMenu.routeName'), prop: 'name', minWidth: 160 },
    { label: t('sysMenu.path'), prop: 'path', minWidth: 180 },
    {
      label: t('sysMenu.menuType'),
      prop: 'menuType',
      width: 100,
      render: ({ row }: { row: SysMenuRow }) => {
        const option = menuTypeOptions.value.find((item) => item.value === row.menuType);
        if (!option) return '-';
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    { label: t('sysMenu.menuRank'), prop: 'menuRank', width: 80 },
    {
      label: t('menus.icon'),
      prop: 'icon',
      width: 80,
      render: ({ row }: { row: SysMenuRow }) => {
        if (!row.icon) {
          return '';
        }
        return <span className="flex justify-center text-xl">{h(useRenderIcon(row.icon))}</span>;
      },
    },
    {
      label: t('sysMenu.status'),
      prop: 'status',
      width: 95,
      render: ({ row }: { row: SysMenuRow }) => (row.status ? renderActiveStatusTag() : renderInactiveStatusTag()),
    },
    {
      label: t('sysMenu.showLink'),
      prop: 'showLink',
      width: 90,
      render: ({ row }: { row: SysMenuRow }) => (
        <ElTag type={row.showLink ? 'success' : 'info'} effect="plain">
          {row.showLink ? t('sysMenu.showLinkYes') : t('sysMenu.showLinkNo')}
        </ElTag>
      ),
    },
    {
      label: t('sysMenu.keepAlive'),
      prop: 'keepAlive',
      width: 90,
      render: ({ row }: { row: SysMenuRow }) => (
        <ElTag type={row.keepAlive ? 'success' : 'info'} effect="plain">
          {row.keepAlive ? t('sysMenu.keepAliveYes') : t('sysMenu.keepAliveNo')}
        </ElTag>
      ),
    },
    {
      label: t('table.updatedAt'),
      prop: 'updatedAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: SysMenuRow }) => formatDateTime(row.updatedAt),
    },
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      sortable: true,
      minWidth: 170,
      render: ({ row }: { row: SysMenuRow }) => formatDateTime(row.createdAt),
    },
    {
      label: t('table.actions'),
      fixed: 'right',
      minWidth: 260,
      slot: 'actions',
    },
  ]);

  return { tableColumns };
}

export default useMenuTableColumns;
