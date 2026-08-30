import type { ApiResult } from './apiResult';

/**
 * 信封业务码非 0 或 HTTP 层失败时的可抛出错误，便于页面展示 message / ext。
 * @param result 响应
 * @param httpStatus 响应状态
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
 * 冲突错误
 * 权限版本等冲突，对应 HTTP 409
 */
export class ApiConflictError extends ApiBusinessError {
  /** 是否为权限版本冲突 */
  readonly isPermissionConflict = true;
}
