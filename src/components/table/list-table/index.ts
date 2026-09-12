import { withInstall } from '@/shared/vue/with-install';

import listTable from './ListTable.vue';

export type { ListTableState, PaginationTableState } from './types';
export { useListTableState } from './hooks/use-list-table-state';
export { usePaginationState } from './hooks/use-pagination-state';
export type { FetchTableDataFn, FetchTableDataOptions } from './hooks/use-pagination-state';

/** 列表产品壳：工具条 + DataTable；分页用 usePaginationState，全量/树表用 useListTableState */
const ListTable = withInstall(listTable);

export default ListTable;
