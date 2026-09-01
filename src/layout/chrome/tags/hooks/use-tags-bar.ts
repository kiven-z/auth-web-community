import type { TagContextMenuItem } from '@/layout/chrome/tags/types';
import { type RouteConfigs, routerArrays } from '@/router/types';
import { getTopMenu } from '@/router/utils/misc';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { type Ref, toRaw } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import { buildFixedTags } from '../utils/fixed-tag';
import { useTagClose } from './use-tag-close';
import { useTagMenuDispatch } from './use-tag-menu-dispatch';
import { useTagRouteSync } from './use-tag-route-sync';

interface TagsBarDeps {
  route: RouteLocationNormalizedLoaded;
  router: Router;
  multiTags: Ref<RouteConfigs[]>;
  tagsViews: TagContextMenuItem[];
  currentSelect: Ref<RouteConfigs | Record<string, never>>;
  visible: Ref<boolean>;
  buttonTop: Ref<number>;
  buttonLeft: Ref<number>;
  containerDom: Ref<HTMLElement | undefined>;
  closeMenu: () => void;
  onContentFullScreen: () => void;
  dynamicTagView: () => Promise<void>;
}

/**
 * 标签栏行为编排：关闭、菜单、路由同步
 * @param deps 标签栏运行时依赖
 * @returns 标签栏对外方法
 */
export function useTagsBar(deps: TagsBarDeps) {
  const {
    route,
    router,
    multiTags,
    tagsViews,
    currentSelect,
    visible,
    buttonTop,
    buttonLeft,
    containerDom,
    closeMenu,
    onContentFullScreen,
    dynamicTagView,
  } = deps;

  const { VITE_HIDE_HOME } = import.meta.env;
  const topPath = getTopMenu()?.path;
  const fixedTags = buildFixedTags(routerArrays, usePermissionStore().flatteningRoutes);
  const keepHomeFixedTags = VITE_HIDE_HOME === 'false';
  const topMenuTag = toRaw(getTopMenu()) as RouteConfigs | undefined;

  const { dynamicRouteTag, syncTagsWithRoute, initTagsFromRoute } = useTagRouteSync({
    route,
    router,
    multiTags,
    tagsViews,
    topPath,
  });

  const { onFresh, deleteMenu, closeAllTags } = useTagClose({
    route,
    router,
    multiTags,
    fixedTagCount: fixedTags.length,
    topPath,
    topMenuTag,
    keepHomeFixedTags,
    dynamicTagView,
  });

  const { handleCommand, selectTag, openMenu, refreshMenuState } = useTagMenuDispatch({
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
  });

  return {
    deleteMenu,
    handleCommand,
    selectTag,
    openMenu,
    showMenuModel: refreshMenuState,
    syncTagsWithRoute,
    initTagsFromRoute,
    dynamicRouteTag,
  };
}
