import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 用户活跃会话
 */
export interface UserSessionIndex {
  userId?: string;
  sessionId: string;
  ipAddress?: string | null;
  ipRegion?: string | null;
  deviceType?: string | null;
  browserType?: string | null;
  osType?: string | null;
  rememberMe?: boolean | null;
  refreshTokenExpiresAt?: number | null;
  /** 登录时间戳（毫秒） */
  loginAt?: number | null;
}

/**
 * 查询用户活跃会话列表
 * @param userId 用户 ID
 * @returns 活跃会话列表
 */
export function listUserSessions(userId: string): Promise<UserSessionIndex[]> {
  return http.get<UserSessionIndex[], AxiosRequestConfig>(`auth/admin/users/${userId}/sessions`);
}

/**
 * 踢出指定会话
 * @param userId 用户 ID
 * @param sessionId 会话 ID（jti）
 */
export function kickUserSession(userId: string, sessionId: string): Promise<void> {
  return http.post<void, unknown>(`auth/admin/users/${userId}/sessions/${sessionId}/kick`);
}

/**
 * 踢出用户全部会话
 * @param userId 用户 ID
 */
export function kickAllUserSessions(userId: string): Promise<void> {
  return http.post<void, unknown>(`auth/admin/users/${userId}/sessions/kick-all`);
}

/**
 * 批量踢出用户全部会话
 * @param userIds 用户 ID 列表
 */
export function batchKickAllUserSessions(userIds: string[]): Promise<void> {
  return http.post<void, string[]>(`auth/admin/users/kick-all`, { data: userIds });
}
