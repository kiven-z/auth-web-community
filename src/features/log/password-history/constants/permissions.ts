/**
 * 密码历史日志模块按钮权限码
 */
export const SYS_LOG_PASSWORD_HISTORY_PERMS = {
  /** 分页查询 */
  QUERY: 'log:passwordhistory:query',
  /** 密码历史详情 */
  DETAIL: 'log:passwordhistory:detail',
  /** 批量删除、单条删除 */
  DELETE: 'log:passwordhistory:delete',
} as const;
