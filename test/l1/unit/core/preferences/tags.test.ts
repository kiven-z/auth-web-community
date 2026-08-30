import { parseTagsPreferenceValue, toPersistedTag } from '@/core/preferences/persistence/tags';
import { describe, expect, it } from 'vitest';

describe('preferences tags', () => {
  it('toPersistedTag 去掉函数型 icon', () => {
    const persisted = toPersistedTag({
      path: '/system/user',
      name: 'SystemUser',
      meta: {
        title: 'menus.user',
        icon: () => null,
      },
    });
    expect(persisted).toEqual({
      path: '/system/user',
      name: 'SystemUser',
      query: undefined,
      params: undefined,
      meta: {
        title: 'menus.user',
        icon: undefined,
        showLink: undefined,
        savedPosition: undefined,
      },
    });
  });

  it('parseTagsPreferenceValue 过滤无效项', () => {
    const tags = parseTagsPreferenceValue({
      items: [{ path: '/a', name: 'A' }, { name: 'no-path' }, 'x', null],
    });
    expect(tags).toEqual([
      {
        path: '/a',
        name: 'A',
        query: undefined,
        params: undefined,
        meta: undefined,
      },
    ]);
  });
});
