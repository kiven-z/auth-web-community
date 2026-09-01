import { SYS_SESSION_PERMS } from '@/features/system/_shared/constants/session-permissions';

/**
 * 用户管理模块按钮权限码
 */
export const SYS_USER_PERMS = {
  /** 分页查询、用户档案查看 */
  QUERY: 'sys:user:query',
  /** 新增用户 */
  CREATE: 'sys:user:create',
  /** 编辑、批量状态、管理员重置密码 */
  UPDATE: 'sys:user:update',
  /** 删除用户 */
  DELETE: 'sys:user:delete',
  /** Excel 导入 */
  IMPORT: 'sys:user:import',
  ...SYS_SESSION_PERMS,
  /** 刷新用户授权画像缓存 */
  AUTH_REFRESH: 'ADMIN',
} as const;

/**
 * 用户角色分配权限码
 */
export const SYS_USER_ROLE_PERMS = {
  /** 查询已分配角色 */
  QUERY: 'sys:userrole:query',
  /** 保存角色分配 */
  UPDATE: 'sys:userrole:update',
} as const;

/**
 * 用户部门关联权限码
 */
export const SYS_USER_DEPT_PERMS = {
  /** 分页查询用户部门关联 */
  QUERY: 'sys:userdept:query',
  /** 新增用户部门关联 */
  CREATE: 'sys:userdept:create',
  /** 更新用户部门关联 */
  UPDATE: 'sys:userdept:update',
  /** 删除用户部门关联、清空全部 */
  DELETE: 'sys:userdept:delete',
} as const;

/**
 * 用户岗位关联权限码
 */
export const SYS_USER_POST_PERMS = {
  /** 分页查询用户岗位关联 */
  QUERY: 'sys:userpost:query',
  /** 新增用户岗位关联 */
  CREATE: 'sys:userpost:create',
  /** 更新用户岗位关联 */
  UPDATE: 'sys:userpost:update',
  /** 删除用户岗位关联、清空全部 */
  DELETE: 'sys:userpost:delete',
} as const;
