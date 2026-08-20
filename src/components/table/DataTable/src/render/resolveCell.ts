import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import type { Slots } from 'vue';

/** Element Plus 单元格 scope */
export interface TableCellScope {
  row: any;
  column: any;
  $index: number;
}

/**
 * 列是否可见
 */
export function columnVisible(column: TableColumns): boolean {
  if (isBoolean(column.hide) && column.hide) {
    return false;
  }
  return !(isFunction(column.hide) && column.hide());
}

/**
 * 解析单元格内容：render → slot → prop 文本
 */
export function resolveCell(column: TableColumns, scope: TableCellScope, slots: Slots) {
  const value = column.prop == null ? undefined : scope.row?.[column.prop];
  const ctx: TableColumnRenderContext = {
    row: scope.row,
    value,
    index: scope.$index,
    column,
  };

  if (column.render) {
    return column.render(ctx);
  }
  if (column.slot && slots[column.slot]) {
    return slots[column.slot](scope);
  }
  if (column.prop != null) {
    return value;
  }
  return null;
}
