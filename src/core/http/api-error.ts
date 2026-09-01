import { transformI18n } from '@/app/plugins/i18n';
import { PERMISSION_VERSION_MISMATCH_CODES } from '@/core/auth/error-codes';
import Axios from 'axios';
import { resolveApiErrorMessage } from './resolve-api-error-message';
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
    super(resolveApiErrorMessage(result));
    this.name = 'ApiBusinessError';
    this.businessCode = result.code;
    this.httpStatus = httpStatus;
    this.result = result;
  }

  /** 稳定错误标识 */
  get errorCode(): string | undefined {
    return this.result.error;
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
 * 无业务信封的传输层失败（断网、代理裸 5xx、后端未启动等）。
 */
export class ApiTransportError extends Error {
  readonly httpStatus?: number;

  constructor(httpStatus?: number, cause?: unknown) {
    super(transformI18n('tips.requestFailed'), { cause });
    this.name = 'ApiTransportError';
    this.httpStatus = httpStatus;
  }
}

/**
 * 鉴权恢复决定登出后的会话结束（页面不应再弹业务失败 toast）。
 */
export class SessionEndedError extends Error {
  constructor() {
    super('Session ended');
    this.name = 'SessionEndedError';
  }
}

/**
 * 是否应跳过 errorMessage 等用户反馈（会话结束、请求取消）。
 */
export function shouldSkipErrorFeedback(error: unknown): boolean {
  if (error instanceof SessionEndedError) {
    return true;
  }
  if (typeof error === 'object' && error !== null && (error as { isCancelRequest?: boolean }).isCancelRequest) {
    return true;
  }
  return Axios.isCancel(error);
}
/**
 * 根据后端 {@link ApiResult} 构造业务错误并 reject；
 * 仅在权限版本冲突时抛出 {@link ApiConflictError}。
 */
export function rejectWithApiEnvelopeError(raw: ApiResult, httpStatus?: number): Promise<never> {
  const errorCode = raw.error;

  // 是否为权限版本冲突
  const err =
    httpStatus === 409 && PERMISSION_VERSION_MISMATCH_CODES.includes(errorCode ?? '')
      ? new ApiConflictError(raw, httpStatus)
      : new ApiBusinessError(raw, httpStatus);

  return Promise.reject(err);
}
