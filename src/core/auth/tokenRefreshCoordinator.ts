import type { AuthHttpRequestConfig } from '@/core/http/types';
import { formatToken, getToken } from '@/core/session/token/sessionToken';
import type { AxiosInstance } from 'axios';
import { refreshAccessToken } from './refreshAccessToken';

let refreshInFlight: Promise<string> | null = null;

/**
 * 单飞刷新 accessToken：并发场景仅触发一次 refreshAccessToken 请求。
 */
export function refreshAccessTokenSingleFlight(): Promise<string> {
  refreshInFlight ??= doRefreshAccessToken().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/**
 * 刷新后为原请求补齐 Authorization 并重放。
 * @param instance 实例
 * @param config 配置
 * @returns 结果
 */
export async function replayRequestWithRefreshedToken(
  instance: AxiosInstance,
  config: AuthHttpRequestConfig
): Promise<unknown> {
  // 刷新 accessToken
  const accessToken = await refreshAccessTokenSingleFlight();
  // 补齐 Authorization
  if (!config.headers) {
    config.headers = {};
  }
  config.headers['Authorization'] = formatToken(accessToken);
  // 重放请求
  return instance.request(config);
}

/**
 * 刷新 accessToken
 * @returns accessToken
 */
async function doRefreshAccessToken(): Promise<string> {
  await refreshAccessToken();
  // 获取 accessToken
  const nextToken = getToken();
  // 如果 accessToken 为空，则抛出错误
  if (!nextToken?.accessToken) {
    throw new Error('Access token is missing after refresh.');
  }
  // 返回 accessToken
  return nextToken.accessToken;
}
