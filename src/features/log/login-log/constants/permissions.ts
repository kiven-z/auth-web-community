/**
 * 登录日志模块按钮权限码
 */
export const SYS_LOG_LOGIN_PERMS = {
  /** 分页查询 */
  QUERY: 'log:login:query',
  /** 登录日志详情 */
  DETAIL: 'log:login:detail',
  /** 批量删除、单条删除 */
  DELETE: 'log:login:delete',
} as const;
