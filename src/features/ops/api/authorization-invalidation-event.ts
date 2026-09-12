import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 授权失效幂等事件分页查询参数
 */
export interface AuthorizationInvalidationEventPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 业务事件 ID */
  eventId?: string;
  /** 变更维度（AuthorizationChangeKind） */
  changeKind?: string;
  /** 是否处理中占位（impacted_user_count = -1） */
  processing?: boolean;
  /** 处理完成时间（开始） */
  processedAtStart?: string;
  /** 处理完成时间（结束） */
  processedAtEnd?: string;
}

/**
 * 授权失效幂等事件分页行
 */
export interface AuthorizationInvalidationEventPageRow extends BaseResponsePageRow {
  eventId?: string;
  changeKind?: string;
  processing?: boolean;
  impactedUserCount?: number | null;
  versionBumpedCount?: number | null;
  profileRefreshedCount?: number | null;
  profileEvictedCount?: number | null;
  processedAt?: string | null;
}

/**
 * 分页查询授权失效幂等事件
 * @param params 分页查询参数
 * @returns 分页结果
 */
export function getAuthorizationInvalidationEventPage(params: AuthorizationInvalidationEventPageQuery) {
  return http.get<PageResponse<AuthorizationInvalidationEventPageRow>, AxiosRequestConfig>(
    '/system/ops/authorization-invalidation/event/page',
    { params }
  );
}

/**
 * 授权失效幂等事件详情
 */
export interface AuthorizationInvalidationEventDetailRow extends AuthorizationInvalidationEventPageRow {
  remark?: string | null;
}

/**
 * 授权失效幂等事件详情
 * @param id 主键
 * @returns 详情
 */
export function getAuthorizationInvalidationEventDetail(id: string) {
  return http.get<AuthorizationInvalidationEventDetailRow, AxiosRequestConfig>(
    `/system/ops/authorization-invalidation/event/${id}`
  );
}

/**
 * 释放幂等事件 processing 占位
 * @param id 幂等事件主键
 * @returns 是否实际释放
 */
export function releaseAuthorizationInvalidationEventClaim(id: string) {
  return http.post<boolean, AxiosRequestConfig>(`/system/ops/authorization-invalidation/event/${id}/release-claim`);
}
