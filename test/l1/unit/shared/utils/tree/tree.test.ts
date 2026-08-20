import { describe, expect, it } from 'vitest';
import {
  appendFieldByUniqueId,
  buildHierarchyTree,
  deleteChildren,
  extractPathList,
  findTreePathById,
  getNodeByUniqueId,
  handleTree,
  TREE_ROOT_PARENT_ID,
} from '@/shared/utils/tree';

describe('normalizeTreeInput (via public APIs)', () => {
  it('returns empty array for null, undefined, non-array and empty array', () => {
    expect(extractPathList(null)).toEqual([]);
    expect(extractPathList(undefined)).toEqual([]);
    expect(extractPathList('bad' as unknown as [])).toEqual([]);
    expect(extractPathList([])).toEqual([]);
    expect(buildHierarchyTree(null)).toEqual([]);
    expect(deleteChildren([])).toEqual([]);
    expect(getNodeByUniqueId([], 'x')).toEqual([]);
    expect(appendFieldByUniqueId(null, 'x', {})).toEqual([]);
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

describe('findTreePathById', () => {
  const nodes = [{ id: '1', children: [{ id: '2', children: [{ id: '3' }] }] }];

  it('returns path from root to target', () => {
    expect(findTreePathById(nodes, '3')).toEqual(['1', '2', '3']);
  });

  it('returns empty path for root parent id', () => {
    expect(findTreePathById(nodes, TREE_ROOT_PARENT_ID)).toEqual([]);
  });

  it('returns empty path when target is missing', () => {
    expect(findTreePathById(nodes, 'missing')).toEqual([]);
  });
});

describe('getNodeByUniqueId', () => {
  it('finds nested node by uniqueId', () => {
    const tree = [{ uniqueId: 'a', children: [{ uniqueId: 'b' }] }];
    expect(getNodeByUniqueId(tree, 'b')?.uniqueId).toBe('b');
  });

  it('returns empty array for missing uniqueId', () => {
    const tree = [{ uniqueId: 'a' }];
    expect(getNodeByUniqueId(tree, 'missing')).toEqual([]);
  });
});

describe('extractPathList', () => {
  it('collects top-level uniqueId values (current implementation)', () => {
    const tree = [{ uniqueId: 'a', children: [{ uniqueId: 'b' }] }];
    expect(extractPathList(tree)).toEqual(['a']);
  });
});

describe('deleteChildren', () => {
  it('removes single-child branches and assigns uniqueId', () => {
    const tree: Array<Record<string, unknown>> = [{ children: [{ name: 'leaf' }] }];
    deleteChildren(tree);

    expect(tree[0].children).toBeUndefined();
    expect(tree[0].uniqueId).toBe(0);
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

describe('appendFieldByUniqueId', () => {
  it('merges fields into matching node', () => {
    const tree = [{ uniqueId: 'a', label: 'old' }];
    appendFieldByUniqueId(tree, 'a', { label: 'new', extra: true });

    expect(tree[0]).toMatchObject({ uniqueId: 'a', label: 'new', extra: true });
  });
});
