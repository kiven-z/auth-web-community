import type { RouteConfigs } from '@/layout/types';
import { describe, expect, it } from 'vitest';
import { findTagIndex, getTagItemKey, isSameTag } from '@/layout/components/lay-tag/utils/tagIdentity';

describe('getTagItemKey', () => {
  it('combines path query and params', () => {
    expect(getTagItemKey({ path: '/user', query: { id: '1' }, params: { tab: 'a' }, meta: { title: 'U' } })).toBe(
      '/user::{"id":"1"}::{"tab":"a"}'
    );
  });
});

describe('isSameTag', () => {
  const base: RouteConfigs = { path: '/user', name: 'User', meta: { title: 'User' }, query: { id: '1' } };

  it('matches path query params', () => {
    expect(isSameTag(base, { path: '/user', query: { id: '1' } })).toBe(true);
  });

  it('rejects different query', () => {
    expect(isSameTag(base, { path: '/user', query: { id: '2' } })).toBe(false);
  });

  it('rejects different path', () => {
    expect(isSameTag(base, { path: '/other', query: { id: '1' } })).toBe(false);
  });
});

describe('findTagIndex', () => {
  const tags: RouteConfigs[] = [
    { path: '/home', name: 'Home', meta: { title: 'Home' } },
    { path: '/user', name: 'User', meta: { title: 'User' }, query: { id: '1' } },
  ];

  it('finds by path', () => {
    expect(findTagIndex(tags, { path: '/home' })).toBe(0);
  });

  it('finds by path and query', () => {
    expect(findTagIndex(tags, { path: '/user', query: { id: '1' } })).toBe(1);
  });

  it('returns -1 when missing', () => {
    expect(findTagIndex(tags, { path: '/missing' })).toBe(-1);
  });
});
