import { hasAuth } from '@/auth/permission/hasAuth';
import { isOneOfArray } from '@/auth/permission/isOneOfArray';
import { readUserProfileFromStorage } from '@/core/session/profile/userProfileStorage';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

/** publicAccess 或未配置 roles 时不做角色拦截 */
export function isBlockedByRoles(to: RouteLocationNormalized): boolean {
  if (to.meta?.publicAccess === true || !to.meta?.roles) {
    return false;
  }
  const userInfo = readUserProfileFromStorage();
  return !isOneOfArray(to.meta.roles, userInfo?.roles);
}

/** meta.auths 未配置或为空时不校验权限码 */
export function isBlockedByAuths(to: RouteLocationNormalized): boolean {
  const auths = to.meta?.auths;
  if (auths == null || (Array.isArray(auths) && auths.length === 0)) {
    return false;
  }
  return !hasAuth(auths);
}

/** 角色或权限码不足时跳转 403；返回是否已处理导航 */
export function blockByAccessIfNeeded(to: RouteLocationNormalized, next: NavigationGuardNext): boolean {
  if (!isBlockedByRoles(to) && !isBlockedByAuths(to)) {
    return false;
  }
  next({ path: '/error/403' });
  return true;
}
