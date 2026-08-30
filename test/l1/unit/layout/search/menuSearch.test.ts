import { describe, expect, it } from 'vitest';

import { cycleListIndex, filterMenusByKeyword, type MenuTreeNode } from '@/layout/chrome/search/utils/menuSearchQuery';
import {
  collectHistoryItem,
  promoteHistoryEntry,
  recordSearchHistory,
  reorderCollectList,
} from '@/layout/chrome/search/utils/menuSearchStorage';

const menus: MenuTreeNode[] = [
  {
    path: '/system',
    meta: { title: 'System' },
    children: [
      { path: '/system/user', meta: { title: 'User Manage' } },
      { path: '/system/role', meta: { title: 'Role Manage' } },
    ],
  },
  { path: '/welcome', meta: { title: 'Welcome' } },
];

describe('filterMenusByKeyword', () => {
  it('flattens nested menu nodes in depth-first order', () => {
    const hits = filterMenusByKeyword(menus, 'x', () => 'x');
    expect(hits.map((item) => item.path)).toEqual(['/system', '/system/user', '/system/role', '/welcome']);
  });

  it('matches title case-insensitively', () => {
    const hits = filterMenusByKeyword(menus, 'user', (meta) => meta?.title ?? '');
    expect(hits.map((item) => item.path)).toEqual(['/system/user']);
  });

  it('returns empty when keyword blank', () => {
    expect(filterMenusByKeyword(menus, '   ', (meta) => meta?.title ?? '')).toEqual([]);
  });
});

describe('cycleListIndex', () => {
  it('wraps to last when moving prev from first', () => {
    expect(cycleListIndex(0, 3, 'prev')).toBe(2);
  });

  it('wraps to first when moving next from last', () => {
    expect(cycleListIndex(2, 3, 'next')).toBe(0);
  });
});

describe('menuSearchStorage', () => {
  const history = [
    { path: '/a', type: 'history' as const, meta: {} },
    { path: '/b', type: 'history' as const, meta: {} },
  ];
  const collect = [{ path: '/c', type: 'collect' as const, meta: {} }];

  it('promotes history entry to front', () => {
    expect(promoteHistoryEntry(history, '/b').map((item) => item.path)).toEqual(['/b', '/a']);
  });

  it('skips recording when path already collected', () => {
    expect(recordSearchHistory(history, collect, { path: '/c', meta: {} }, 5)).toBe(history);
  });

  it('trims history when exceeding max', () => {
    const next = recordSearchHistory(history, [], { path: '/d', meta: {} }, 2);
    expect(next.map((item) => item.path)).toEqual(['/d', '/a']);
  });

  it('moves item from history to collect', () => {
    const { history: nextHistory, collect: nextCollect } = collectHistoryItem(history, collect, history[0]);
    expect(nextHistory.map((item) => item.path)).toEqual(['/b']);
    expect(nextCollect[0].path).toBe('/a');
    expect(nextCollect[0].type).toBe('collect');
  });

  it('reorders collect list', () => {
    const list = [
      { path: '/1', type: 'collect' as const, meta: {} },
      { path: '/2', type: 'collect' as const, meta: {} },
    ];
    expect(reorderCollectList(list, 0, 1).map((item) => item.path)).toEqual(['/2', '/1']);
  });
});
