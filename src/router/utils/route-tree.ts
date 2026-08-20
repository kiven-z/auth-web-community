import { buildHierarchyTree } from '@/shared/utils/tree';
import { isProxy, toRaw } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList?.length === 0) return routesList;
  let hierarchyList = buildHierarchyTree(routesList);
  for (let i = 0; i < hierarchyList.length; i++) {
    if (hierarchyList[i].children) {
      hierarchyList = hierarchyList.slice(0, i + 1).concat(hierarchyList[i].children, hierarchyList.slice(i + 1));
    }
  }
  return hierarchyList;
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * 路由树工具
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList?.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === '/') {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: [],
      });
    } else if (newRoutesList[0]) {
      newRoutesList[0].children.push({ ...v });
    }
  });
  return newRoutesList;
}

/**
 * 通过指定 `key` 获取父级路径集合，默认 `key` 为 `path`
 * @param value 值
 * @param routes 路由
 * @param key 键
 * @returns 父级路径集合
 */
function getParentPaths(value: string, routes: RouteRecordRaw[], key = 'path') {
  // 深度遍历查找
  function dfs(routes: RouteRecordRaw[], value: string, parents: string[]) {
    for (const item of routes) {
      // 返回父级path
      if (item[key] === value) return parents;
      // children不存在或为空则不递归
      if (!item.children?.length) continue;
      // 往下查找时将当前path入栈
      parents.push(item.path);

      if (dfs(item.children, value, parents).length) return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }

  return dfs(routes, value, []);
}

function unwrapRoute(route: RouteRecordRaw | undefined | null): AppRouteRecord | null {
  if (!route) {
    return null;
  }
  return isProxy(route) ? toRaw(route) : route;
}

/**
 * 查找对应 `path` 的路由信息
 * @param path 路径
 * @param routes 路由
 * @returns 路由信息
 */
function findRouteByPath(path: string, routes: RouteRecordRaw[]): AppRouteRecord | null {
  const direct = routes.find((item) => item.path == path);
  if (direct) {
    return unwrapRoute(direct);
  }

  for (const route of routes) {
    const children = route.children;
    if (!Array.isArray(children) || children.length === 0) {
      continue;
    }
    const nested = findRouteByPath(path, children);
    if (nested) {
      return nested;
    }
  }
  return null;
}

export { findRouteByPath, formatFlatteningRoutes, formatTwoStageRoutes, getParentPaths };
