import type { RouteConfigs } from '@/router/types';
import type { TagRouteItem } from '@/store/types';
import { describe, expect, it } from 'vitest';
import {
  applyPushTag,
  isDuplicateTag,
  isSameTag,
  shouldSkipPush,
  trimBeforePush,
} from '@/store/modules/preferences/tags/tag-push-rules';

describe('isSameTag', () => {
  const tags: RouteConfigs[] = [
    { path: '/home', name: 'Home', meta: { title: 'Home' } },
    { path: '/user', name: 'User', meta: { title: 'User' }, query: { id: '1' } },
  ];
  const user: RouteConfigs = { path: '/user', name: 'User', meta: { title: 'User' }, query: { id: '1' } };

  it('matches path and empty query', () => {
    expect(isSameTag({ path: '/home', query: {} }, { path: '/home', name: 'Home', meta: { title: 'Home' } })).toBe(
      true
    );
  });

  it('requires query to match', () => {
    expect(isSameTag(user, { path: '/user', query: { id: '1' } })).toBe(true);
    expect(isSameTag(user, { path: '/user', query: { id: '2' } })).toBe(false);
  });

  it('finds by path in list', () => {
    expect(tags.findIndex((item) => isSameTag(item, { path: '/home' }))).toBe(0);
  });

  it('finds by path and query in list', () => {
    expect(tags.findIndex((item) => isSameTag(item, { path: '/user', query: { id: '1' } }))).toBe(1);
  });

  it('returns -1 when query differs', () => {
    expect(tags.findIndex((item) => isSameTag(item, { path: '/user', query: { id: '2' } }))).toBe(-1);
  });

  it('returns -1 when path differs', () => {
    expect(tags.findIndex((item) => isSameTag(item, { path: '/other', query: { id: '1' } }))).toBe(-1);
  });

  it('returns -1 when missing', () => {
    expect(tags.findIndex((item) => isSameTag(item, { path: '/missing' }))).toBe(-1);
  });

  it('treats missing query as empty object', () => {
    expect(tags.findIndex((item) => isSameTag(item, { path: '/home', query: {} }))).toBe(0);
  });
});

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

  it('treats missing query as empty object', () => {
    const withoutQuery: RouteConfigs[] = [{ path: '/home', name: 'Home', meta: { title: 'Home' } }];
    expect(isDuplicateTag(withoutQuery, { path: '/home', name: 'Home', meta: { title: 'Home' }, query: {} })).toBe(
      true
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
