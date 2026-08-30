import type { Ref } from 'vue';

/** 表格操作依赖 */
export interface TableActionDeps {
  fetchTableData: () => Promise<void>;
}

/**
 * 表格操作依赖（含 usePaginationState 提供的多选 ID 列表）
 */
export interface TableActionWithSelectionDeps extends TableActionDeps {
  selectedRows: Ref<string[]>;
}
