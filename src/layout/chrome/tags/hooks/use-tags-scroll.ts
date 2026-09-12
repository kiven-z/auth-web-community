import { nextTick, type Ref } from 'vue';

const TAG_SCROLL_PADDING = 10;
const TAG_ARROW_SCROLL_OFFSET = 200;

interface TagsScrollDeps {
  scrollbarRef: Ref<HTMLElement | undefined>;
  tabListRef: Ref<HTMLElement | undefined>;
  isShowArrow: Ref<boolean>;
}

/**
 * 标签栏横向滚动（scrollLeft，避免父级 transform 干扰 Sortable 动画）
 * @param deps 滚动容器与箭头状态
 * @returns 滚动与箭头相关方法
 */
export function useTagsScroll(deps: TagsScrollDeps) {
  const { scrollbarRef, tabListRef, isShowArrow } = deps;

  function syncArrowVisible(): void {
    const scrollbar = scrollbarRef.value;
    const tabList = tabListRef.value;
    if (!scrollbar || !tabList) {
      isShowArrow.value = false;
      return;
    }
    isShowArrow.value = tabList.scrollWidth > scrollbar.clientWidth + 1;
  }

  async function scrollTagIntoView(index: number): Promise<void> {
    await nextTick();
    syncArrowVisible();
    if (index < 0) {
      return;
    }
    const scrollbar = scrollbarRef.value;
    const tagElement = tabListRef.value?.querySelector<HTMLElement>(`[data-tag-index="${index}"]`);
    if (!scrollbar || !tagElement) {
      return;
    }

    const tagLeft = tagElement.offsetLeft;
    const tagRight = tagLeft + tagElement.offsetWidth;
    const viewLeft = scrollbar.scrollLeft;
    const viewRight = viewLeft + scrollbar.clientWidth;

    if (tagLeft < viewLeft + TAG_SCROLL_PADDING) {
      scrollbar.scrollTo({ left: Math.max(0, tagLeft - TAG_SCROLL_PADDING), behavior: 'smooth' });
      return;
    }
    if (tagRight > viewRight - TAG_SCROLL_PADDING) {
      scrollbar.scrollTo({
        left: tagRight - scrollbar.clientWidth + TAG_SCROLL_PADDING,
        behavior: 'smooth',
      });
    }
  }

  function scrollByArrow(direction: -1 | 1): void {
    scrollbarRef.value?.scrollBy({
      left: direction * TAG_ARROW_SCROLL_OFFSET,
      behavior: 'smooth',
    });
  }

  function handleWheel(event: WheelEvent): void {
    const scrollbar = scrollbarRef.value;
    if (!scrollbar) {
      return;
    }
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    scrollbar.scrollLeft += delta;
  }

  return {
    syncArrowVisible,
    scrollTagIntoView,
    scrollByArrow,
    handleWheel,
  };
}
