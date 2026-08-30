import { ApiConflictError } from '@/core/http/apiError';
import { getTopMenu } from '@/router/utils/misc';
import { initRouter } from '@/router/utils/routeRegistry';
import { findRouteByPath } from '@/router/utils/routeTree';
import { errorMessage } from '@/services/feedback/message';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tagsPreferences';
import { usePermissionStore } from '@/store/modules/auth/permission';
import isEmpty from 'lodash/isEmpty';
import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';

async function initDynamicRoutesForColdStart(to: RouteLocationNormalized): Promise<boolean> {
  try {
    const routerInstance = await initRouter();
    if (!useTagsPreferencesStore().enabled) {
      pushInitialTagFromRoute(to.path, routerInstance);
    }
    return true;
  } catch (error: unknown) {
    if (error instanceof ApiConflictError) {
      return false;
    }
    errorMessage(error);
    return false;
  }
}

/** 后台父级路由取首个子路由作为标签页 */
function pushInitialTagFromRoute(path: string, routerInstance: Router): void {
  const rootChildren = routerInstance.options.routes[0]?.children;
  if (!rootChildren?.length) {
    getTopMenu(true);
    return;
  }

  const route = findRouteByPath(path, rootChildren);
  getTopMenu(true);

  if (!route?.meta?.title) {
    return;
  }

  const tagRoute = isEmpty(route.parentId) && route.meta?.backstage ? route.children?.[0] : route;
  if (!tagRoute) {
    return;
  }

  const { path: tagPath, name, meta } = tagRoute;
  useTagsPreferencesStore().pushTag({ path: tagPath, name, meta });
}

/** 菜单未加载时拉动态路由并 replace 重进；返回是否已处理导航 */
export async function resolveColdStartNavigation(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<boolean> {
  const permissionStore = usePermissionStore();
  if (permissionStore.wholeMenus.length !== 0 || to.path === '/login') {
    return false;
  }

  const ok = await initDynamicRoutesForColdStart(to);
  if (!ok) {
    next(false);
    return true;
  }

  next({ path: to.fullPath, query: to.query, hash: to.hash, replace: true });
  return true;
}
