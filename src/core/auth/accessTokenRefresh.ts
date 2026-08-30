import { refreshTokenApi } from '@/api/auth/login';
import type { AuthHttpRequestConfig } from '@/core/http/types';
import { applyRememberPreferencesFromResponse } from '@/core/session/remember/rememberPreferences';
import { readSessionPreferences } from '@/core/session/remember/sessionPreferences';
import { formatToken, getToken, setToken } from '@/core/session/token/sessionToken';
import type { AxiosInstance } from 'axios';

let refreshInFlight: Promise<string> | null = null;

/**
 * 调用刷新接口、写入会话，返回新的 accessToken。
 */
async function refreshSessionAccessToken(): Promise<string> {
  const body = await refreshTokenApi();

  const { isRemembered } = readSessionPreferences();
  if (body.readMeDay !== undefined) {
    applyRememberPreferencesFromResponse(isRemembered, body.readMeDay);
  }

  setToken({
    accessToken: body.accessToken,
    expires: body.expires,
    username: body.username,
    userId: body.id,
    roles: body.roles,
    permissions: body.permissions,
  });

  const nextToken = getToken();
  if (!nextToken?.accessToken) {
    throw new Error('Access token is missing after refresh.');
  }
  return nextToken.accessToken;
}

/**
 * 单飞刷新 accessToken：并发仅触发一次刷新请求。
 */
export function refreshAccessTokenSingleFlight(): Promise<string> {
  refreshInFlight ??= refreshSessionAccessToken().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/**
 * 刷新后为原请求补齐 Authorization 并重放。
 */
export async function replayRequestWithRefreshedToken(
  instance: AxiosInstance,
  config: AuthHttpRequestConfig
): Promise<unknown> {
  const accessToken = await refreshAccessTokenSingleFlight();
  if (!config.headers) {
    config.headers = {};
  }
  config.headers['Authorization'] = formatToken(accessToken);
  return instance.request(config);
}
