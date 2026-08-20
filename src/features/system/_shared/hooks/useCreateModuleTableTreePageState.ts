import type { PageResponse } from '@/api/common/page';
import { usePaginationState, type ListTableState } from '@/components/table/ListTable';
import { errorMessage } from '@/services/feedback/message';
import { handleTree } from '@/shared/utils/tree';
import type { FormInstance } from 'element-plus';
import { ref, type Ref } from 'vue';

/**
 * 模块级「表格分页 + 全量列表建树」页状态工厂配置（菜单、部门等分段切换场景）。
 */
export interface CreateModuleTableTreePageStateConfig<TRow, TFlat, TViewMode extends string = 'table' | 'tree'> {
  /** 已与页面绑定的 reactive 查询表单（单例引用） */
  searchForm: Record<string, any>;
  /** 表格默认每页条数 */
  defaultPageSize?: number;
  /** 表格分页接口 */
  fetchPage: (query: Record<string, unknown>) => Promise<PageResponse<TRow>>;
  /** 树表 / 树形共用扁平列表接口（传入 searchForm，由调用方映射为 API 参数） */
  fetchFlatList: (query: Record<string, unknown>) => Promise<TFlat[]>;
  /** handleTree 的 id 字段名，默认 id */
  treeIdKey?: string;
  /** handleTree 的 parentId 字段名，默认 parentId */
  treeParentKey?: string;
  /** 初始视图模式 */
  initialViewMode?: TViewMode;
}

/**
 * 创建模块级单例的表格 + 树页状态（顶层 ref，供 index / 多子组件共用同一套数据）
 * @param config 页状态配置
 * @returns 与 useMenuPageState / useDeptPageState 相同的一组 ref 与方法
 */
export function useCreateModuleTableTreePageState<
  TRow extends { id?: string | number },
  TFlat,
  TNode,
  TViewMode extends string = 'table' | 'tree',
>(config: CreateModuleTableTreePageStateConfig<TRow, TFlat, TViewMode>) {
  const treeData = ref<TNode[]>([]);
  const viewMode = ref(config.initialViewMode ?? ('table' as TViewMode)) as Ref<TViewMode>;

  const {
    loading,
    selectedRows,
    tableData,
    searchForm,
    pagination,
    fetchTableData,
    resetQuery,
    handlePageSizeChange,
    handlePageCurrentChange,
    handleSelectionChange,
  } = usePaginationState<TRow>({
    fetchApi: config.fetchPage,
    searchForm: config.searchForm,
    defaultPageSize: config.defaultPageSize,
  });

  const treeIdKey = config.treeIdKey ?? 'id';
  const treeParentKey = config.treeParentKey ?? 'parentId';

  type TreeListTarget = 'tree' | 'table';

  /**
   * 按 searchForm 拉扁平列表并建树，写入 treeData 或 tableData。
   * @param target 树形 treeData / 树表 tableData
   */
  const loadTreeListInto = async (target: TreeListTarget) => {
    const dataRef = target === 'tree' ? treeData : tableData;
    loading.value = true;
    try {
      const list = await config.fetchFlatList(config.searchForm);
      dataRef.value = handleTree([...(list ?? [])], treeIdKey, treeParentKey) as typeof dataRef.value;
    } catch (error: unknown) {
      errorMessage(error);
      dataRef.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * 树表视图重置筛选后重新拉取。
   * @param formRef 搜索表单实例
   */
  const resetTreeTableQuery = async (formRef?: FormInstance) => {
    formRef?.resetFields();
    await loadTreeListInto('table');
  };

  const treeTableListState = {
    loading,
    tableData,
    selectedRows,
    searchForm,
    fetchTableData: () => loadTreeListInto('table'),
    handleSelectionChange,
    resetQuery: resetTreeTableQuery,
  } as ListTableState<TRow>;

  /**
   * 按当前视图模式拉取数据（查询 / 刷新共用）。
   */
  const refresh = async () => {
    switch (viewMode.value) {
      case 'table':
        await fetchTableData();
        break;
      case 'treeTable':
        await loadTreeListInto('table');
        break;
      default:
        await loadTreeListInto('tree');
        break;
    }
  };

  /**
   * 重置筛选并按当前视图重新拉取。
   * @param formRef 搜索表单实例
   */
  const resetCurrentViewQuery = async (formRef?: FormInstance) => {
    formRef?.resetFields();
    await refresh();
  };

  function usePageState() {
    return {
      loading,
      selectedRows,
      tableData,
      treeData,
      searchForm,
      viewMode,
      pagination,
      treeTableListState,
      loadTreeListInto,
      fetchTableData,
      resetQuery,
      resetTreeTableQuery,
      resetCurrentViewQuery,
      handlePageSizeChange,
      handlePageCurrentChange,
      handleSelectionChange,
      refresh,
    };
  }

  return usePageState;
}
