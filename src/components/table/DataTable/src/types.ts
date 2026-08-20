/** 分页对象（只读展示；页码变更由事件交给父级） */
export interface DataTablePagination {
  total: number;
  pageSize: number;
  currentPage: number;
  background?: boolean;
  layout?: string;
  pageSizes?: number[];
  align?: 'left' | 'center' | 'right';
  style?: Record<string, string>;
}

/**
 * 表格高度模式：
 * - `false`：不定高（弹窗等）
 * - `viewport`：根节点按视口剩余高度定高，表体再吃满根内剩余（含分页）
 * - `fill`：填满已定高的父级
 */
export type DataTableAdaptiveMode = false | 'viewport' | 'fill';

/** 自适应高度配置 */
export interface DataTableAdaptiveConfig {
  /** 距视口底部偏移（仅 viewport） */
  offsetBottom?: number;
  /** resize 防抖毫秒 */
  debounceMs?: number;
  /** 表体最小高度（仅 viewport 写根高时） */
  minHeight?: number;
}
