/**
 * 任务分组模块按钮权限码
 */
export const SYS_JOB_GROUP_PERMS = {
  /** 分页查询、详情查看 */
  QUERY: 'schedule:jobgroup:query',
  /** 新增任务分组 */
  CREATE: 'schedule:jobgroup:create',
  /** 编辑任务分组 */
  UPDATE: 'schedule:jobgroup:update',
  /** 删除任务分组 */
  DELETE: 'schedule:jobgroup:delete',
  /** 批量启停分组下全部任务 */
  BATCH_UPDATE_JOBS_IN_GROUP: 'schedule:job:update',
} as const;
