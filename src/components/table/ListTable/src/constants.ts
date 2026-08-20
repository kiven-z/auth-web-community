/** 列表页统一的表头单元格样式 */
export const LIST_TABLE_HEADER_CELL_STYLE: Record<string, string> = {
  background: 'var(--auth-bg-secondary)',
  color: 'var(--auth-text-primary)',
};

/** 表格密度 */
export type ListTableDensity = 'large' | 'default' | 'small';

/** 密度下拉选项（label 走 i18n） */
export const LIST_TABLE_DENSITY_OPTIONS: ReadonlyArray<{
  value: ListTableDensity;
  labelKey: string;
}> = [
  { value: 'large', labelKey: 'listTable.densityLarge' },
  { value: 'default', labelKey: 'listTable.densityDefault' },
  { value: 'small', labelKey: 'listTable.densitySmall' },
];

/** 工具条图标公共 class（图标间距交给 `el-divider` 默认 margin，勿再叠双边 ml/mr） */
export const LIST_TABLE_ICON_CLASS = ['outline-hidden', 'cursor-pointer', 'hover:text-primary!'] as const;

/** tippy 偏移 [skidding, distance] */
export const LIST_TABLE_TIPPY_OFFSET: [number, number] = [0, 18];

/** tippy 动画时长 [show, hide]（ms） */
export const LIST_TABLE_TIPPY_DURATION: [number, number] = [300, 0];

/**
 * 不进列设置面板的列 type（selection / index / expand）。
 * 这些列始终参与渲染，不参与显隐勾选与拖拽排序。
 */
export const LIST_TABLE_UNMANAGED_COLUMN_TYPES = ['selection', 'index', 'expand'] as const;
