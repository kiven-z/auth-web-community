import type { RouteConfigs } from '@/router/types';
import { describe, expect, it } from 'vitest';
import { TagMenuAction } from '@/layout/chrome/tags/constants/tag-menu';
import { resolveTagMenuItems } from '@/layout/chrome/tags/utils/tag-menu-policy';

const home: RouteConfigs = { path: '/home', name: 'Home', meta: { title: 'Home' } };
const user: RouteConfigs = { path: '/user', name: 'User', meta: { title: 'User' } };
const role: RouteConfigs = { path: '/role', name: 'Role', meta: { title: 'Role' } };
const dept: RouteConfigs = { path: '/dept', name: 'Dept', meta: { title: 'Dept' } };
const fixed: RouteConfigs = {
  path: '/fixed',
  name: 'Fixed',
  meta: { title: 'Fixed', fixedTag: true } as RouteConfigs['meta'],
};

function asRoute(tag: RouteConfigs) {
  return { path: tag.path, query: tag.query ?? {}, params: tag.params ?? {} };
}

function actionsOf(tag: RouteConfigs, route: RouteConfigs, tags: RouteConfigs[], topPath: string) {
  return resolveTagMenuItems({
    tag,
    route: asRoute(route),
    tags,
    topPath,
    contentFullscreen: false,
  }).map((item) => item.action);
}

describe('resolveTagMenuItems', () => {
  it('home shows reload and fullscreen', () => {
    expect(actionsOf(home, home, [home, user, role], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('inactive home shows only fullscreen', () => {
    expect(actionsOf(home, user, [home, user, role], '/home')).toEqual([TagMenuAction.Fullscreen]);
  });

  it('missing tag is treated as home', () => {
    expect(
      resolveTagMenuItems({
        tag: { path: '/missing', meta: { title: 'X' } },
        route: { path: '/missing' },
        tags: [home, user],
        topPath: '/home',
        contentFullscreen: false,
      }).map((item) => item.action)
    ).toEqual([TagMenuAction.Reload, TagMenuAction.Fullscreen]);
  });

  it('redirect of top path cannot close', () => {
    const redirectHome: RouteConfigs = { path: '/redirect/home', name: 'Home', meta: { title: 'Home' } };
    expect(actionsOf(redirectHome, redirectHome, [home, user, role], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('second of many cannot close left', () => {
    expect(actionsOf(user, user, [home, user, role], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Close,
      TagMenuAction.CloseRight,
      TagMenuAction.CloseOther,
      TagMenuAction.CloseAll,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('two tabs: close and closeAll only', () => {
    expect(actionsOf(user, user, [home, user], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Close,
      TagMenuAction.CloseAll,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('last cannot close right', () => {
    expect(actionsOf(role, role, [home, user, role], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Close,
      TagMenuAction.CloseLeft,
      TagMenuAction.CloseOther,
      TagMenuAction.CloseAll,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('last with previous fixed cannot close left or other', () => {
    expect(actionsOf(role, role, [home, fixed, role], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Close,
      TagMenuAction.CloseAll,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('middle enables all close', () => {
    expect(actionsOf(role, role, [home, user, role, dept], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Close,
      TagMenuAction.CloseLeft,
      TagMenuAction.CloseRight,
      TagMenuAction.CloseOther,
      TagMenuAction.CloseAll,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('middle with previous fixed cannot close left', () => {
    expect(actionsOf(role, role, [home, fixed, role, dept], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Close,
      TagMenuAction.CloseRight,
      TagMenuAction.CloseOther,
      TagMenuAction.CloseAll,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('fixed tag disables all close', () => {
    expect(actionsOf(fixed, fixed, [fixed, user], '/fixed')).toEqual([TagMenuAction.Reload, TagMenuAction.Fullscreen]);
  });

  it('inactive tag hides reload', () => {
    expect(actionsOf(user, role, [home, user, role], '/home')).toEqual([
      TagMenuAction.Close,
      TagMenuAction.CloseRight,
      TagMenuAction.CloseOther,
      TagMenuAction.CloseAll,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('matches by query among same path', () => {
    const user1 = { ...user, query: { id: '1' } };
    const user2 = { ...user, query: { id: '2' } };
    expect(actionsOf(user2, user2, [home, user1, user2], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Close,
      TagMenuAction.CloseLeft,
      TagMenuAction.CloseOther,
      TagMenuAction.CloseAll,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('matches by params among same path', () => {
    const user1 = { ...user, params: { id: '1' } };
    const user2 = { ...user, params: { id: '2' } };
    expect(actionsOf(user2, user2, [home, user1, user2], '/home')).toEqual([
      TagMenuAction.Reload,
      TagMenuAction.Close,
      TagMenuAction.CloseLeft,
      TagMenuAction.CloseOther,
      TagMenuAction.CloseAll,
      TagMenuAction.Fullscreen,
    ]);
  });

  it('divides groups and switches fullscreen label', () => {
    const items = resolveTagMenuItems({
      tag: role,
      route: asRoute(role),
      tags: [home, user, role, dept],
      topPath: '/home',
      contentFullscreen: true,
    });
    expect(items.find((item) => item.action === TagMenuAction.Close)?.divided).toBe(true);
    expect(items.find((item) => item.action === TagMenuAction.Fullscreen)?.divided).toBe(true);
    expect(items.find((item) => item.action === TagMenuAction.Fullscreen)?.labelKey).toBe(
      'buttons.contentExitFullScreen'
    );
  });
});
