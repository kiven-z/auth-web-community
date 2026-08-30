import type { RouteConfigs } from '@/layout/types';
import { describe, expect, it } from 'vitest';
import {
  applyCloseScope,
  pickNavigateTag,
  shouldNavigateAfterClose,
} from '@/layout/components/lay-tag/utils/closeTags';

const home: RouteConfigs = { path: '/home', name: 'Home', meta: { title: 'Home' } };
const user: RouteConfigs = { path: '/user', name: 'User', meta: { title: 'User' } };
const role: RouteConfigs = { path: '/role', name: 'Role', meta: { title: 'Role' } };
const dept: RouteConfigs = { path: '/dept', name: 'Dept', meta: { title: 'Dept' } };
const tags = [home, user, role, dept];

describe('applyCloseScope', () => {
  it('removes current tag', () => {
    expect(applyCloseScope(tags, 2, 'current', 1, role, home, true)).toEqual([home, user, dept]);
  });

  it('removes left dynamic tags keeping fixed prefix', () => {
    expect(applyCloseScope(tags, 3, 'left', 1, dept, home, true)).toEqual([home, dept]);
  });

  it('removes right tags', () => {
    expect(applyCloseScope(tags, 1, 'right', 1, user, home, true)).toEqual([home, user]);
  });

  it('keeps fixed tags and target for other', () => {
    expect(applyCloseScope(tags, 2, 'other', 1, role, home, true)).toEqual([home, role]);
  });

  it('keeps top menu and target when home fixed tags disabled', () => {
    expect(applyCloseScope(tags, 2, 'other', 0, role, home, false)).toEqual([home, role]);
  });

  it('removes all dynamic tags for all', () => {
    expect(applyCloseScope(tags, 2, 'all', 1, role, home, true)).toEqual([home]);
  });
});

describe('shouldNavigateAfterClose', () => {
  it('navigates when closing active tab except left scope', () => {
    expect(shouldNavigateAfterClose('/user', '/user', 'current', [home])).toBe(true);
    expect(shouldNavigateAfterClose('/user', '/user', 'left', [home, user])).toBe(false);
  });

  it('skips navigation when current route still exists', () => {
    expect(shouldNavigateAfterClose('/role', '/user', 'right', [home, user])).toBe(false);
  });

  it('navigates when current route no longer exists', () => {
    expect(shouldNavigateAfterClose('/role', '/role', 'current', [home, user])).toBe(true);
  });

  it('skips navigation when no tags remain', () => {
    expect(shouldNavigateAfterClose('/user', '/dept', 'all', [])).toBe(false);
  });
});

describe('pickNavigateTag', () => {
  it('returns last tag', () => {
    expect(pickNavigateTag([home, user])).toEqual(user);
  });
});
