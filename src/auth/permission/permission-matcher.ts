/** 管理员通配权限 */
const ADMIN_WILDCARD_PERMISSIONS = ['*', '*:*', '*:*:*', '*:*:*:*'] as const;

const ASTERISK = '*';

/**
 * 是否命中管理员全局通配权限
 * @param userPermissions 用户权限列表
 * @returns 是否命中通配权限
 */
function isAdminPermission(userPermissions: string[]): boolean {
  const permissions = new Set(
    userPermissions.filter((permission) => permission?.trim()).map((permission) => permission.trim())
  );

  return ADMIN_WILDCARD_PERMISSIONS.some((wildcard) => permissions.has(wildcard));
}

/**
 * 单条授予权限是否满足所需权限
 * @param granted 授予的权限
 * @param required 所需的权限
 * @returns 是否匹配
 */
function matchPermission(granted: string, required: string): boolean {
  // 如果授予的权限或需要的权限为空，则返回 false
  if (!granted?.trim() || !required?.trim()) {
    return false;
  }

  // 修剪并转换为小写
  const normalizedGranted = granted.trim().toLowerCase();
  const normalizedRequired = required.trim().toLowerCase();

  // 检查是否为管理员通配权限
  if (isAdminPermission([normalizedGranted])) {
    return true;
  }

  // 如果授予的权限和需要的权限相等，则返回 true
  if (normalizedGranted === normalizedRequired) {
    return true;
  }

  // 分割授予的权限和需要的权限
  const grantedParts = normalizedGranted.split(':');
  const requiredParts = normalizedRequired.split(':');

  // 获取授予的权限和需要的权限的最大长度
  const maxLength = Math.max(grantedParts.length, requiredParts.length);

  // 遍历最大长度
  for (let index = 0; index < maxLength; index++) {
    const grantedPart = index < grantedParts.length ? grantedParts[index] : '';
    const requiredPart = index < requiredParts.length ? requiredParts[index] : '';

    // 如果授予的权限为通配符，则跳过
    if (grantedPart === ASTERISK) {
      continue;
    }

    // 如果授予的权限和需要的权限不相等，则返回 false
    if (grantedPart !== requiredPart) {
      return false;
    }
  }

  return true;
}

/**
 * 所需权限是否全部被授予列表覆盖（数组表示 AND）
 * @param required 所需权限列表
 * @param granted 授予权限列表
 * @returns 是否全部满足
 */
function satisfiesAllRequired(required: string[], granted: string[]): boolean {
  // 如果所需权限或授予权限为空，则返回 false
  if (required.length === 0 || granted.length === 0) {
    return false;
  }

  // 检查是否为管理员通配权限
  if (isAdminPermission(granted)) {
    return true;
  }

  // 遍历所需权限
  return required.every((requiredPermission) =>
    granted.some((grantedPermission) => matchPermission(grantedPermission, requiredPermission))
  );
}

/**
 * 所需权限是否任一被授予列表覆盖（数组表示 OR）
 * @param required 所需权限列表
 * @param granted 授予权限列表
 * @returns 是否至少满足一条
 */
function satisfiesAnyRequired(required: string[], granted: string[]): boolean {
  if (required.length === 0 || granted.length === 0) {
    return false;
  }

  if (isAdminPermission(granted)) {
    return true;
  }

  return required.some((requiredPermission) =>
    granted.some((grantedPermission) => matchPermission(grantedPermission, requiredPermission))
  );
}

export { isAdminPermission, matchPermission, satisfiesAllRequired, satisfiesAnyRequired };
