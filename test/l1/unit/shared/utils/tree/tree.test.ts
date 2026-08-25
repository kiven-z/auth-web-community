import { describe, expect, it } from 'vitest';
import { buildHierarchyTree, handleTree, TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';

describe('normalizeTreeInput (via public APIs)', () => {
  it('returns empty array for null, undefined, non-array and empty array', () => {
    expect(buildHierarchyTree(null)).toEqual([]);
    expect(buildHierarchyTree(undefined)).toEqual([]);
    expect(buildHierarchyTree('bad' as unknown as [])).toEqual([]);
    expect(buildHierarchyTree([])).toEqual([]);
  });
});

describe('handleTree', () => {
  it('builds nested tree from flat parentId rows', () => {
    const flat = [
      { id: '1', parentId: '0', name: 'root' },
      { id: '2', parentId: '1', name: 'child' },
    ];

    expect(handleTree(flat)).toEqual([
      {
        id: '1',
        parentId: '0',
        name: 'root',
        children: [{ id: '2', parentId: '1', name: 'child' }],
      },
    ]);
  });

  it('returns empty array for non-array input', () => {
    expect(handleTree(null as unknown as [])).toEqual([]);
  });
});

describe('TREE_ROOT_PARENT_ID', () => {
  it('is the conventional root parent id', () => {
    expect(TREE_ROOT_PARENT_ID).toBe('0');
  });
});

describe('buildHierarchyTree', () => {
  it('assigns id, parentId and pathList', () => {
    const tree: Array<Record<string, unknown>> = [{ children: [{ name: 'leaf' }] }];
    buildHierarchyTree(tree);

    expect(tree[0].id).toBe(0);
    expect(tree[0].parentId).toBeNull();
    expect(tree[0].pathList).toEqual([0]);
  });
});
