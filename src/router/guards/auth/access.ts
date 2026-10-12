import { hasAuth } from '@/auth/permission/has-auth';
import { isOneOfArray } from '@/auth/permission/is-one-of-array';
import { readUserProfileFromStorage } from '@/core/session/profile/user-profile-storage';
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

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

/** 角色或权限码不足时跳转 403；未拦截时返回 undefined */
export function blockByAccessIfNeeded(to: RouteLocationNormalized): RouteLocationRaw | undefined {
  if (!isBlockedByRoles(to) && !isBlockedByAuths(to)) {
    return undefined;
  }
  return { path: '/error/403' };
}
