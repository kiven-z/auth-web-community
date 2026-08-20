import { getConfig } from '@/auth/config';
import { routerArrays } from '@/layout/types';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { storageLocal } from '@/core/storage/storageLocal';
import cloneDeep from 'lodash/cloneDeep';
import type { RouteRecordRaw } from 'vue-router';
import { router } from '../index';
import { addAsyncRoutes } from './async-routes';
import { ascending } from './menu-sort';
import { addPathMatch } from './misc';
import { formatFlatteningRoutes } from './route-tree';
import { ASYNC_ROUTES_STORAGE_KEY } from '@/auth/config/http-config';
import { getAsyncRoutes } from '@/features/system/api/routes';
import { message } from '@/services/feedback/message';
import { transformI18n } from '@/app/plugins/i18n';

/**
 * 处理动态路由（后端返回的路由）
 * @param routeList 路由列表
 */
function handleAsyncRoutes(routeList) {
  if (routeList.length === 0) {
    usePermissionStore().handleWholeMenus(routeList);
  } else {
    const formattedRoutes = formatFlatteningRoutes(addAsyncRoutes(routeList));
    // 将所有动态路由逐个注册到根路由中
    formattedRoutes.forEach((v: RouteRecordRaw) => {
      // 防止重复添加路由
      if (router.options.routes[0].children.some((value) => value.path === v.path)) {
        return;
      }
      // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
      router.options.routes[0].children.push(v);
      if (!router.hasRoute(v?.name)) router.addRoute(v);
    });
    // 所有路由添加完成后统一排序
    ascending(router.options.routes[0].children);
    // 同步路由表：保持 router.options.routes[0].children 与 path="/" 的 children 一致
    const flattenRouters = router.getRoutes().find((n) => n.path === '/');
    if (flattenRouters) {
      flattenRouters.children = router.options.routes[0].children;
      router.addRoute(flattenRouters);
    }
    usePermissionStore().handleWholeMenus(routeList);
  }
  if (!useMultiTagsStore().getMultiTagsCache) {
    useMultiTagsStore().setTags([
      ...routerArrays,
      ...usePermissionStore().flatteningRoutes.filter((v) => v?.meta?.fixedTag),
    ]);
  }
  addPathMatch();
}

/**
 * 初始化动态路由（调用方须 await，避免守卫内重复触发）
 * @returns 路由实例
 */
async function initRouter() {
  if (getConfig()?.CachingAsyncRoutes) {
    const asyncRouteList = storageLocal().getItem<Array<unknown>>(ASYNC_ROUTES_STORAGE_KEY);
    if (asyncRouteList && asyncRouteList.length > 0) {
      handleAsyncRoutes(asyncRouteList);
      return router;
    }
    const response = await fetchAsyncRoutes();
    handleAsyncRoutes(cloneDeep(response));
    if (response.length > 0) {
      storageLocal().setItem(ASYNC_ROUTES_STORAGE_KEY, response);
    }
    return router;
  }

  const response = await fetchAsyncRoutes();
  handleAsyncRoutes(cloneDeep(response));
  return router;
}

/**
 * 拉取后端动态路由；网络/5xx 失败时降级为空数组并提示用户。
 * @returns 动态路由列表
 */
async function fetchAsyncRoutes(): Promise<unknown[]> {
  try {
    const data = await getAsyncRoutes();
    return Array.isArray(data) ? data : [];
  } catch {
    // 只提示业务降级，避免与通用「请求失败」叠弹
    message(transformI18n('tips.asyncRoutesDegraded'), { type: 'warning', duration: 4000 });
    return [];
  }
}

export { handleAsyncRoutes, initRouter };
