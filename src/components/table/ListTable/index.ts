import { withInstall } from '@/shared/vue/withInstall';

import listTable from './src/ListTable.vue';

export type {
  ListTableExpose,
  ListTableProps,
  ListTableState,
  PaginationTableState,
  TableTreeControlRef,
} from './src/types';
export { useListTableState } from './src/hooks/useListTableState';
export type { UseListTableStateOptions } from './src/hooks/useListTableState';
export { usePaginationState } from './src/hooks/usePaginationState';
export type {
  FetchTableDataFn,
  FetchTableDataOptions,
  UsePaginationStateOptions,
} from './src/hooks/usePaginationState';

/** 列表产品壳：工具条 + DataTable；分页用 usePaginationState，全量/树表用 useListTableState */
export const ListTable = withInstall(listTable);

export default ListTable;
