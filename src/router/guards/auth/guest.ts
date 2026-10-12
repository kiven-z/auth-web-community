import { removeToken } from '@/core/session/token/session-token';
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

/** 未登录可访问路径（guest 用 path，authenticated 用 fullPath 匹配） */
const AUTH_WHITE_LIST = new Set(['/login']);

/** 未登录：白名单放行，否则清 token 去登录 */
export function passGuest(to: RouteLocationNormalized): RouteLocationRaw | undefined {
  if (AUTH_WHITE_LIST.has(to.path)) {
    return undefined;
  }
  removeToken();
  return { path: '/login' };
}

/** 已登录访问白名单页时回退到来源页，避免重复进 /login */
export function passAuthenticated(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): RouteLocationRaw | undefined {
  if (AUTH_WHITE_LIST.has(to.fullPath)) {
    return from.fullPath;
  }
  return undefined;
}
