import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 密码历史日志分页查询参数
 */
export interface PasswordHistoryPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  userId?: string;
  changeTimeStart?: string;
  changeTimeEnd?: string;
  changeIp?: string;
}

/**
 * 密码历史日志分页行
 */
export interface PasswordHistoryPageRow extends BaseResponsePageRow {
  userId: string;
  username: string;
  changeTime: string;
  changeIp: string;
}

/**
 * 分页查询密码历史日志
 * @param params 密码历史日志分页查询参数
 * @returns 密码历史日志分页行
 */
export function getPasswordHistoryPage(params: PasswordHistoryPageQuery) {
  return http.get<PageResponse<PasswordHistoryPageRow>, AxiosRequestConfig<PasswordHistoryPageQuery>>(
    '/system/log/password-history/page',
    { params }
  );
}

/**
 * 密码历史日志详情
 */
export interface PasswordHistoryDetailRow extends BaseResponsePageRow {
  userId?: string | null;
  username?: string | null;
  changeIp: string;
}

/**
 * 查询密码历史日志详情
 * @param id 密码历史日志ID
 * @returns 密码历史日志详情
 */
export function getPasswordHistoryDetail(id: string) {
  return http.get<PasswordHistoryDetailRow, AxiosRequestConfig>(`/system/log/password-history/${id}`);
}

/**
 * 批量删除密码历史日志
 * @param ids 密码历史日志ID数组
 * @returns 删除密码历史日志响应
 */
export function deletePasswordHistory(ids: string[]) {
  return http.request<string>('delete', '/system/log/password-history', { data: ids });
}
