import { transformI18n } from '@/app/plugins/i18n';
import { getKeyList } from '@/shared/utils/array/get-key-list';
import cloneDeep from 'lodash/cloneDeep';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';

import { LIST_TABLE_UNMANAGED_COLUMN_TYPES } from '../constants';

/** 可进列设置面板的业务列（排除 selection / index / expand） */
export function isSettingManagedColumn(column: TableColumns): boolean {
  const type = column.type as string | undefined;
  return !type || !(LIST_TABLE_UNMANAGED_COLUMN_TYPES as readonly string[]).includes(type);
}

/** 列配置中当前应参与渲染的列（解析 hide 布尔或函数） */
export function filterVisibleColumns(columns: TableColumnList): TableColumns[] {
  return cloneDeep(columns).filter((column) =>
    isBoolean(column?.hide) ? !column.hide : !(isFunction(column?.hide) && column.hide())
  );
}

/** 列设置面板勾选列表用的 label 键 */
export function collectManagedColumnLabels(columns: TableColumnList): string[] {
  return getKeyList(cloneDeep(columns.filter(isSettingManagedColumn)), 'label');
}

/** 当前可见业务列的 label 键（列设置面板勾选态） */
export function collectVisibleManagedColumnLabels(columns: TableColumnList): string[] {
  return collectManagedColumnLabels(filterVisibleColumns(columns));
}

/**
 * 在业务列中按 label 查找列（i18n 文案等价）
 * @param columns 列配置
 * @param label 面板展示 label
 */
export function findManagedColumnByLabel(columns: TableColumnList, label: string): TableColumns | undefined {
  return columns.filter(isSettingManagedColumn).find((item) => transformI18n(item.label) === transformI18n(label));
}

/** dynamicColumns 中可拖拽业务列的下标 */
export function getManagedColumnIndices(columns: TableColumnList): number[] {
  return columns.map((column, index) => (isSettingManagedColumn(column) ? index : -1)).filter((index) => index >= 0);
}

/**
 * 在业务列切片上执行拖拽重排，写回 dynamicColumns 对应槽位
 * @param columns 当前 dynamicColumns（原地修改）
 * @param oldIndex Sortable 业务列索引
 * @param newIndex Sortable 业务列索引
 * @returns 是否已更新列顺序
 */
export function reorderManagedColumns(columns: TableColumnList, oldIndex: number, newIndex: number): boolean {
  const managedIndices = getManagedColumnIndices(columns);
  const oldDynIndex = managedIndices[oldIndex];
  const newDynIndex = managedIndices[newIndex];
  if (oldDynIndex == null || newDynIndex == null) {
    return false;
  }

  const oldColumn = columns[oldDynIndex];
  const newColumn = columns[newDynIndex];
  if (oldColumn?.fixed || newColumn?.fixed) {
    return false;
  }

  const managed = managedIndices.map((index) => columns[index]);
  const [moved] = managed.splice(oldIndex, 1);
  managed.splice(newIndex, 0, moved);
  managedIndices.forEach((dynIndex, i) => {
    columns[dynIndex] = managed[i];
  });
  return true;
}
