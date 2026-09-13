/**
 * HTTP 客户端静态配置。
 * 约定：HTTP 2xx 且统一信封 code === API_SUCCESS_CODE 表示业务成功。
 */
export const API_SUCCESS_CODE = 0;

/**
 * Axios 实例 baseURL
 */
export const HTTP_BASE_URL = '/api';

/**
 * 请求超时毫秒
 */
export const HTTP_TIMEOUT = 30_000;
