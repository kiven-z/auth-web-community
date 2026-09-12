import type { App } from 'vue';

import DataTable from './DataTable.vue';

export type { DataTableAdaptiveConfig, DataTableAdaptiveMode } from './types';
export {
  DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
  DEFAULT_ADAPTIVE_PAGINATION_RESERVE_PX,
  DEFAULT_PAGE_SIZES,
  DEFAULT_PAGINATION_LAYOUT,
} from './constants';
export { useAdaptiveFillHeight } from './hooks/use-adaptive-fill-height';

/**
 * 全局注册 `DataTable`、`data-table`。
 */
export function installDataTable(app: App) {
  app.component('DataTable', DataTable);
  app.component('data-table', DataTable);
}

export { default } from './DataTable.vue';
