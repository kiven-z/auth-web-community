import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import Sortable from 'sortablejs';
import { storeToRefs } from 'pinia';
import { nextTick, onBeforeUnmount, type Ref, watch } from 'vue';
import { isFixedTagItem } from '../utils/fixed-tag';

/**
 * 标签栏横向拖拽排序（SortableJS）；固定标签不可拖、不可作为落点
 * @param tabListRef 标签列表根节点
 * @param enabled 是否启用（标签栏可见时）
 */
export function useTagsSortable(tabListRef: Ref<HTMLElement | undefined>, enabled: Ref<boolean>): void {
  let sortableInstance: ReturnType<typeof Sortable.create> | null = null;
  const { multiTags } = storeToRefs(useTagsPreferencesStore());

  function destroySortable(): void {
    sortableInstance?.destroy();
    sortableInstance = null;
  }

  function initSortable(): void {
    destroySortable();
    const wrapper = tabListRef.value;
    if (!wrapper || !enabled.value) {
      return;
    }

    sortableInstance = Sortable.create(wrapper, {
      animation: 150,
      ghostClass: 'tags-sortable-ghost',
      filter: '.fixed-tag',
      draggable: '.scroll-item:not(.fixed-tag)',
      onMove(event) {
        return !event.related.classList.contains('fixed-tag');
      },
      onEnd(event) {
        void nextTick(() => {
          const { oldIndex, newIndex } = event;
          if (oldIndex == null || newIndex == null || oldIndex === newIndex) {
            return;
          }

          const multiTagsStore = useTagsPreferencesStore();
          const nextTags = [...multiTagsStore.multiTags];
          const moved = nextTags[oldIndex];
          const target = nextTags[newIndex];

          if (!moved || isFixedTagItem(moved) || isFixedTagItem(target)) {
            multiTagsStore.setTags([...multiTagsStore.multiTags]);
            return;
          }

          const [row] = nextTags.splice(oldIndex, 1);
          nextTags.splice(newIndex, 0, row);
          multiTagsStore.setTags(nextTags);
        });
      },
    });
  }

  watch(
    [tabListRef, enabled, () => multiTags.value.length],
    () => {
      void nextTick(() => initSortable());
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    destroySortable();
  });
}
