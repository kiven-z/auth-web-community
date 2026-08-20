import { AUTH_PUBLIC_API_PATH_SUFFIXES } from '@/api/auth/paths';
import { PERMISSION_VERSION_MISMATCH_CODES } from '@/auth/config/auth/auth-error-codes';

/**
 * 约定：HTTP 2xx 且统一信封 code === API_SUCCESS_CODE 表示业务成功。
 */
export const API_SUCCESS_CODE = 0;

/**
 * Axios 实例 baseURL，与 Vite `server.proxy['/api']` 一致
 */
export const HTTP_BASE_URL = '/api';

export const ASYNC_ROUTES_STORAGE_KEY = 'async-routes';

/**
 * 请求超时（毫秒）
 */
export const HTTP_TIMEOUT = 30_000;

/**
 * 规范化拦截器中的 url（去掉 query、前导斜杠）。
 */
export function normalizeRequestPath(url: string | undefined): string {
  if (!url) return '';
  return url.split('?')[0].replace(/^\/+/, '');
}

/**
 * 是否命中免鉴权接口（不附加 Bearer、不参与 access 过期刷新队列）。
 */
export function isNoAuthRequestPath(requestUrl: string | undefined): boolean {
  const path = normalizeRequestPath(requestUrl);
  return AUTH_PUBLIC_API_PATH_SUFFIXES.some((suffix) => path === suffix || path.endsWith(`/${suffix}`));
}

/**
 * 权限版本不一致（HTTP 409 + 稳定错误码）的精确判定。
 */
export function isPermissionVersionMismatchError(status: number | undefined, errorCode: string | undefined): boolean {
  return status === 409 && PERMISSION_VERSION_MISMATCH_CODES.includes(errorCode ?? '');
}
