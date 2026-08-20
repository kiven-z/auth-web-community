import { isPermissionVersionMismatchError } from '@/auth/config/http-config';
import { ApiBusinessError, ApiConflictError } from './apiError';
import type { ApiResult } from './apiResult';

/**
 * 根据后端 {@link ApiResult} 构造业务错误；
 * 仅在 HTTP 409 且稳定错误码命中权限版本冲突时，触发权限冲突统一处理。
 * @param raw 响应
 * @param httpStatus 响应状态
 * @returns 结果
 */
export function rejectWithApiEnvelopeError(raw: ApiResult, httpStatus?: number): Promise<never> {
  // 获取错误码
  const errorCode = raw.error ?? raw.subCode;
  // 获取是否权限版本冲突
  const isConflict = isPermissionVersionMismatchError(httpStatus, errorCode);
  // 创建错误
  const err = isConflict ? new ApiConflictError(raw, httpStatus) : new ApiBusinessError(raw, httpStatus);
  // 拒绝
  return Promise.reject(err);
}
