import type { RouteConfigs } from '@/router/types';
import { handleAliveRoute } from '@/router/utils/misc';
import NProgress from '@/services/progress';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import type { Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import type { CloseScope } from '../types';
import { applyCloseScope, pickNavigateTag, shouldNavigateAfterClose } from '../utils/close-tags';
import { findTagIndex } from '../utils/tag-identity';
import { navigateToTag } from '../utils/tag-navigate';

interface TagCloseDeps {
  route: RouteLocationNormalizedLoaded;
  router: Router;
  multiTags: Ref<RouteConfigs[]>;
  fixedTagCount: number;
  topPath?: string;
  topMenuTag?: RouteConfigs;
  keepHomeFixedTags: boolean;
  dynamicTagView: () => Promise<void>;
}

/**
 * 标签关闭与刷新
 * @param deps 路由与固定标签上下文
 * @returns 关闭、刷新相关方法
 */
export function useTagClose(deps: TagCloseDeps) {
  const { route, router, multiTags, fixedTagCount, topPath, topMenuTag, keepHomeFixedTags, dynamicTagView } = deps;

  function onFresh(): void {
    NProgress.start();
    const { fullPath, query } = route;
    router.replace({
      path: '/redirect' + fullPath,
      query,
    });
    handleAliveRoute(route, 'refresh');
    NProgress.done();
  }

  function closeTagsByScope(target: RouteConfigs, scope: CloseScope): void {
    const targetIndex = findTagIndex(multiTags.value, target);
    const nextTags = applyCloseScope(
      multiTags.value,
      targetIndex,
      scope,
      fixedTagCount,
      target,
      topMenuTag,
      keepHomeFixedTags
    );
    useTagsPreferencesStore().setTags(nextTags);
    void dynamicTagView();

    const closedPath = target.path ?? '';
    if (shouldNavigateAfterClose(closedPath, route.path, scope, nextTags)) {
      navigateToTag(router, pickNavigateTag(nextTags));
    }
  }

  function deleteMenu(item: RouteConfigs, scope?: CloseScope): void {
    closeTagsByScope(item, scope ?? 'current');
    handleAliveRoute(route);
  }

  function closeAllTags(): void {
    useTagsPreferencesStore().setTags(multiTags.value.slice(0, fixedTagCount));
    router.push(topPath);
    handleAliveRoute(route);
    void dynamicTagView();
  }

  return {
    onFresh,
    deleteMenu,
    closeAllTags,
  };
}
