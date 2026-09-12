import { transformI18n } from '@/app/plugins/i18n';
import { useRenderIcon } from '@/components/ui/icon';
import { useMenuTypeOptions } from '@/features/system/_shared/hooks/options/use-menu-type-options';
import type { SysMenuRow } from '@/features/system/menu/hooks/use-menu-page-state';
import { formatDateTime } from '@/shared/utils/date/date-time';
import { ElTag, ElText } from 'element-plus';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';

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
      render: ({ row }: { row: SysMenuRow }) =>
        row.status ? (
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
      label: t('sysMenu.showLink'),
      prop: 'showLink',
      width: 90,
      render: ({ row }: { row: SysMenuRow }) =>
        row.showLink ? (
          <ElTag type="success" effect="plain">
            {t('sysMenu.showLinkYes')}
          </ElTag>
        ) : (
          <ElTag type="info" effect="plain">
            {t('sysMenu.showLinkNo')}
          </ElTag>
        ),
    },
    {
      label: t('sysMenu.keepAlive'),
      prop: 'keepAlive',
      width: 90,
      render: ({ row }: { row: SysMenuRow }) =>
        row.keepAlive ? (
          <ElTag type="success" effect="plain">
            {t('sysMenu.keepAliveYes')}
          </ElTag>
        ) : (
          <ElTag type="info" effect="plain">
            {t('sysMenu.keepAliveNo')}
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
