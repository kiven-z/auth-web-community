import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 操作日志分页查询参数
 */
export interface OperationLogPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 操作用户 ID */
  userId?: string;
  /** 操作类型 */
  operationType?: string;
  /** 操作模块 */
  module?: string;
  /** 操作对象类型 */
  targetType?: string;
  /** 目标 ID */
  targetId?: string;
  /** HTTP 方法 */
  requestMethod?: string;
}

/**
 * 操作日志分页行
 */
export interface OperationLogPageRow extends BaseResponsePageRow {
  /** 操作用户 ID；null 表示匿名或未认证 */
  userId?: string | null;
  /** 操作用户名（由 userId 解析） */
  username?: string | null;
  /** 操作模块 */
  module?: string | null;
  /** 操作类型 */
  operationType?: string | null;
  /** 目标类型 */
  targetType?: string | null;
  /** 目标主键 ID */
  targetId?: string;
  /** HTTP 方法 */
  requestMethod?: string | null;
  /** HTTP 状态码 */
  responseStatus?: number | null;
  /** 执行耗时（毫秒） */
  executionTimeMs?: number | null;
  /** 请求 IP（JSON 序列化时脱敏） */
  ipAddress?: string | null;
}

/**
 * 分页查询操作日志
 * @param params 分页查询参数
 * @returns 操作日志分页行
 */
export function getOperationLogPage(params: OperationLogPageQuery) {
  return http.get<PageResponse<OperationLogPageRow>, AxiosRequestConfig<OperationLogPageQuery>>(
    '/system/log/operation/page',
    { params }
  );
}

/**
 * 操作日志详情
 */
export interface OperationLogDetailRow extends BaseResponsePageRow {
  userId?: string;
  username?: string | null;
  module?: string | null;
  operationType?: string | null;
  targetType?: string | null;
  targetId?: string;
  requestMethod?: string | null;
  requestUri?: string | null;
  requestParams?: string | null;
  responseStatus?: number | null;
  responseMessage?: string | null;
  executionTimeMs?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  remark?: string | null;
}

/**
 * 操作日志详情
 * @param id 操作日志 ID
 * @returns 操作日志详情
 */
export function getOperationLogDetail(id: string) {
  return http.get<OperationLogDetailRow, AxiosRequestConfig>(`/system/log/operation/${id}`);
}

/**
 * 批量删除操作日志
 * @param ids 操作日志 ID 数组
 * @returns 删除结果
 */
export function deleteOperationLog(ids: string[]) {
  return http.request<string>('delete', '/system/log/operation', { data: ids });
}
