import { useCreateModuleTableTreePageState } from '@/features/system/_shared/hooks/use-create-module-table-tree-page-state';
import {
  getDeptList,
  getDeptPage,
  type SysDeptListQuery,
  type SysDeptListVO,
  type SysDeptTableFilter,
  type SysDeptTreeNode,
} from '@/features/system/api/dept/dept';
import { reactive } from 'vue';

/**
 * 列表行
 */
export type SysDeptRow = SysDeptListVO;

export type DeptViewMode = 'table' | 'treeTable' | 'tree';

/**
 * 部门页状态挂在模块级，供 `index`、表格视图、树视图共用。
 */
const searchForm = reactive<SysDeptTableFilter>({
  deptName: undefined,
  deptCode: undefined,
  status: undefined,
});

const innerPageState = useCreateModuleTableTreePageState<SysDeptRow, SysDeptListVO, SysDeptTreeNode, DeptViewMode>({
  searchForm,
  fetchPage: (query) => getDeptPage(query),
  fetchFlatList: (query) => {
    const keyword = query.deptName || query.deptCode;
    const params: SysDeptListQuery = {};
    if (keyword) {
      params.keyword = keyword as string;
    }
    if (query.status !== undefined) {
      params.status = query.status as boolean;
    }
    return getDeptList(params);
  },
  initialViewMode: 'table',
});

function useDeptPageState() {
  return innerPageState();
}

export default useDeptPageState;
