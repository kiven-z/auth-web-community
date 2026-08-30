import type { RouteConfigs, TagContextMenuItem } from '@/layout/types';
import { remainingPaths } from '@/router';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { usePermissionStore } from '@/store/modules/auth/permission';
import type { Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { computeMenuState } from '../utils/contextMenuPolicy';
import { applyMenuState } from '../utils/menuView';

interface TagRouteSyncDeps {
  route: RouteLocationNormalizedLoaded;
  router: Router;
  multiTags: Ref<RouteConfigs[]>;
  tagsViews: TagContextMenuItem[];
  topPath?: string;
}

/**
 * 路由与标签列表同步（补标签、刷新菜单态）
 * @param deps 路由与标签依赖
 * @returns 同步方法
 */
export function useTagRouteSync(deps: TagRouteSyncDeps) {
  const { route, router, multiTags, tagsViews, topPath } = deps;

  function dynamicRouteTag(value: string): void {
    if (multiTags.value.some((item) => item.path === value)) {
      return;
    }

    function walkRoutes(routes: readonly object[], pathValue: string): void {
      routes.forEach((routeItem: RouteConfigs) => {
        if (routeItem.path === pathValue) {
          useMultiTagsStore().pushTag({
            path: pathValue,
            meta: routeItem.meta,
            name: routeItem.name,
          });
          return;
        }
        if (routeItem.children?.length) {
          walkRoutes(routeItem.children, pathValue);
        }
      });
    }

    walkRoutes(router.options.routes, value);
  }

  function shouldSyncRoute(): boolean {
    return usePermissionStore().wholeMenus.length > 0 && !remainingPaths.includes(route.path);
  }

  function syncTagsWithRoute(): void {
    if (route.path.includes('/redirect')) {
      return;
    }
    if (shouldSyncRoute()) {
      dynamicRouteTag(route.path);
    }
    setTimeout(() => {
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
    });
  }

  function initTagsFromRoute(): void {
    applyMenuState(
      tagsViews,
      computeMenuState({
        tags: multiTags.value,
        currentPath: route.fullPath,
        topPath,
      })
    );
    if (shouldSyncRoute()) {
      dynamicRouteTag(route.path);
    }
  }

  return {
    dynamicRouteTag,
    syncTagsWithRoute,
    initTagsFromRoute,
  };
}
