import { isLoggedIn } from '@/core/session/session-auth';
import { ensureAuthenticatedSession } from '@/core/session/session-bootstrap';
import { removeToken } from '@/core/session/token/session-token';
import { isUrl, openLink } from '@/shared/utils/url/url';
import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';

import { blockByAccessIfNeeded } from './access';
import { resolveColdStartNavigation } from './cold-start';
import { passAuthenticated, passGuest } from './guest';

/** 登录态与权限守卫：登录、会话、角色/权限码、冷启动动态路由 */
export function createAuthGuard(router: Router): void {
  router.beforeEach(async (to, from, next) => {
    if (!isLoggedIn()) {
      passGuest(to, next);
      return;
    }

    if (await blockUnreadySessionIfNeeded(to, next)) {
      return;
    }
    if (blockByAccessIfNeeded(to, next)) {
      return;
    }
    if (blockHiddenHomeIfNeeded(to, next)) {
      return;
    }
    if (resolveNamedFromNavigation(to, from, next)) {
      return;
    }
    if (await resolveColdStartNavigation(to, next)) {
      return;
    }

    passAuthenticated(to, from, next);
  });
}

/** 会话未就绪时清 token 去登录；返回是否已处理导航 */
async function blockUnreadySessionIfNeeded(to: RouteLocationNormalized, next: NavigationGuardNext): Promise<boolean> {
  if (to.path === '/login') {
    return false;
  }

  const ready = await ensureAuthenticatedSession();
  if (ready) {
    return false;
  }

  removeToken();
  next({ path: '/login' });
  return true;
}

/** VITE_HIDE_HOME 开启时拦截 /welcome；返回是否已处理导航 */
function blockHiddenHomeIfNeeded(to: RouteLocationNormalized, next: NavigationGuardNext): boolean {
  if (import.meta.env.VITE_HIDE_HOME !== 'true' || to.fullPath !== '/welcome') {
    return false;
  }
  next({ path: '/error/404' });
  return true;
}

/** 应用内跳转（from 已有 name）：外链新开，否则按已登录规则放行；返回是否已处理导航 */
function resolveNamedFromNavigation(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): boolean {
  if (!from?.name) {
    return false;
  }

  if (isUrl(to?.name as string)) {
    openLink(to.name as string);
    return true;
  }

  passAuthenticated(to, from, next);
  return true;
}
