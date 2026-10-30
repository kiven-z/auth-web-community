import { applyHydratedUiPreferences } from '@/core/preferences/runtime/apply';
import { hydrateUserDisplayProfileOnSession } from '@/core/session/profile/display-profile';
import { ensureAccessTokenReady, resetAccessTokenReady } from '@/core/session/token/access-token-ready';
import { hasAccessToken } from '@/core/session/token/session-token';

/** 会话副作用单飞，登出前保持同一 Promise */
let sideEffectsPromise: Promise<void> | null = null;

/**
 * Token 已就绪后灌入展示资料，并应用界面偏好
 * @returns 资料灌入完成的 Promise
 */
export function hydrateAuthenticatedSessionSideEffects(): Promise<void> {
  if (!hasAccessToken()) {
    return Promise.resolve();
  }
  sideEffectsPromise ??= (async () => {
    await hydrateUserDisplayProfileOnSession().catch(() => undefined);
    applyHydratedUiPreferences();
  })();
  return sideEffectsPromise;
}

/**
 * 已登录场景的会话就绪：恢复 accessToken 并完成资料与界面偏好
 * 供路由守卫使用；HTTP 层仅调用 {@link ensureAccessTokenReady}
 * @returns 是否已具备可用 accessToken
 */
export async function ensureAuthenticatedSession(): Promise<boolean> {
  const ready = await ensureAccessTokenReady();
  if (!ready) {
    return false;
  }
  await hydrateAuthenticatedSessionSideEffects();
  return true;
}

/**
 * 重置会话 bootstrap 状态
 */
export function resetSessionBootstrap(): void {
  resetAccessTokenReady();
  sideEffectsPromise = null;
}
