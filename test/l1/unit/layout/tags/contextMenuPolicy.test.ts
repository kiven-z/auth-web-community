import type { RouteConfigs } from '@/router/types';
import { describe, expect, it } from 'vitest';
import { TagMenuAction } from '@/layout/chrome/tags/constants/tagMenu';
import { computeMenuState, resolveContextMenuState } from '@/layout/chrome/tags/utils/contextMenuPolicy';

const home: RouteConfigs = { path: '/home', name: 'Home', meta: { title: 'Home' } };
const user: RouteConfigs = { path: '/user', name: 'User', meta: { title: 'User' } };
const role: RouteConfigs = { path: '/role', name: 'Role', meta: { title: 'Role' } };
const dept: RouteConfigs = { path: '/dept', name: 'Dept', meta: { title: 'Dept' } };
const fixed: RouteConfigs = {
  path: '/fixed',
  name: 'Fixed',
  meta: { title: 'Fixed', fixedTag: true } as RouteConfigs['meta'],
};

const on = { show: true, disabled: false };
const off = { show: true, disabled: true };

function closeState(state: ReturnType<typeof computeMenuState>) {
  return {
    close: state[TagMenuAction.Close],
    closeLeft: state[TagMenuAction.CloseLeft],
    closeRight: state[TagMenuAction.CloseRight],
    closeOther: state[TagMenuAction.CloseOther],
    closeAll: state[TagMenuAction.CloseAll],
    reload: state[TagMenuAction.Reload],
  };
}

function asRoute(tag: RouteConfigs) {
  return { path: tag.path, name: tag.name } as never;
}

describe('computeMenuState', () => {
  it.each([
    {
      name: 'home disables all close',
      tags: [home, user, role],
      path: '/home',
      topPath: '/home',
      want: { close: off, closeLeft: off, closeRight: off, closeOther: off, closeAll: off, reload: on },
    },
    {
      name: 'missing tag is treated as home',
      tags: [home, user],
      path: '/missing',
      topPath: '/home',
      want: { close: off, closeLeft: off, closeRight: off, closeOther: off, closeAll: off },
    },
    {
      name: 'redirect of top path is treated as home',
      tags: [home, user, role],
      path: '/redirect/home',
      topPath: '/home',
      want: { close: off, closeLeft: off, closeRight: off, closeOther: off, closeAll: off },
    },
    {
      name: 'second of many cannot close left',
      tags: [home, user, role],
      path: '/user',
      topPath: '/home',
      want: { close: on, closeLeft: off, closeRight: on, closeOther: on, closeAll: on },
    },
    {
      name: 'two tabs: only close and closeAll',
      tags: [home, user],
      path: '/user',
      topPath: '/home',
      want: { close: on, closeLeft: off, closeRight: off, closeOther: off, closeAll: on },
    },
    {
      name: 'last cannot close right',
      tags: [home, user, role],
      path: '/role',
      topPath: '/home',
      want: { close: on, closeLeft: on, closeRight: off, closeOther: on, closeAll: on },
    },
    {
      name: 'last with previous fixed cannot close left',
      tags: [home, fixed, role],
      path: '/role',
      topPath: '/home',
      want: { closeLeft: off, closeRight: off, close: on, closeOther: off, closeAll: on },
    },
    {
      name: 'middle enables all close',
      tags: [home, user, role, dept],
      path: '/role',
      topPath: '/home',
      want: { close: on, closeLeft: on, closeRight: on, closeOther: on, closeAll: on },
    },
    {
      name: 'middle with previous fixed cannot close left',
      tags: [home, fixed, role, dept],
      path: '/role',
      topPath: '/home',
      want: { closeLeft: off, closeRight: on, closeOther: on, close: on },
    },
    {
      name: 'fixed tag disables all close',
      tags: [fixed, user],
      path: '/fixed',
      topPath: '/fixed',
      want: { close: off, closeLeft: off, closeRight: off, closeOther: off, closeAll: off },
    },
    {
      name: 'matches by query among same path',
      tags: [home, { ...user, query: { id: '1' } }, { ...user, query: { id: '2' } }],
      path: '/user',
      query: { id: '2' },
      topPath: '/home',
      want: { close: on, closeLeft: on, closeRight: off, closeOther: on, closeAll: on },
    },
    {
      name: 'matches by params among same path',
      tags: [home, { ...user, params: { id: '1' } }, { ...user, params: { id: '2' } }],
      path: '/user',
      params: { id: '2' },
      topPath: '/home',
      want: { close: on, closeLeft: on, closeRight: off, closeOther: on, closeAll: on },
    },
  ])('$name', ({ tags, path, topPath, query, params, want }) => {
    expect(closeState(computeMenuState({ tags, currentPath: path, topPath, query, params }))).toMatchObject(want);
  });
});

describe('resolveContextMenuState', () => {
  it.each([
    {
      name: 'home shows only reload',
      tag: home,
      route: home,
      tags: [home, user, role],
      topPath: '/home',
      want: {
        reloadShow: true,
        closeShow: false,
        closeLeftShow: false,
        closeRightShow: false,
        closeOtherShow: false,
      },
    },
    {
      name: 'inactive tag hides reload',
      tag: user,
      route: role,
      tags: [home, user, role],
      topPath: '/home',
      want: { reloadShow: false, closeShow: true },
    },
    {
      name: 'active tag shows reload',
      tag: user,
      route: user,
      tags: [home, user, role],
      topPath: '/home',
      want: { reloadShow: true, closeShow: true, closeLeftShow: false, closeRightShow: true },
    },
    {
      name: 'fixed tag hides close',
      tag: fixed,
      route: fixed,
      tags: [fixed, user],
      topPath: '/fixed',
      want: { reloadShow: true, closeShow: false, closeLeftShow: false },
    },
    {
      name: 'two tabs hides unavailable close directions',
      tag: user,
      route: user,
      tags: [home, user],
      topPath: '/home',
      want: {
        reloadShow: true,
        closeShow: true,
        closeLeftShow: false,
        closeRightShow: false,
        closeOtherShow: false,
      },
    },
  ])('$name', ({ tag, route, tags, topPath, want }) => {
    const state = resolveContextMenuState({ tag, route: asRoute(route), tags, topPath });
    expect(state[TagMenuAction.Reload].show).toBe(want.reloadShow);
    if (want.closeShow !== undefined) {
      expect(state[TagMenuAction.Close].show).toBe(want.closeShow);
    }
    if (want.closeLeftShow !== undefined) {
      expect(state[TagMenuAction.CloseLeft].show).toBe(want.closeLeftShow);
    }
    if (want.closeRightShow !== undefined) {
      expect(state[TagMenuAction.CloseRight].show).toBe(want.closeRightShow);
    }
    if (want.closeOtherShow !== undefined) {
      expect(state[TagMenuAction.CloseOther].show).toBe(want.closeOtherShow);
    }
  });
});
