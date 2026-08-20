import { useCreateModuleTableTreePageState } from '@/features/system/_shared/hooks/useCreateModuleTableTreePageState';
import type { SysMenuListQuery, SysMenuListVO, SysMenuTreeNode } from '@/features/system/api/menu/menu';
import { getMenuList, getMenuPage } from '@/features/system/api/menu/menu';
import { reactive } from 'vue';

/**
 * 列表行
 */
export type SysMenuRow = SysMenuListVO;

export type MenuViewMode = 'table' | 'treeTable' | 'tree';

/**
 * 菜单页状态挂在模块级，供 `index`、表格视图、树视图共用。
 * 若在各组件内分别调用工厂函数，会得到多份独立的 `viewMode`，
 * 导致分段器切换后 `refresh` 仍按默认 `table` 只拉分页数据、不刷新 `treeData`。
 */
const searchForm = reactive<SysMenuListQuery>({
  name: undefined,
  title: undefined,
  menuType: undefined,
  status: undefined,
  component: undefined,
});

const innerPageState = useCreateModuleTableTreePageState<SysMenuRow, SysMenuListVO, SysMenuTreeNode, MenuViewMode>({
  searchForm,
  fetchPage: (q) => getMenuPage(q),
  fetchFlatList: (query) => getMenuList(query),
  initialViewMode: 'table',
});

function useMenuPageState() {
  return innerPageState();
}

export default useMenuPageState;
