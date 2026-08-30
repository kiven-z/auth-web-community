import { buildHierarchyTree } from '@/shared/utils/tree';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router';
import { constantRoutes, initConstantRoutes, moduleRouteRecords, remainingRouter } from './routes';
import { ascending } from './utils/menuSort';
import { formatFlatteningRoutes, formatTwoStageRoutes } from './utils/routeTree';

import { createAuthGuard } from './guards/auth';
import { createKeepAliveGuard } from './guards/keepalive';
import { createProgressGuard, resetLoadedPaths } from './guards/progress';
import { createTitleGuard } from './guards/title';

export { remainingPaths } from './routes';

/**
 * 创建路由实例
 * @returns 路由实例
 */
export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes.concat(...(remainingRouter as Array<RouteRecordRaw>)),
  strict: true,
  scrollBehavior(_to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (from.meta.saveSrollTop) {
      const top: number = document.documentElement.scrollTop || document.body.scrollTop;
      return { left: 0, top };
    }
    return undefined;
  },
});

// 注册所有路由守卫
createProgressGuard(router);
createTitleGuard(router);
createKeepAliveGuard(router);
createAuthGuard(router);

/**
 * 重置为启动时的静态路由。
 */
export function resetRouter() {
  router.clearRoutes();
  for (const route of initConstantRoutes.concat(...(remainingRouter as Array<RouteRecordRaw>))) {
    router.addRoute(route);
  }
  router.options.routes = formatTwoStageRoutes(
    formatFlatteningRoutes(buildHierarchyTree(ascending(moduleRouteRecords)))
  );
  usePermissionStore().clearAllCachePage();
  resetLoadedPaths();
}

export default router;
