import { onKeyStroke } from '@vueuse/core';
import type { Ref, ShallowRef } from 'vue';

import type { MenuSearchOption } from '../types';
import { cycleListIndex, type MenuTreeNode } from '../utils/menuSearchQuery';

export interface ScrollablePanelRef {
  handleScroll: (index: number) => number;
}

export interface MenuSearchScrollbarRef {
  setScrollTop: (top: number) => void;
}

export interface MenuSearchConfirmContext {
  options: Array<{ path: string; meta?: MenuSearchOption['meta'] }>;
  index: number;
  isResultOptions: boolean;
}

interface UseMenuSearchNavigationOptions {
  resultOptions: ShallowRef<MenuTreeNode[]>;
  historyOptions: ShallowRef<MenuSearchOption[]>;
  activePath: Ref<string>;
  historyPath: Ref<string>;
  resultRef: Ref<ScrollablePanelRef | undefined>;
  historyRef: Ref<ScrollablePanelRef | undefined>;
  scrollbarRef: Ref<MenuSearchScrollbarRef | undefined>;
  /** 搜索弹窗打开时才响应键盘导航 */
  visible: Ref<boolean>;
  onConfirm: (ctx: MenuSearchConfirmContext) => void;
}

/**
 * 菜单搜索键盘导航：↑↓ 循环选中、Enter 确认
 * @param options 列表状态与确认回调
 * @returns 确认与移动方法（供列表点击复用）
 */
export function useMenuSearchNavigation(options: UseMenuSearchNavigationOptions) {
  function isNavigationActive() {
    return options.visible.value;
  }

  function getCurrentOptionsAndPath() {
    const isResultOptions = options.resultOptions.value.length > 0;
    const listOptions = isResultOptions ? options.resultOptions.value : options.historyOptions.value;
    const currentPath = isResultOptions ? options.activePath.value : options.historyPath.value;
    return { options: listOptions, currentPath, isResultOptions };
  }

  function scrollTo(index: number) {
    const panel = options.resultOptions.value.length ? options.resultRef.value : options.historyRef.value;
    if (!panel || !options.scrollbarRef.value) {
      return;
    }

    const scrollTop = panel.handleScroll(index);
    options.scrollbarRef.value.setScrollTop(scrollTop);
  }

  function updatePathAndScroll(newIndex: number, isResultOptions: boolean) {
    const listOptions = isResultOptions ? options.resultOptions.value : options.historyOptions.value;
    const path = listOptions[newIndex]?.path;
    if (!path) {
      return;
    }

    if (isResultOptions) {
      options.activePath.value = path;
    } else {
      options.historyPath.value = path;
    }
    scrollTo(newIndex);
  }

  function moveSelection(direction: 'prev' | 'next') {
    if (!isNavigationActive()) {
      return;
    }

    const { options: listOptions, currentPath, isResultOptions } = getCurrentOptionsAndPath();
    if (listOptions.length === 0) {
      return;
    }

    const index = listOptions.findIndex((item) => item.path === currentPath);
    const nextIndex = cycleListIndex(index, listOptions.length, direction);
    updatePathAndScroll(nextIndex, isResultOptions);
  }

  function handleEnter() {
    if (!isNavigationActive()) {
      return;
    }

    const { options: listOptions, currentPath, isResultOptions } = getCurrentOptionsAndPath();
    if (listOptions.length === 0 || currentPath === '') {
      return;
    }

    const index = listOptions.findIndex((item) => item.path === currentPath);
    if (index === -1) {
      return;
    }

    options.onConfirm({ options: listOptions, index, isResultOptions });
  }

  onKeyStroke('Enter', handleEnter);
  onKeyStroke('ArrowUp', () => moveSelection('prev'));
  onKeyStroke('ArrowDown', () => moveSelection('next'));

  return { handleEnter, moveSelection };
}
