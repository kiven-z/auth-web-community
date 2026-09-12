import { type RouteConfigs, routerArrays } from '@/router/types';
import { getTopMenu } from '@/router/utils/misc';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { storeToRefs } from 'pinia';
import { toRaw, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { buildFixedTags } from '../utils/fixed-tag';
import { useTagClose } from './use-tag-close';
import { useTagMenu } from './use-tag-menu';
import { useTagRouteSync } from './use-tag-route-sync';

interface TagsBarDeps {
  containerDom: Ref<HTMLElement | undefined>;
  dynamicTagView: () => Promise<void>;
}

/**
 * 标签栏行为编排：关闭、菜单、路由同步
 * @param deps 容器与滚动刷新
 * @returns 标签栏对外方法与菜单状态
 */
export function useTagsBar(deps: TagsBarDeps) {
  const { containerDom, dynamicTagView } = deps;
  const route = useRoute();
  const router = useRouter();
  const { multiTags } = storeToRefs(useTagsPreferencesStore());

  const { VITE_HIDE_HOME } = import.meta.env;
  const topPath = getTopMenu()?.path;
  const fixedTags = buildFixedTags(routerArrays, usePermissionStore().flatteningRoutes);
  const keepHomeFixedTags = VITE_HIDE_HOME === 'false';
  const topMenuTag = toRaw(getTopMenu()) as RouteConfigs | undefined;

  const { syncTagsWithRoute } = useTagRouteSync({
    route,
    router,
    multiTags,
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

  const { visible, menuStyle, menuItems, closeMenu, openMenu, selectTag } = useTagMenu({
    route,
    multiTags,
    containerDom,
    topPath,
    onFresh,
    deleteMenu,
    closeAllTags,
  });

  return {
    deleteMenu,
    openMenu,
    closeMenu,
    selectTag,
    visible,
    menuStyle,
    menuItems,
    syncTagsWithRoute,
  };
}
