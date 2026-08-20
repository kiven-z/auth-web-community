import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 登录日志分页查询参数
 */
export interface LoginLogPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 用户 ID */
  userId?: string;
  loginTimeStart?: string;
  loginTimeEnd?: string;
  /** 登录结果 */
  loginResult?: number;
  /** 登录类型 */
  loginType?: string;
}

/**
 * 登录日志分页行
 */
export interface LoginLogPageRow extends BaseResponsePageRow {
  userId?: string;
  /** 关联用户展示名 */
  username?: string | null;
  loginResult: number;
  loginTime: string;
  loginRegion?: string | null;
  loginType?: string | null;
}

/**
 * 分页查询登录日志
 * @param params 登录日志分页查询参数
 * @returns 登录日志分页行
 */
export function getLoginLogPage(params: LoginLogPageQuery): Promise<PageResponse<LoginLogPageRow>> {
  return http.get<PageResponse<LoginLogPageRow>, AxiosRequestConfig<LoginLogPageQuery>>('/system/log/login/page', {
    params,
  });
}

/**
 * 登录日志详情
 */
export interface LoginLogDetailRow extends BaseResponsePageRow {
  userId?: string;
  username?: string | null;
  loginResult: number;
  failureReason?: string | null;
  loginTime: string;
  loginIp?: string;
  loginRegion?: string | null;
  userAgent?: string | null;
  deviceType?: string | null;
  osType?: string | null;
  browserType?: string | null;
  loginType?: string | null;
  sessionId?: string | null;
}

/**
 * 登录日志详情
 * @param id 登录日志ID
 * @returns 登录日志详情
 */
export function getLoginLogDetail(id: string): Promise<LoginLogDetailRow> {
  return http.get<LoginLogDetailRow, AxiosRequestConfig>(`/system/log/login/${id}`);
}

/**
 * 批量删除登录日志
 * @param ids 登录日志ID数组
 * @returns 删除登录日志响应
 */
export function deleteLoginLog(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/log/login', { data: ids });
}
