/**
 * 站内信发送模块按钮权限码
 */
export const IN_APP_COMPOSE_PERMS = {
  /** 按范围发送站内信 */
  SEND: 'message:inapp:send',
  /** 历史发送分页查询（导入弹窗） */
  QUERY: 'message:inapp:query',
  /** 历史发送详情（导入回填） */
  DETAIL: 'message:inapp:detail',
} as const;
