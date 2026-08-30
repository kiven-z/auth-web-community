import { getDeptList, type SysDeptListVO } from '@/features/system/api/dept/dept';
import { getUserPage, type SysUserPageRow } from '@/features/system/api/user/user';
import {
  type FetchTableDataFn,
  type FetchTableDataOptions,
  type PaginationTableState,
  usePaginationState,
} from '@/components/table/ListTable';
import { handleTree, TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import { USER_DEPT_ALL_NODE_ID } from '@/features/system/user/constants/deptTree';
import { useDebounceFn } from '@vueuse/core';
import type { FormInstance } from 'element-plus';
import { reactive, ref, watch } from 'vue';

/**
 * 用户管理左侧部门树节点
 */
export type UserDeptTreeNode = SysDeptListVO & { children?: UserDeptTreeNode[] };

const treeKeyword = ref('');
const treeData = ref<UserDeptTreeNode[]>([]);
const deptTreeReady = ref(false);
const deptTreeLoading = ref(false);
const currentNodeKey = ref(USER_DEPT_ALL_NODE_ID);

const searchForm = reactive({
  username: undefined,
  nickname: undefined,
  phone: undefined,
  email: undefined,
  employeeNo: undefined,
  status: undefined,
  deptId: undefined,
});

const userState = usePaginationState<SysUserPageRow>({
  fetchApi: getUserPage,
  searchForm,
});

/**
 * 构建带「全部」根节点的部门树
 * @param list 扁平部门列表
 * @returns 树形数据
 */
function buildDeptTreeWithAllRoot(list: SysDeptListVO[]): UserDeptTreeNode[] {
  const forest = handleTree(list) as UserDeptTreeNode[];
  return [
    {
      id: USER_DEPT_ALL_NODE_ID,
      parentId: TREE_ROOT_PARENT_ID,
      deptName: '',
      deptCode: '',
      status: true,
      effective: true,
      orderNum: -1,
      children: forest,
      createdAt: '',
      updatedAt: '',
    },
  ];
}

/**
 * 拉取部门树；空列表或异常时标记未就绪
 */
async function loadDeptTree() {
  deptTreeLoading.value = true;
  try {
    const keyword = treeKeyword.value;
    const list = await getDeptList({ keyword, status: true });

    treeData.value = buildDeptTreeWithAllRoot(list);
    deptTreeReady.value = true;
    currentNodeKey.value = USER_DEPT_ALL_NODE_ID;
    searchForm.deptId = undefined;
  } catch {
    treeData.value = [];
    deptTreeReady.value = false;
  } finally {
    deptTreeLoading.value = false;
  }
}

const debouncedLoadDeptTree = useDebounceFn(async () => {
  await loadDeptTree();
}, 300);

watch(treeKeyword, () => {
  debouncedLoadDeptTree();
});

/**
 * 拉取用户表格；部门树未就绪时保持空表
 * @param input 拉取选项；模板点击传入的 Event 视为普通刷新
 */
const fetchUserTable: FetchTableDataFn = async (input?: FetchTableDataOptions | Event) => {
  if (!deptTreeReady.value) {
    userState.tableData.value = [];
    userState.pagination.total = 0;
    return;
  }
  await userState.fetchTableData(input instanceof Event ? undefined : input);
};

watch(deptTreeReady, async (ready) => {
  if (ready) {
    await fetchUserTable();
    return;
  }
  userState.tableData.value = [];
  userState.pagination.total = 0;
});

/**
 * 部门树节点点击：切换 deptId 并刷新用户列表
 * @param data 树节点数据
 */
async function handleDeptNodeClick(data: UserDeptTreeNode) {
  currentNodeKey.value = data.id;
  searchForm.deptId = data.id === USER_DEPT_ALL_NODE_ID ? undefined : data.id;
  userState.pagination.currentPage = 1;
  await fetchUserTable();
}

/**
 * 重置用户搜索条件（保留当前部门筛选）
 * @param formRef 搜索表单实例
 */
async function resetUserSearch(formRef: FormInstance) {
  formRef.resetFields();
  userState.pagination.currentPage = 1;
  await fetchUserTable();
}

/**
 * 分页变化后走部门树门禁拉取
 * @param value 新的分页大小
 */
async function handlePageSizeChange(value: number) {
  userState.pagination.pageSize = value;
  userState.pagination.currentPage = 1;
  await fetchUserTable();
}

/**
 * 页码变化后走部门树门禁拉取
 * @param value 新的当前页
 */
async function handlePageCurrentChange(value: number) {
  userState.pagination.currentPage = value;
  await fetchUserTable();
}

const tableState: PaginationTableState<SysUserPageRow> = {
  loading: userState.loading,
  tableData: userState.tableData,
  selectedRows: userState.selectedRows,
  pagination: userState.pagination,
  searchForm: userState.searchForm,
  fetchTableData: fetchUserTable,
  resetQuery: resetUserSearch,
  handlePageSizeChange,
  handlePageCurrentChange,
  handleSelectionChange: userState.handleSelectionChange,
};

/**
 * 用户管理页状态（模块级单例）
 */
function useUserPageState() {
  return {
    treeKeyword,
    treeData,
    deptTreeReady,
    deptTreeLoading,
    currentNodeKey,
    tableState,
    loadDeptTree,
    fetchUserTable,
    handleDeptNodeClick,
    resetUserSearch,
  };
}

export default useUserPageState;
