/**
 * 权限决策审计日志模块按钮权限码
 */
export const SYS_LOG_AUTHORIZATION_AUDIT_PERMS = {
  /** 分页查询 */
  QUERY: 'log:authaudit:query',
  /** 权限决策审计详情 */
  DETAIL: 'log:authaudit:detail',
  /** 批量删除、单条删除 */
  DELETE: 'log:authaudit:delete',
} as const;
