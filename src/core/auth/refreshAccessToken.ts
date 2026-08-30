import { AUTH_API_PATHS } from '@/api/auth/paths';
import type { RefreshTokenResponse } from '@/api/auth/models/auth';
import { API_SUCCESS_CODE } from '@/auth/config/http-config';
import { ApiBusinessError } from '@/core/http/apiError';
import { isApiResultEnvelope } from '@/core/http/apiResult';
import { createHttpAxiosInstance } from '@/core/http/axiosDefaults';
import { applyRememberPreferencesFromResponse } from '@/core/session/remember/rememberPreferences';
import { readSessionPreferences } from '@/core/session/remember/sessionPreferences';
import { setToken } from '@/core/session/token/sessionToken';
import type { AxiosInstance } from 'axios';

// 刷新专用客户端（无鉴权/恢复拦截器），避免 refresh 走 http 封装形成模块环依赖
let refreshAxiosClient: AxiosInstance | null = null;

/**
 * 获取刷新专用 Axios 实例（懒加载单例）。
 */
function getRefreshAxiosClient(): AxiosInstance {
  if (!refreshAxiosClient) {
    refreshAxiosClient = createHttpAxiosInstance();
  }
  return refreshAxiosClient;
}

/**
 * 调用 refresh-token 接口并写入会话（含授权快照）。
 * 不经 {@link http} 拦截器，供 {@link refreshAccessTokenSingleFlight} 与鉴权恢复链路使用。
 * @returns 刷新后的令牌载荷
 */
export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const response = await getRefreshAxiosClient().post(AUTH_API_PATHS.REFRESH_TOKEN);
  const raw = response.data;

  if (!isApiResultEnvelope(raw)) {
    throw new Error('Refresh token response is not a valid API envelope.');
  }
  if (raw.code !== API_SUCCESS_CODE) {
    throw new ApiBusinessError(raw, response.status);
  }

  const body = raw.data as RefreshTokenResponse;
  if (!body?.accessToken || !body.username || !body.id || !body.roles || !body.permissions) {
    throw new Error('Refresh token response is missing required session fields.');
  }

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
  return body;
}
