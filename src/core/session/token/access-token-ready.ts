import { refreshAccessTokenSingleFlight } from '@/core/auth/access-token-refresh';
import { isLoggedIn } from '@/core/session/session-auth';
import { hasAccessToken } from '@/core/session/token/session-token';

/** 冷启动 / 并发请求共用的 accessToken 恢复单飞 */
let accessTokenReadyPromise: Promise<boolean> | null = null;

/**
 * 确保内存中已有 accessToken（生产刷新后须先 refresh）。
 * 未登录或刷新失败返回 false；与 HTTP 拦截器、会话 bootstrap 共用，避免循环依赖。
 * @returns 是否已就绪
 */
export async function ensureAccessTokenReady(): Promise<boolean> {
  if (hasAccessToken()) {
    return true;
  }
  if (!isLoggedIn()) {
    return false;
  }

  accessTokenReadyPromise ??= (async () => {
    try {
      await refreshAccessTokenSingleFlight();
      return hasAccessToken();
    } catch {
      return false;
    } finally {
      accessTokenReadyPromise = null;
    }
  })();

  return accessTokenReadyPromise;
}

/**
 * 重置 accessToken 恢复单飞（登出时调用）。
 */
export function resetAccessTokenReady(): void {
  accessTokenReadyPromise = null;
}
