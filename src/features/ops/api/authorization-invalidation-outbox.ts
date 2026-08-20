import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 授权失效 Outbox 分页查询参数
 */
export interface AuthorizationInvalidationOutboxPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 业务事件 ID */
  eventId?: string;
  /** 变更维度（AuthorizationChangeKind） */
  changeKind?: string;
  /** 投递状态 */
  status?: string;
  /** 触发模块 */
  sourceModule?: string;
  /** 业务主键 */
  sourceBizId?: string;
  /** 创建时间（开始） */
  createdAtStart?: string;
  /** 创建时间（结束） */
  createdAtEnd?: string;
  /** 处理完成时间（开始） */
  processedAtStart?: string;
  /** 处理完成时间（结束） */
  processedAtEnd?: string;
}

/**
 * 授权失效 Outbox 分页行
 */
export interface AuthorizationInvalidationOutboxPageRow extends BaseResponsePageRow {
  eventId?: string;
  changeKind?: string;
  status?: string;
  retryCount?: number | null;
  maxRetry?: number | null;
  nextRetryAt?: string | null;
  lastError?: string | null;
  lockedBy?: string | null;
  lockedAt?: string | null;
  processedAt?: string | null;
  sourceModule?: string | null;
  sourceBizId?: string | null;
}

/**
 * 分页查询授权失效 Outbox
 * @param params 分页查询参数
 * @returns 分页结果
 */
export function getAuthorizationInvalidationOutboxPage(
  params: AuthorizationInvalidationOutboxPageQuery
): Promise<PageResponse<AuthorizationInvalidationOutboxPageRow>> {
  return http.get<PageResponse<AuthorizationInvalidationOutboxPageRow>, AxiosRequestConfig>(
    '/system/ops/authorization-invalidation/outbox/page',
    { params }
  );
}

/**
 * 授权失效 Outbox 详情
 */
export interface AuthorizationInvalidationOutboxDetailRow extends AuthorizationInvalidationOutboxPageRow {
  payload?: string | null;
  remark?: string | null;
}

/**
 * 授权失效 Outbox 详情
 * @param id 主键
 * @returns 详情
 */
export function getAuthorizationInvalidationOutboxDetail(
  id: string
): Promise<AuthorizationInvalidationOutboxDetailRow> {
  return http.get<AuthorizationInvalidationOutboxDetailRow, AxiosRequestConfig>(
    `/system/ops/authorization-invalidation/outbox/${id}`
  );
}

/**
 * Outbox 人工重试请求体
 */
export interface AuthorizationInvalidationOutboxRetryRequest {
  /** 重试原因（写入操作日志） */
  reason?: string;
  /** PROCESSING 时强制解锁 */
  force?: boolean;
}

/**
 * Outbox 人工重试结果
 */
export interface AuthorizationInvalidationOutboxRetryResult {
  outboxId?: number;
  eventId?: string;
  previousStatus?: string;
  currentStatus?: string;
  dispatched?: boolean;
  claimReleased?: boolean;
  lastError?: string | null;
}

/**
 * 人工重试授权失效 Outbox 投递
 * @param id Outbox 主键
 * @param body 重试参数
 * @returns 重试结果
 */
export function retryAuthorizationInvalidationOutbox(
  id: string,
  body?: AuthorizationInvalidationOutboxRetryRequest
): Promise<AuthorizationInvalidationOutboxRetryResult> {
  return http.post<AuthorizationInvalidationOutboxRetryResult, AuthorizationInvalidationOutboxRetryRequest>(
    `/system/ops/authorization-invalidation/outbox/${id}/retry`,
    { data: body }
  );
}
