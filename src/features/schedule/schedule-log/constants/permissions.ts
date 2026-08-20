/**
 * 任务调度日志模块按钮权限码
 */
export const SYS_JOB_LOG_PERMS = {
  /** 分页查询 */
  QUERY: 'schedule:joblog:query',
  /** 日志详情 */
  DETAIL: 'schedule:joblog:detail',
  /** 批量删除、单条删除 */
  DELETE: 'schedule:joblog:delete',
} as const;
