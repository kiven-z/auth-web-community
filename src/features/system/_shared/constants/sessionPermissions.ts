/**
 * 用户会话管理按钮权限码
 */
export const SYS_SESSION_PERMS = {
  /** 查看用户活跃会话 */
  VIEW_SESSIONS: 'ADMIN',
  /** 踢出全部会话 */
  KICK_ALL: 'ADMIN',
  /** 踢出单条会话 */
  KICK_SESSION: 'ADMIN',
} as const;
