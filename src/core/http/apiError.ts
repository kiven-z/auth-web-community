import { PERMISSION_VERSION_MISMATCH_CODES } from '@/core/auth/errorCodes';
import type { ApiResult } from './types';

/**
 * 信封业务码非 0 或 HTTP 层失败时的可抛出错误，便于页面展示 message / ext。
 */
export class ApiBusinessError extends Error {
  /** 业务码 */
  readonly businessCode: number;
  readonly httpStatus?: number;
  readonly result: ApiResult;

  constructor(result: ApiResult, httpStatus?: number) {
    super(result.message ?? 'Request failed');
    this.name = 'ApiBusinessError';
    this.businessCode = result.code;
    this.httpStatus = httpStatus;
    this.result = result;
  }
}

/**
 * 权限版本等冲突（对应 HTTP 409），页面用 instanceof 区分处理。
 */
export class ApiConflictError extends ApiBusinessError {
  constructor(result: ApiResult, httpStatus?: number) {
    super(result, httpStatus);
    this.name = 'ApiConflictError';
  }
}

/**
 * 是否为权限版本冲突（HTTP 409 + 稳定错误码）。
 */
function isPermissionVersionMismatchError(status: number | undefined, errorCode: string | undefined): boolean {
  return status === 409 && PERMISSION_VERSION_MISMATCH_CODES.includes(errorCode ?? '');
}

/**
 * 根据后端 {@link ApiResult} 构造业务错误并 reject；
 * 仅在权限版本冲突时抛出 {@link ApiConflictError}。
 */
export function rejectWithApiEnvelopeError(raw: ApiResult, httpStatus?: number): Promise<never> {
  const errorCode = raw.error ?? raw.subCode;
  const err = isPermissionVersionMismatchError(httpStatus, errorCode)
    ? new ApiConflictError(raw, httpStatus)
    : new ApiBusinessError(raw, httpStatus);
  return Promise.reject(err);
}
