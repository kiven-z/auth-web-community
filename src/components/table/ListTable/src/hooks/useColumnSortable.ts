import Sortable from 'sortablejs';
import type { Ref } from 'vue';
import { nextTick as vueNextTick, onBeforeUnmount } from 'vue';

import { getManagedColumnIndices, reorderManagedColumns } from '../utils/columnSetting';

interface UseColumnSortableOptions {
  dynamicColumns: Ref<TableColumnList>;
  onReorder: () => void;
}

/**
 * 列设置面板 Sortable：拖拽排序与固定列 DOM 还原
 * @param options dynamicColumns 与重排后的勾选列表同步回调
 * @returns Sortable 绑定与销毁方法
 */
export function useColumnSortable({ dynamicColumns, onReorder }: UseColumnSortableOptions) {
  let sortableInstance: ReturnType<typeof Sortable.create> | null = null;

  function destroySortable() {
    sortableInstance?.destroy();
    sortableInstance = null;
  }

  function restoreFixedColumnDom(evt: Sortable.SortableEvent) {
    const { newIndex, oldIndex, item } = evt;
    if (newIndex == null || oldIndex == null || !item?.parentNode) {
      return;
    }

    const managedIndices = getManagedColumnIndices(dynamicColumns.value);
    const oldDynIndex = managedIndices[oldIndex];
    const newDynIndex = managedIndices[newIndex];
    if (oldDynIndex == null || newDynIndex == null) {
      return;
    }

    const oldColumn = dynamicColumns.value[oldDynIndex];
    const newColumn = dynamicColumns.value[newDynIndex];
    if (!oldColumn?.fixed && !newColumn?.fixed) {
      return;
    }

    const wrapperElem = item.parentNode as HTMLElement;
    const oldThElem = wrapperElem.children[oldIndex] as HTMLElement;
    if (newIndex > oldIndex) {
      oldThElem.before(item);
    } else {
      oldThElem.after(item);
    }
  }

  function applySortableReorder(evt: Sortable.SortableEvent) {
    const { newIndex, oldIndex } = evt;
    if (newIndex == null || oldIndex == null) {
      return;
    }

    if (!reorderManagedColumns(dynamicColumns.value, oldIndex, newIndex)) {
      restoreFixedColumnDom(evt);
      return;
    }

    onReorder();
  }

  function handleSortableEnd(evt: Sortable.SortableEvent) {
    // 延后修改 Vue 数据，避免 Sortable._onDrop 尚未完成时列表被 patch 替换导致内部解绑读到 null
    void vueNextTick(() => applySortableReorder(evt));
  }

  /**
   * 在列设置 Popover 打开后绑定 Sortable（勿在 mouseenter 中反复 destroy/create，否则拖拽中 teardown 会触发 Sortable 对 null 调 removeEventListener）。
   * @param columnGroupRoot 列勾选列表根节点（直接作为 Sortable 容器）
   */
  function initSortable(columnGroupRoot: HTMLElement | null | undefined) {
    void vueNextTick(() => {
      destroySortable();
      if (!columnGroupRoot) {
        return;
      }
      sortableInstance = Sortable.create(columnGroupRoot, {
        animation: 300,
        handle: '.drag-btn',
        onEnd: handleSortableEnd,
      });
    });
  }

  onBeforeUnmount(() => {
    destroySortable();
  });

  return {
    initSortable,
    destroySortable,
  };
}
