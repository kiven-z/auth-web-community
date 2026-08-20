import type { Ref } from 'vue';
import { ref } from 'vue';

import type { TableTreeControlRef } from '../types';

/**
 * 树形表格一键展开 / 折叠
 * @param tableRef 表格实例（需含 data / toggleRowExpansion）
 * @param initialExpandAll 初始是否展开
 * @returns 展开态与切换方法
 */
export function useTreeExpandAll(tableRef: Ref<TableTreeControlRef | undefined>, initialExpandAll: boolean) {
  const isExpandAll = ref(initialExpandAll);

  function toggleRowExpansionAll(data: unknown[] | undefined, isExpansion: boolean) {
    const table = tableRef.value;
    if (!data || !table?.toggleRowExpansion) {
      return;
    }
    data.forEach((item) => {
      table.toggleRowExpansion(item, isExpansion);
      const row = item as { children?: unknown[] };
      if (row.children !== undefined && row.children !== null) {
        toggleRowExpansionAll(row.children, isExpansion);
      }
    });
  }

  function onExpand() {
    isExpandAll.value = !isExpandAll.value;
    toggleRowExpansionAll(tableRef.value?.data, isExpandAll.value);
  }

  return { isExpandAll, onExpand };
}
