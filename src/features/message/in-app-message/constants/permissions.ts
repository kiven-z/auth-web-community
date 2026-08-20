/**
 * 站内信发送任务模块按钮权限码
 */
export const IN_APP_MESSAGE_PERMS = {
  /** 分页查询 */
  QUERY: 'message:inapp:query',
  /** 详情 */
  DETAIL: 'message:inapp:detail',
  /** 按范围发送 */
  SEND: 'message:inapp:send',
  /** 撤回 */
  RECALL: 'message:inapp:recall',
  /** 批量删除 */
  DELETE: 'message:inapp:delete',
} as const;
