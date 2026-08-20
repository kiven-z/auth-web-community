/**
 * 定时任务模块按钮权限码
 */
export const SYS_JOB_PERMS = {
  /** 分页查询、任务目录 */
  QUERY: 'schedule:job:query',
  /** 任务详情 */
  DETAIL: 'schedule:job:detail',
  /** 新增定时任务 */
  CREATE: 'schedule:job:create',
  /** 编辑、批量启停、立即执行 */
  UPDATE: 'schedule:job:update',
  /** 删除定时任务 */
  DELETE: 'schedule:job:delete',
} as const;
