import type { DataTableAdaptiveConfig, DataTableAdaptiveMode } from '@/components/table/DataTable';
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

/** 列表壳组件 props */
export interface ListTableProps<TData = unknown> {
  /** 列表状态（分页或全量） */
  state: ListTableState<TData>;
  /** 列配置 */
  columns: TableColumnList;
  /** 无 title 插槽时显示的工具栏标题 */
  title?: string;
  /** 行主键，默认 id */
  rowKey?: string | ((row: TData) => string);
  /** 高度模式，默认 viewport；分栏定高页用 fill */
  adaptive?: DataTableAdaptiveMode;
  adaptiveConfig?: DataTableAdaptiveConfig;
  border?: boolean;
  highlightCurrentRow?: boolean;
  alignWhole?: 'left' | 'center' | 'right';
  /** 列宽布局，默认 fixed */
  tableLayout?: 'fixed' | 'auto';
  /** 溢出 tooltip，默认 true */
  showOverflowTooltip?: boolean;
  /** 树形表格：传给 el-table 的 tree-props；传入后工具条显示展开/折叠 */
  treeProps?: Record<string, string>;
  /** 树形表格默认展开全部 */
  defaultExpandAll?: boolean;
}
