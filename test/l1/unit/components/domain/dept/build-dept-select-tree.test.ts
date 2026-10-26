import { describe, expect, it } from 'vitest';
import { buildDeptSelectTree } from '@/components/domain/dept/dept-select-tree';
import type { SysDeptListVO } from '@/features/system/api/dept/dept';

function dept(id: string, parentId: string): SysDeptListVO {
  return {
    id,
    parentId,
    deptName: id,
    deptCode: id,
    orderNum: 0,
  };
}

describe('buildDeptSelectTree', () => {
  it('nests every department and keeps each node selectable', () => {
    const tree = buildDeptSelectTree([dept('hq', '0'), dept('rd', 'hq'), dept('rd-child', 'rd')]);

    expect(tree).toEqual([
      {
        id: 'hq',
        value: 'hq',
        parentId: '0',
        label: 'hq',
        deptCode: 'hq',
        children: [
          {
            id: 'rd',
            value: 'rd',
            parentId: 'hq',
            label: 'rd',
            deptCode: 'rd',
            children: [
              {
                id: 'rd-child',
                value: 'rd-child',
                parentId: 'rd',
                label: 'rd-child',
                deptCode: 'rd-child',
                children: undefined,
              },
            ],
          },
        ],
      },
    ]);
  });
});
