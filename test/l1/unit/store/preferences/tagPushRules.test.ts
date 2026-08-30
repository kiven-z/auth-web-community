import type { RouteConfigs } from '@/router/types';
import type { TagRouteItem } from '@/store/types';
import { describe, expect, it } from 'vitest';
import {
  applyPushTag,
  isDuplicateTag,
  shouldSkipPush,
  trimBeforePush,
} from '@/store/modules/preferences/tags/tagPushRules';

describe('shouldSkipPush', () => {
  it('skips hidden tags', () => {
    expect(shouldSkipPush({ path: '/a', name: 'A', meta: { hiddenTag: true, title: 'A' } })).toBe(true);
  });

  it('skips external url names', () => {
    expect(shouldSkipPush({ path: '/a', name: 'https://example.com', meta: { title: 'A' } })).toBe(true);
  });

  it('skips empty title', () => {
    expect(shouldSkipPush({ path: '/a', name: 'A', meta: { title: '' } })).toBe(true);
  });

  it('skips showLink false', () => {
    expect(shouldSkipPush({ path: '/a', name: 'A', meta: { title: 'A', showLink: false } })).toBe(true);
  });

  it('allows normal tags', () => {
    expect(shouldSkipPush({ path: '/a', name: 'A', meta: { title: 'A' } })).toBe(false);
  });
});

describe('isDuplicateTag', () => {
  const tags: RouteConfigs[] = [{ path: '/user', name: 'User', meta: { title: 'User' }, query: { id: '1' } }];

  it('detects same path query params', () => {
    expect(isDuplicateTag(tags, { path: '/user', name: 'User', meta: { title: 'User' }, query: { id: '1' } })).toBe(
      true
    );
  });

  it('allows different query', () => {
    expect(isDuplicateTag(tags, { path: '/user', name: 'User', meta: { title: 'User' }, query: { id: '2' } })).toBe(
      false
    );
  });
});

describe('trimBeforePush', () => {
  it('removes first same-path tag when dynamicLevel exceeded', () => {
    const tags: RouteConfigs[] = [
      { path: '/detail', name: 'Detail1', meta: { title: 'D1', dynamicLevel: 1 } as RouteConfigs['meta'] },
      { path: '/home', name: 'Home', meta: { title: 'Home' } },
    ];
    const tag: TagRouteItem = { path: '/detail', name: 'Detail2', meta: { title: 'D2', dynamicLevel: 1 } };
    expect(trimBeforePush(tags, tag)).toEqual([{ path: '/home', name: 'Home', meta: { title: 'Home' } }]);
  });
});

describe('applyPushTag', () => {
  it('returns null when push should be skipped', () => {
    expect(applyPushTag([], { path: '/a', name: 'A', meta: { hiddenTag: true, title: 'A' } })).toBeNull();
  });

  it('appends tag when valid', () => {
    const tag: TagRouteItem = { path: '/new', name: 'New', meta: { title: 'New' } };
    expect(applyPushTag([], tag)).toEqual([tag]);
  });
});
