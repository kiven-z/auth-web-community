import { isLoggedIn } from '@/core/session/session-auth';
import { ensureAccessTokenReady } from '@/core/session/token/access-token-ready';
import { formatToken, getToken, hasAccessToken } from '@/core/session/token/session-token';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { AuthHttpRequestConfig } from '../types';

/**
 * 请求拦截：注入 Authorization；已登录但内存无 token 时先单飞恢复再发送。
 */
export function attachRequestAuthInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      if ((config as AuthHttpRequestConfig).skipAuth) {
        return config;
      }
      if (isLoggedIn() && !hasAccessToken()) {
        await ensureAccessTokenReady();
      }

      const tokenPayload = getToken();
      if (!tokenPayload?.accessToken) {
        return config;
      }
      if (!config.headers) {
        config.headers = {} as InternalAxiosRequestConfig['headers'];
      }
      config.headers['Authorization'] = formatToken(tokenPayload.accessToken);
      return config;
    },
    (error) => {
      throw error;
    }
  );
}
