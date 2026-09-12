import type { RouteConfigs } from '@/router/types';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { type CSSProperties, nextTick, ref, type Ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

import { type TagContextMenuItem, TagMenuAction } from '../constants/tag-menu';
import type { CloseScope } from '../utils/close-tags';
import { resolveTagMenuItems } from '../utils/tag-menu-policy';
import { positionContextMenu } from '../utils/menu-view';

interface TagMenuDeps {
  route: RouteLocationNormalizedLoaded;
  multiTags: Ref<RouteConfigs[]>;
  containerDom: Ref<HTMLElement | undefined>;
  topPath?: string;
  onFresh: () => void;
  deleteMenu: (item: RouteConfigs, scope?: CloseScope) => void;
  closeAllTags: () => void;
}

/**
 * 标签右键菜单：打开时派生可见项，按 action 分发
 * @param deps 路由、标签列表与关闭动作
 * @returns 菜单状态与交互方法
 */
export function useTagMenu(deps: TagMenuDeps) {
  const { route, multiTags, containerDom, topPath, onFresh, deleteMenu, closeAllTags } = deps;

  const layoutUiStore = useLayoutShellRuntimeStore();
  const visible = ref(false);
  const menuStyle = ref<CSSProperties>({});
  const menuItems = ref<TagContextMenuItem[]>([]);
  const currentSelect = ref<RouteConfigs>();

  function closeMenu(): void {
    visible.value = false;
  }

  const menuHandlers: Record<TagMenuAction, (selectRoute?: RouteConfigs) => void> = {
    [TagMenuAction.Reload]: () => onFresh(),
    [TagMenuAction.Close]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'current'),
    [TagMenuAction.CloseLeft]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'left'),
    [TagMenuAction.CloseRight]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'right'),
    [TagMenuAction.CloseOther]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'other'),
    [TagMenuAction.CloseAll]: () => closeAllTags(),
    [TagMenuAction.Fullscreen]: () => {
      layoutUiStore.hiddenSideBar = !layoutUiStore.hiddenSideBar;
    },
  };

  function selectTag(action: TagMenuAction): void {
    closeMenu();
    menuHandlers[action](currentSelect.value);
  }

  function openMenu(tag: RouteConfigs, event: MouseEvent): void {
    closeMenu();
    currentSelect.value = tag;
    menuItems.value = resolveTagMenuItems({
      tag,
      route,
      tags: multiTags.value,
      topPath,
      contentFullscreen: layoutUiStore.hiddenSideBar,
    });
    const { left, top } = positionContextMenu(event, containerDom.value);
    menuStyle.value = { left: `${left}px`, top: `${top}px` };
    nextTick(() => {
      visible.value = true;
    });
  }

  return {
    visible,
    menuStyle,
    menuItems,
    closeMenu,
    openMenu,
    selectTag,
  };
}
