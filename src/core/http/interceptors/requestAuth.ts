import { isNoAuthRequestPath } from '@/auth/config/http-config';
import { ensureAccessTokenReady } from '@/core/session/token/accessTokenReady';
import { isLoggedIn } from '@/core/session/sessionAuth';
import { formatToken, getToken, hasAccessToken } from '@/core/session/token/sessionToken';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * 请求拦截：注入 Authorization；已登录但内存无 token 时先单飞恢复再发送。
 */
export function attachRequestAuthInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      if (isNoAuthRequestPath(config.url)) {
        return config;
      }
      if (isLoggedIn() && !hasAccessToken()) {
        await ensureAccessTokenReady();
      }
      return applyAuthHeader(config);
    },
    (error) => {
      throw error;
    }
  );
}

/**
 * 应用 Authorization
 * @param config 配置
 * @returns 配置
 */
function applyAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const tokenPayload = getToken();
  if (!tokenPayload?.accessToken) {
    return config;
  }
  if (!config.headers) {
    config.headers = {} as InternalAxiosRequestConfig['headers'];
  }
  config.headers['Authorization'] = formatToken(tokenPayload.accessToken);
  return config;
}
