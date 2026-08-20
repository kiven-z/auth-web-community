import { errorMessage } from '@/services/feedback/message';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';

/** {@link useListTableState} 配置 */
export interface UseListTableStateOptions<TData = unknown, TQuery extends Record<string, any> = Record<string, any>> {
  /**
   * 全量列表查询 API（返回即写入 tableData，可由调用方在内部建树）
   */
  fetchApi: (params: TQuery) => Promise<TData[]>;
  /** 搜索表单（使用 reactive 包裹后传入） */
  searchForm: TQuery;
}

/**
 * 无分页列表状态 Hook（供 ListTable 消费）。
 *
 * @example
 * ```ts
 * const state = useListTableState({
 *   fetchApi: async (q) => handleTree(await getList(q), 'id', 'parentId'),
 *   searchForm: reactive({ name: undefined }),
 * });
 * ```
 * @param options 列表状态配置
 * @returns 列表表格状态与方法
 */
export function useListTableState<TData = unknown, TQuery extends Record<string, any> = Record<string, any>>(
  options: UseListTableStateOptions<TData, TQuery>
) {
  const { fetchApi, searchForm } = options;

  const loading = ref(false);
  const tableData = ref<TData[]>([]);
  const selectedRows = ref<string[]>([]);

  /**
   * 拉取全量列表并写入 tableData。
   */
  const fetchTableData = async () => {
    loading.value = true;
    try {
      tableData.value = (await fetchApi(searchForm)) ?? [];
    } catch (error: unknown) {
      errorMessage(error);
      tableData.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * 多选变化（行 ID 统一为 string，适配雪花 Long）。
   * @param rows 选中行
   */
  const handleSelectionChange = (rows: TData[]) => {
    selectedRows.value = rows.map((row: { id?: string | number }) => String(row.id));
  };

  /**
   * 重置筛选后重新拉取。
   * @param formRef 搜索表单实例
   */
  const resetQuery = async (formRef?: FormInstance) => {
    formRef?.resetFields();
    await fetchTableData();
  };

  return {
    loading,
    tableData,
    selectedRows,
    searchForm,
    fetchTableData,
    resetQuery,
    handleSelectionChange,
  };
}
