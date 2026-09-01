import type { PageResponse } from '@/api/common/page';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 在线用户分页查询参数
 */
export interface OnlineUserPageQuery {
  pageIndex?: number;
  pageSize?: number;
  userId?: string;
}

/**
 * 在线用户分页行
 */
export interface OnlineUserPageRow {
  userId?: string;
  username?: string | null;
  nickname?: string | null;
  activeSessionCount?: number | null;
  /** 最近登录时间戳（毫秒） */
  lastLoginAt?: number | null;
}

/**
 * 分页查询在线用户
 * @param params 查询参数
 * @returns 分页结果
 */
export function getOnlineUserPage(params: OnlineUserPageQuery): Promise<PageResponse<OnlineUserPageRow>> {
  return http.get<PageResponse<OnlineUserPageRow>, AxiosRequestConfig<OnlineUserPageQuery>>('auth/admin/users/online', {
    params,
  });
}
