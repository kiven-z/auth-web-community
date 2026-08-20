/**
 * 默认分页条布局（Element Plus layout 字符串）
 */
export const DEFAULT_PAGINATION_LAYOUT = 'total, sizes, prev, pager, next, jumper';

/**
 * 默认每页条数选项
 */
export const DEFAULT_PAGE_SIZES = [10, 20, 30, 50, 100, 150, 200, 300, 400, 500];

/**
 * 自适应表格区最小高度（px）
 */
export const MIN_ADAPTIVE_TABLE_HEIGHT_PX = 480;

/** 自适应高度：距视口底部默认偏移（px） */
export const DEFAULT_ADAPTIVE_OFFSET_BOTTOM = 54;

/** 自适应高度：resize 默认防抖（ms） */
export const DEFAULT_ADAPTIVE_DEBOUNCE_MS = 60;

/** 自适应高度：通用最小高度（px） */
export const DEFAULT_ADAPTIVE_MIN_HEIGHT_PX = 300;

/**
 * 视口定高时下方预留（px）。
 * DataTable 自身用量兄弟节点，不再依赖本常量；独立列表（如收件箱）仍可传入 useAdaptiveFillHeight。
 */
export const DEFAULT_ADAPTIVE_PAGINATION_RESERVE_PX = 64;
