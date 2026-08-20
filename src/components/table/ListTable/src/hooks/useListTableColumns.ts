import cloneDeep from 'lodash/cloneDeep';
import type { Ref } from 'vue';
import { ref, watch } from 'vue';

import { useColumnSortable } from './useColumnSortable';
import { useColumnVisibility } from './useColumnVisibility';

/**
 * 列显隐、拖拽排序状态与 Sortable 绑定
 * @param columnsRef 表格列配置 ref
 * @returns 动态列、列设置面板状态与 Sortable 生命周期方法
 */
export function useListTableColumns(columnsRef: Ref<TableColumnList>) {
  const dynamicColumns = ref<TableColumnList>(cloneDeep(columnsRef.value));

  const {
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
  } = useColumnVisibility({ columnsRef, dynamicColumns });

  const { initSortable, destroySortable } = useColumnSortable({
    dynamicColumns,
    onReorder: syncCheckColumnListFromDynamic,
  });

  /**
   * 父级列配置变化时（如切换语言、热更新列定义）重算可见列与勾选态，并释放 Sortable 以免绑在过期 DOM 上。
   */
  watch(
    columnsRef,
    () => {
      resetColumns();
      destroySortable();
    },
    { deep: true }
  );

  return {
    checkAll,
    isIndeterminate,
    checkColumnList,
    checkedColumns,
    dynamicColumns,
    handleCheckAllChange,
    handleCheckedColumnsChange,
    handleCheckColumnListChange,
    resetColumns,
    initSortable,
    destroySortable,
    isFixedColumn,
  };
}
