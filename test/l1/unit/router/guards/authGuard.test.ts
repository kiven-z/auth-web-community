import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';

import { blockByAccessIfNeeded, isBlockedByAuths, isBlockedByRoles } from '@/router/guards/auth/access';
import { resolveColdStartNavigation } from '@/router/guards/auth/coldStart';
import { passAuthenticated, passGuest } from '@/router/guards/auth/guest';
import { hasAuth } from '@/auth/permission/hasAuth';
import { isOneOfArray } from '@/auth/permission/isOneOfArray';
import { readUserProfileFromStorage } from '@/core/session/profile/userProfileStorage';
import { removeToken } from '@/core/session/token/sessionToken';
import { initRouter } from '@/router/utils/routeRegistry';
import { usePermissionStore } from '@/store/modules/auth/permission';

vi.mock('@/auth/permission/hasAuth', () => ({
  hasAuth: vi.fn(),
}));

vi.mock('@/auth/permission/isOneOfArray', () => ({
  isOneOfArray: vi.fn(),
}));

vi.mock('@/core/session/profile/userProfileStorage', () => ({
  readUserProfileFromStorage: vi.fn(),
}));

vi.mock('@/core/session/token/sessionToken', () => ({
  removeToken: vi.fn(),
}));

vi.mock('@/router/utils/routeRegistry', () => ({
  initRouter: vi.fn(),
}));

vi.mock('@/router/utils/misc', () => ({
  getTopMenu: vi.fn(),
}));

vi.mock('@/router/utils/routeTree', () => ({
  findRouteByPath: vi.fn(),
}));

vi.mock('@/services/feedback/message', () => ({
  errorMessage: vi.fn(),
}));

vi.mock('@/store/modules/auth/permission', () => ({
  usePermissionStore: vi.fn(),
}));

vi.mock('@/store/modules/preferences/tags/tagsPreferences', () => ({
  useTagsPreferencesStore: vi.fn(() => ({ enabled: true })),
}));

type RouteTestInput = Omit<Partial<RouteLocationNormalized>, 'meta'> & {
  meta?: Partial<RouteLocationNormalized['meta']>;
};

function route(partial: RouteTestInput = {}): RouteLocationNormalized {
  const { meta: partialMeta, ...rest } = partial;
  return {
    path: '/user',
    fullPath: '/user',
    name: 'User',
    meta: { title: 'Test', ...partialMeta },
    ...rest,
  } as RouteLocationNormalized;
}

describe('isBlockedByRoles', () => {
  beforeEach(() => {
    vi.mocked(readUserProfileFromStorage).mockReturnValue({ roles: ['admin'] });
  });

  it('allows publicAccess routes', () => {
    expect(isBlockedByRoles(route({ meta: { publicAccess: true, roles: ['guest'] } }))).toBe(false);
  });

  it('allows when roles meta missing', () => {
    expect(isBlockedByRoles(route({ meta: {} }))).toBe(false);
  });

  it('blocks when user roles do not match', () => {
    vi.mocked(isOneOfArray).mockReturnValue(false);
    expect(isBlockedByRoles(route({ meta: { roles: ['admin'] } }))).toBe(true);
  });
});

describe('isBlockedByAuths', () => {
  it('skips when auths missing or empty', () => {
    expect(isBlockedByAuths(route({ meta: {} }))).toBe(false);
    expect(isBlockedByAuths(route({ meta: { auths: [] } }))).toBe(false);
  });

  it('blocks when hasAuth returns false', () => {
    vi.mocked(hasAuth).mockReturnValue(false);
    expect(isBlockedByAuths(route({ meta: { auths: ['system:user:list'] } }))).toBe(true);
  });
});

describe('blockByAccessIfNeeded', () => {
  it('redirects to 403 when blocked', () => {
    vi.mocked(isOneOfArray).mockReturnValue(false);
    const next = vi.fn();

    expect(blockByAccessIfNeeded(route({ meta: { roles: ['admin'] } }), next)).toBe(true);
    expect(next).toHaveBeenCalledWith({ path: '/error/403' });
  });
});

describe('passGuest', () => {
  it('allows login path', () => {
    const next = vi.fn();
    passGuest(route({ path: '/login' }), next);
    expect(next).toHaveBeenCalledWith();
    expect(removeToken).not.toHaveBeenCalled();
  });

  it('redirects unknown guest to login', () => {
    const next = vi.fn();
    passGuest(route({ path: '/user' }), next);
    expect(removeToken).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({ path: '/login' });
  });
});

describe('passAuthenticated', () => {
  it('bounces white-list target back to previous fullPath', () => {
    const next = vi.fn();
    passAuthenticated(route({ fullPath: '/login' }), route({ fullPath: '/home' }), next);
    expect(next).toHaveBeenCalledWith('/home');
  });

  it('passes through normal route', () => {
    const next = vi.fn();
    passAuthenticated(route({ fullPath: '/user' }), route({ fullPath: '/home' }), next);
    expect(next).toHaveBeenCalledWith();
  });
});

describe('resolveColdStartNavigation', () => {
  beforeEach(() => {
    vi.mocked(usePermissionStore).mockReturnValue({ wholeMenus: [] } as never);
    vi.mocked(initRouter).mockResolvedValue({ options: { routes: [{ children: [] }] } } as never);
  });

  it('skips when menus already loaded', async () => {
    vi.mocked(usePermissionStore).mockReturnValue({ wholeMenus: [{ path: '/home' }] } as never);
    const next = vi.fn();

    expect(await resolveColdStartNavigation(route(), next)).toBe(false);
    expect(next).not.toHaveBeenCalled();
  });

  it('replace-navigates after cold start init', async () => {
    const next = vi.fn();
    const target = route({ fullPath: '/user', query: { id: '1' }, hash: '#tab' });

    expect(await resolveColdStartNavigation(target, next)).toBe(true);
    expect(initRouter).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({
      path: '/user',
      query: { id: '1' },
      hash: '#tab',
      replace: true,
    });
  });
});
