import { removeToken } from '@/core/session/token/sessionToken';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

/** 未登录可访问路径（guest 用 path，authenticated 用 fullPath 匹配） */
const AUTH_WHITE_LIST = new Set(['/login']);

/** 未登录：白名单放行，否则清 token 去登录 */
export function passGuest(to: RouteLocationNormalized, next: NavigationGuardNext): void {
  if (AUTH_WHITE_LIST.has(to.path)) {
    next();
    return;
  }
  removeToken();
  next({ path: '/login' });
}

/** 已登录访问白名单页时回退到来源页，避免重复进 /login */
export function passAuthenticated(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  if (AUTH_WHITE_LIST.has(to.fullPath)) {
    next(from.fullPath);
    return;
  }
  next();
}
