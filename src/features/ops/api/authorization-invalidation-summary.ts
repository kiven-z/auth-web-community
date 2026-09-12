import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 失败率趋势聚合粒度
 */
export type AuthorizationInvalidationFailureRateTrendGranularity = 'DAY' | 'WEEK';

/**
 * 授权失效 Outbox 统计
 */
export interface AuthorizationInvalidationOutboxStats {
  totalCount?: number;
  pendingCount?: number;
  processingCount?: number;
  successCount?: number;
  failedCount?: number;
  deadCount?: number;
  failureRatePercent?: number | string;
}

/**
 * 授权失效幂等事件统计
 */
export interface AuthorizationInvalidationEventStats {
  totalCount?: number;
  processingCount?: number;
  completedCount?: number;
}

/**
 * 授权失效运维统计摘要
 */
export interface AuthorizationInvalidationSummary {
  outbox?: AuthorizationInvalidationOutboxStats;
  event?: AuthorizationInvalidationEventStats;
}

/**
 * 查询授权失效运维统计摘要
 * @returns 统计摘要
 */
export function getAuthorizationInvalidationSummary() {
  return http.get<AuthorizationInvalidationSummary, AxiosRequestConfig>(
    '/system/ops/authorization-invalidation/summary'
  );
}

/**
 * 失败率趋势数据点
 */
export interface AuthorizationInvalidationFailureRateTrendPoint {
  bucket?: string;
  totalCount?: number;
  failedCount?: number;
  deadCount?: number;
  failureRatePercent?: number | string;
}

/**
 * 失败率趋势响应
 */
export interface AuthorizationInvalidationFailureRateTrend {
  granularity?: AuthorizationInvalidationFailureRateTrendGranularity;
  startTime?: string;
  endTime?: string;
  points?: AuthorizationInvalidationFailureRateTrendPoint[];
}

/**
 * 失败率趋势查询参数
 */
export interface AuthorizationInvalidationFailureRateTrendQuery {
  granularity?: AuthorizationInvalidationFailureRateTrendGranularity;
  days?: number;
  startTime?: string;
  endTime?: string;
}

/**
 * 查询授权失效失败率趋势
 * @param params 查询参数
 * @returns 失败率趋势
 */
export function getAuthorizationInvalidationFailureRateTrend(params: AuthorizationInvalidationFailureRateTrendQuery) {
  return http.get<AuthorizationInvalidationFailureRateTrend, AxiosRequestConfig>(
    '/system/ops/authorization-invalidation/stats/failure-rate/trend',
    { params }
  );
}
