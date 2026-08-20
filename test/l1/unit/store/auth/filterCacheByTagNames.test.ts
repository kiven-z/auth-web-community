import { describe, expect, it } from 'vitest';

/**
 * KeepAlive 缓存页与标签页对齐的纯函数规格。
 * PR3 将下沉到 src/store/modules/auth/filterCacheByTagNames.ts 并由 permission store 调用。
 */
function filterCacheByTagNames(cachePageList: string[], activeNames: readonly string[]): string[] {
  const names = new Set(activeNames);
  return cachePageList.filter((name) => names.has(name));
}

describe('filterCacheByTagNames', () => {
  it('keeps cache entries that still exist in tag names', () => {
    expect(filterCacheByTagNames(['UserList', 'RoleList', 'DeptList'], ['UserList', 'DeptList'])).toEqual([
      'UserList',
      'DeptList',
    ]);
  });

  it('drops cache entries whose tag was closed', () => {
    expect(filterCacheByTagNames(['UserList', 'RoleList'], ['UserList'])).toEqual(['UserList']);
  });

  it('returns empty list when no tags remain', () => {
    expect(filterCacheByTagNames(['UserList', 'RoleList'], [])).toEqual([]);
  });

  it('returns empty list for empty cache', () => {
    expect(filterCacheByTagNames([], ['UserList'])).toEqual([]);
  });

  it('preserves cache order', () => {
    expect(filterCacheByTagNames(['B', 'A', 'C'], ['A', 'B', 'C'])).toEqual(['B', 'A', 'C']);
  });
});
