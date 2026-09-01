import { satisfiesAllRequired, satisfiesAnyRequired } from '@/auth/permission/permission-matcher';
import type { AuthCode, AuthMode } from '@/auth/permission/types';
import { useUserStore } from '@/store/modules/auth/user';
import isString from 'lodash/isString';

/**
 * 将权限入参规范为所需权限列表
 * @param value 权限入参
 * @returns 所需权限列表
 */
function normalizeRequiredPermissions(value: AuthCode): string[] {
  if (!value) {
    return [];
  }
  return isString(value) ? [value] : value;
}

/**
 * 是否有按钮级别的权限。
 *
 * 仅依据当前用户 `permissions` 判断。
 * 默认数组入参表示 AND（需同时满足）；`mode: 'any'` 表示 OR。
 * 用户无权限或未登录时返回 false。
 *
 * @param value 单个权限标识或数组
 * @param mode 多权限匹配模式，默认 `all`
 * @returns 是否拥有权限
 */
function hasAuth(value: AuthCode, mode: AuthMode = 'all'): boolean {
  const required = normalizeRequiredPermissions(value);
  if (required.length === 0) {
    return false;
  }

  const { permissions } = useUserStore();
  if (!permissions?.length) {
    return false;
  }

  return mode === 'any' ? satisfiesAnyRequired(required, permissions) : satisfiesAllRequired(required, permissions);
}

export { hasAuth };
