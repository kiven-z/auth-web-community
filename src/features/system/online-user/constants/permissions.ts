import { SYS_SESSION_PERMS } from '@/features/system/_shared/constants/session-permissions';

/**
 * 在线用户模块按钮权限码
 */
export const SYS_ONLINE_USER_PERMS = {
  /** 分页查询 */
  QUERY: 'ADMIN',
  VIEW_SESSIONS: SYS_SESSION_PERMS.VIEW_SESSIONS,
  KICK_ALL: SYS_SESSION_PERMS.KICK_ALL,
} as const;
