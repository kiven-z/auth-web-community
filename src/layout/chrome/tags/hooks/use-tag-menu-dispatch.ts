import { $t } from '@/app/plugins/i18n';
import type { RouteConfigs } from '@/router/types';
import type { TagContextMenuItem } from '@/layout/chrome/tags/types';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { nextTick, type Ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';

import { TAG_MENU_ACTION_BY_INDEX, TAG_MENU_INDEX, TagMenuAction } from '../constants/tag-menu';
import type { CloseScope } from '../types';
import { computeMenuState, resolveContextMenuState } from '../utils/context-menu-policy';
import { applyMenuState, positionContextMenu } from '../utils/menu-view';

interface TagMenuDispatchDeps {
  route: RouteLocationNormalizedLoaded;
  multiTags: Ref<RouteConfigs[]>;
  tagsViews: TagContextMenuItem[];
  currentSelect: Ref<RouteConfigs | Record<string, never>>;
  visible: Ref<boolean>;
  buttonTop: Ref<number>;
  buttonLeft: Ref<number>;
  containerDom: Ref<HTMLElement | undefined>;
  topPath?: string;
  closeMenu: () => void;
  onContentFullScreen: () => void;
  onFresh: () => void;
  deleteMenu: (item: RouteConfigs, scope?: CloseScope) => void;
  closeAllTags: () => void;
}

/**
 * 标签右键 / 下拉菜单分发与打开
 * @param deps 菜单 UI 与关闭动作依赖
 * @returns 菜单交互方法
 */
export function useTagMenuDispatch(deps: TagMenuDispatchDeps) {
  const {
    route,
    multiTags,
    tagsViews,
    currentSelect,
    visible,
    buttonTop,
    buttonLeft,
    containerDom,
    topPath,
    closeMenu,
    onContentFullScreen,
    onFresh,
    deleteMenu,
    closeAllTags,
  } = deps;

  const layoutUiStore = useLayoutShellRuntimeStore();

  function refreshMenuState(): void {
    applyMenuState(
      tagsViews,
      computeMenuState({
        tags: multiTags.value,
        currentPath: route.fullPath,
        query: route.query,
        params: route.params,
        topPath,
      })
    );
  }

  function toggleFullscreenMenuLabel(): void {
    setTimeout(() => {
      const fullscreenIndex = TAG_MENU_INDEX[TagMenuAction.Fullscreen];
      if (layoutUiStore.hiddenSideBar) {
        tagsViews[fullscreenIndex].icon = ExitFullscreen;
        tagsViews[fullscreenIndex].text = $t('buttons.contentExitFullScreen');
      } else {
        tagsViews[fullscreenIndex].icon = Fullscreen;
        tagsViews[fullscreenIndex].text = $t('buttons.contentFullScreen');
      }
    }, 100);
  }

  const menuHandlers: Record<TagMenuAction, (selectRoute?: RouteConfigs) => void> = {
    [TagMenuAction.Reload]: () => onFresh(),
    [TagMenuAction.Close]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'current'),
    [TagMenuAction.CloseLeft]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'left'),
    [TagMenuAction.CloseRight]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'right'),
    [TagMenuAction.CloseOther]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'other'),
    [TagMenuAction.CloseAll]: () => closeAllTags(),
    [TagMenuAction.Fullscreen]: () => {
      onContentFullScreen();
      toggleFullscreenMenuLabel();
    },
  };

  function dispatchMenuCommand(key: number, item: TagContextMenuItem, selectedTag?: RouteConfigs): void {
    if (item?.disabled) {
      return;
    }

    const tagRoute: RouteConfigs = selectedTag
      ? {
          path: selectedTag.path,
          meta: selectedTag.meta,
          name: selectedTag.name,
          query: selectedTag.query,
          params: selectedTag.params,
        }
      : { path: route.path, meta: route.meta };

    const action = TAG_MENU_ACTION_BY_INDEX[key];
    if (action) {
      menuHandlers[action](tagRoute);
    }

    setTimeout(() => {
      refreshMenuState();
    });
  }

  /**
   * 下拉菜单命令（el-dropdown @command 回调签名）
   * @param command 菜单项 key 与元数据
   */
  function handleCommand(command: { key: number; item: TagContextMenuItem }): void {
    dispatchMenuCommand(command.key, command.item);
  }

  function selectTag(key: number, item: TagContextMenuItem): void {
    closeMenu();
    dispatchMenuCommand(key, item, currentSelect.value);
  }

  function openMenu(tag: RouteConfigs, event: MouseEvent): void {
    closeMenu();

    applyMenuState(
      tagsViews,
      resolveContextMenuState({
        tag,
        route,
        tags: multiTags.value,
        topPath,
      })
    );

    currentSelect.value = tag;
    const { left, top } = positionContextMenu(event, containerDom.value, layoutUiStore.hiddenSideBar);
    buttonLeft.value = left;
    buttonTop.value = top;
    nextTick(() => {
      visible.value = true;
    });
  }

  return {
    handleCommand,
    selectTag,
    openMenu,
    refreshMenuState,
  };
}
