import type { Ref } from 'vue';

export type { PaginationTableState } from './hooks/usePaginationState';

/**
 * 树形表格展开/折叠所需的表格实例最小能力。
 */
export interface TableTreeControlRef {
  data?: unknown[];
  size?: unknown;
  toggleRowExpansion?: (row: unknown, expanded?: boolean) => void;
}

/**
 * ListTable 消费的最小 state：有分页字段则渲染分页，否则为全量列表 / 树表。
 * {@link PaginationTableState} 与 {@link useListTableState} 返回值均满足该契约。
 */
export interface ListTableState<TData = unknown> {
  loading: Ref<boolean>;
  tableData: Ref<TData[]>;
  selectedRows: Ref<string[]>;
  fetchTableData: (options?: { silent?: boolean }) => Promise<void>;
  handleSelectionChange: (rows: TData[]) => void;
  pagination?: { total: number; pageSize: number; currentPage: number };
  handlePageSizeChange?: (size: number) => void | Promise<void>;
  handlePageCurrentChange?: (page: number) => void | Promise<void>;
}

/** 列表壳组件对外暴露能力 */
export interface ListTableExpose {
  /** 触发表格高度重算（全屏切换后调用） */
  setAdaptive: () => Promise<void>;
  /** 重新拉取当前数据 */
  fetchTableData: (options?: { silent?: boolean }) => Promise<void>;
  /** 清空 el-table 多选 UI（业务层 selectedRows 清空时由壳层自动同步） */
  clearSelection: () => void;
}
