import cloneDeep from 'lodash/cloneDeep';
import type { Ref } from 'vue';
import { ref } from 'vue';

import {
  collectManagedColumnLabels,
  collectVisibleManagedColumnLabels,
  findManagedColumnByLabel,
  isSettingManagedColumn,
} from '../utils/columnSetting';

interface UseColumnVisibilityOptions {
  columnsRef: Ref<TableColumnList>;
  dynamicColumns: Ref<TableColumnList>;
}

/**
 * 列设置面板：全选/半选、勾选态与 dynamicColumns.hide 同步
 * @param options 父级列配置与动态列 ref
 * @returns 列显隐状态与面板事件处理
 */
export function useColumnVisibility({ columnsRef, dynamicColumns }: UseColumnVisibilityOptions) {
  const checkAll = ref(true);
  const isIndeterminate = ref(false);
  const checkColumnList = ref<string[]>(collectManagedColumnLabels(columnsRef.value));
  const checkedColumns = ref<string[]>(collectVisibleManagedColumnLabels(columnsRef.value));

  function syncCheckColumnListFromDynamic() {
    checkColumnList.value = collectManagedColumnLabels(dynamicColumns.value);
  }

  function handleCheckAllChange(val: boolean) {
    checkedColumns.value = val ? checkColumnList.value : [];
    isIndeterminate.value = false;
    dynamicColumns.value.forEach((column) => {
      if (isSettingManagedColumn(column)) {
        column.hide = !val;
      }
    });
  }

  function handleCheckedColumnsChange(value: string[]) {
    checkedColumns.value = [...value];
    const checkedCount = value.length;
    checkAll.value = checkedCount === checkColumnList.value.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < checkColumnList.value.length;
  }

  function handleCheckColumnListChange(val: boolean, label: string) {
    const match = findManagedColumnByLabel(dynamicColumns.value, label);
    if (match) {
      match.hide = !val;
    }
  }

  function resetColumns() {
    checkAll.value = true;
    isIndeterminate.value = false;
    dynamicColumns.value = cloneDeep(columnsRef.value);
    checkColumnList.value = collectManagedColumnLabels(columnsRef.value);
    checkedColumns.value = collectVisibleManagedColumnLabels(columnsRef.value);
  }

  function isFixedColumn(label: string): boolean {
    return !!findManagedColumnByLabel(dynamicColumns.value, label)?.fixed;
  }

  return {
    checkAll,
    isIndeterminate,
    checkColumnList,
    checkedColumns,
    syncCheckColumnListFromDynamic,
    handleCheckAllChange,
    handleCheckedColumnsChange,
    handleCheckColumnListChange,
    resetColumns,
    isFixedColumn,
  };
}
