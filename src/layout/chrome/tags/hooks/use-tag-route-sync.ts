import type { RouteConfigs } from '@/router/types';
import { remainingPaths } from '@/router';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { usePermissionStore } from '@/store/modules/auth/permission';
import type { Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

interface TagRouteSyncDeps {
  route: RouteLocationNormalizedLoaded;
  router: Router;
  multiTags: Ref<RouteConfigs[]>;
}

/**
 * 路由与标签列表同步（补标签）
 * @param deps 路由与标签依赖
 * @returns 同步方法
 */
export function useTagRouteSync(deps: TagRouteSyncDeps) {
  const { route, router, multiTags } = deps;

  function dynamicRouteTag(value: string): void {
    if (multiTags.value.some((item) => item.path === value)) {
      return;
    }

    function walkRoutes(routes: readonly object[], pathValue: string): void {
      routes.forEach((routeItem: RouteConfigs) => {
        if (routeItem.path === pathValue) {
          useTagsPreferencesStore().pushTag({
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

  function syncTagsWithRoute(): void {
    if (route.path.includes('/redirect')) {
      return;
    }
    if (usePermissionStore().wholeMenus.length > 0 && !remainingPaths.includes(route.path)) {
      dynamicRouteTag(route.path);
    }
  }

  return {
    syncTagsWithRoute,
  };
}
