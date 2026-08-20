import type { App } from 'vue';

import DataTable from './src/DataTable.vue';

export type { DataTableAdaptiveConfig, DataTableAdaptiveMode, DataTablePagination } from './src/types';
export {
  DEFAULT_ADAPTIVE_DEBOUNCE_MS,
  DEFAULT_ADAPTIVE_MIN_HEIGHT_PX,
  DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
  DEFAULT_ADAPTIVE_PAGINATION_RESERVE_PX,
  DEFAULT_PAGE_SIZES,
  DEFAULT_PAGINATION_LAYOUT,
  MIN_ADAPTIVE_TABLE_HEIGHT_PX,
} from './src/constants';
export { useAdaptiveFillHeight } from './src/hooks/useAdaptiveFillHeight';
export type { AdaptiveFillHeightOptions } from './src/hooks/useAdaptiveFillHeight';
export { useFillParentHeight } from './src/hooks/useFillParentHeight';
export type { FillParentHeightOptions } from './src/hooks/useFillParentHeight';
export { useTableHeight } from './src/hooks/useTableHeight';
export type { UseTableHeightOptions } from './src/hooks/useTableHeight';

/**
 * 全局注册 `DataTable`、`data-table`。
 */
export function installDataTable(app: App) {
  app.component('DataTable', DataTable);
  app.component('data-table', DataTable);
}

export { default } from './src/DataTable.vue';
