/**
 * 统一 API 结果信封，含 auth 模块错误响应 ext 中的 i18n 元数据。
 *
 * 业务成功码单一来源：{@link API_SUCCESS_CODE}（定义于 `@/auth/config/http-config`）。
 */
export { API_SUCCESS_CODE } from '@/auth/config/http-config';

interface ResultExt {
  i18nKey?: string;
  i18nArgs?: unknown[];
  [key: string]: unknown;
}

/**
 * 接口结果
 */
export interface ApiResult<T = unknown> {
  code: number;
  message?: string;
  error?: string;
  subCode?: string;
  data?: T;
  ext?: ResultExt;
  timestamp?: number;
}

/**
 * 判断响应体是否为统一 API 结果信封
 * @param value 待检测值
 * @returns 是否为 {@link ApiResult}
 */
export function isApiResultEnvelope(value: unknown): value is ApiResult {
  return (
    typeof value === 'object' && value !== null && 'code' in value && typeof (value as ApiResult).code === 'number'
  );
}
