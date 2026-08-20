/**
 * 操作日志模块按钮权限码
 */
export const SYS_LOG_OPERATION_PERMS = {
  /** 分页查询 */
  QUERY: 'log:operation:query',
  /** 操作日志详情 */
  DETAIL: 'log:operation:detail',
  /** 批量删除、单条删除 */
  DELETE: 'log:operation:delete',
} as const;
