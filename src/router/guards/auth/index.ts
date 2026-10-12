import { isLoggedIn } from '@/core/session/session-auth';
import { ensureAuthenticatedSession } from '@/core/session/session-bootstrap';
import { removeToken } from '@/core/session/token/session-token';
import { isUrl, openLink } from '@/shared/utils/url/url';
import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';

import { blockByAccessIfNeeded } from './access';
import { resolveColdStartNavigation } from './cold-start';
import { passAuthenticated, passGuest } from './guest';

/** 登录态与权限守卫：登录、会话、角色/权限码、冷启动动态路由 */
export function createAuthGuard(router: Router): void {
  router.beforeEach(async (to, from) => {
    if (!isLoggedIn()) {
      return passGuest(to);
    }

    const loginTarget = await blockUnreadySessionIfNeeded(to);
    if (loginTarget) {
      return loginTarget;
    }
    const denied = blockByAccessIfNeeded(to);
    if (denied) {
      return denied;
    }
    const hiddenHome = blockHiddenHomeIfNeeded(to);
    if (hiddenHome) {
      return hiddenHome;
    }
    const named = resolveNamedFromNavigation(to, from);
    if (named !== undefined) {
      return named;
    }
    const coldStart = await resolveColdStartNavigation(to);
    if (coldStart !== undefined) {
      return coldStart;
    }

    return passAuthenticated(to, from);
  });
}

/** 会话未就绪时清 token 去登录；未拦截时返回 undefined */
async function blockUnreadySessionIfNeeded(to: RouteLocationNormalized): Promise<RouteLocationRaw | undefined> {
  if (to.path === '/login') {
    return undefined;
  }

  const ready = await ensureAuthenticatedSession();
  if (ready) {
    return undefined;
  }

  removeToken();
  return { path: '/login' };
}

/** VITE_HIDE_HOME 开启时拦截 /welcome；未拦截时返回 undefined */
function blockHiddenHomeIfNeeded(to: RouteLocationNormalized): RouteLocationRaw | undefined {
  if (import.meta.env.VITE_HIDE_HOME !== 'true' || to.fullPath !== '/welcome') {
    return undefined;
  }
  return { path: '/error/404' };
}

/** 应用内跳转（from 已有 name）：外链新开并取消本次导航，否则按已登录规则放行 */
function resolveNamedFromNavigation(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): RouteLocationRaw | false | undefined {
  if (!from?.name) {
    return undefined;
  }

  if (isUrl(to?.name as string)) {
    openLink(to.name as string);
    return false;
  }

  return passAuthenticated(to, from);
}
