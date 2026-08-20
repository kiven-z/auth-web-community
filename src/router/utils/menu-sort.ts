import { isOneOfArray } from '@/auth/permission/isOneOfArray';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import type { RouteComponent } from 'vue-router';

function handRank(routeInfo: AppRouteRecord) {
  const { name, path, parentId, meta } = routeInfo;
  return isEmpty(parentId) ? isEmpty(meta?.rank) || (meta?.rank === 0 && name !== 'Home' && path !== '/') : false;
}

/**
 * 按照路由中meta下的rank等级升序来排序路由
 * @param arr 路由数据
 * @returns 排序后的路由数据
 */
function ascending(arr: any[]) {
  arr.forEach((v, index) => {
    // 当rank不存在时，根据顺序自动创建，首页路由永远在第一位
    if (handRank(v) && v.meta) v.meta.rank = index + 2;
  });
  return arr.sort(
    (a: { meta: { rank: number } }, b: { meta: { rank: number } }) => (a?.meta?.rank ?? 0) - (b?.meta?.rank ?? 0)
  );
}

/**
 * 过滤meta中showLink为false的菜单
 * @param data 菜单数据
 * @returns 过滤后的菜单数据
 */
function filterTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter((v: { meta: { showLink: boolean } }) => v.meta?.showLink !== false);
  newTree.forEach((v: { children }) => v.children && (v.children = filterTree(v.children)));
  return newTree;
}

/**
 * 按角色过滤菜单；publicAccess 为 true 时对所有登录用户可见，不校验角色。
 * 未配置 roles 的菜单可见；已配置但当前角色为空则不可见。
 * @param data 菜单数据
 * @param roles 当前用户角色
 * @returns 过滤后的菜单数据
 */
function filterNoPermissionTree(data: RouteComponent[], roles: string[]) {
  const newTree = cloneDeep(data).filter((v: any) => {
    if (v.meta?.publicAccess === true) {
      return true;
    }
    return isOneOfArray(v.meta?.roles, roles);
  });
  newTree.forEach((v: any) => {
    if (v.children) {
      v.children = filterNoPermissionTree(v.children, roles);
    }
  });
  return newTree;
}

export { ascending, filterNoPermissionTree, filterTree };
