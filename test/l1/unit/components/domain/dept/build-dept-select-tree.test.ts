import { describe, expect, it } from 'vitest';
import { buildDeptSelectTree } from '@/components/domain/dept/dept-select-tree';
import type { SysDeptListVO } from '@/features/system/api/dept/dept';

function dept(id: string, parentId: string, status: boolean, effective: boolean): SysDeptListVO {
  return {
    id,
    parentId,
    deptName: id,
    deptCode: id,
    status,
    effective,
    orderNum: 0,
  };
}

describe('buildDeptSelectTree', () => {
  it('defaults to ineffective: disables when backend effective is false', () => {
    const tree = buildDeptSelectTree([
      dept('hq', '0', false, false),
      dept('rd', 'hq', true, false),
      dept('rd-child', 'rd', true, false),
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0]).toMatchObject({
      id: 'hq',
      status: false,
      effective: false,
      disabled: true,
    });
    expect(tree[0].children?.[0]).toMatchObject({
      id: 'rd',
      status: true,
      effective: false,
      disabled: true,
    });
    expect(tree[0].children?.[0].children?.[0]).toMatchObject({
      id: 'rd-child',
      status: true,
      effective: false,
      disabled: true,
    });
  });

  it('defaults to ineffective: disables an inactive child under an enabled parent', () => {
    const tree = buildDeptSelectTree([dept('hq', '0', true, true), dept('archived', 'hq', false, false)]);

    expect(tree[0]).toMatchObject({ id: 'hq', disabled: false, effective: true });
    expect(tree[0].children?.[0]).toMatchObject({ id: 'archived', disabled: true, effective: false });
  });

  it('keeps an enabled branch selectable under ineffective mode', () => {
    const tree = buildDeptSelectTree([dept('hq', '0', true, true), dept('rd', 'hq', true, true)]);

    expect(tree[0]).toMatchObject({ id: 'hq', disabled: false, effective: true });
    expect(tree[0].children?.[0]).toMatchObject({ id: 'rd', disabled: false, effective: true });
  });

  it('inactive mode: only node status disables; ancestor-propagated stays selectable', () => {
    const tree = buildDeptSelectTree(
      [dept('hq', '0', false, false), dept('rd', 'hq', true, false)],
      { disableMode: 'inactive' }
    );

    expect(tree[0]).toMatchObject({ id: 'hq', disabled: true, status: false });
    expect(tree[0].children?.[0]).toMatchObject({ id: 'rd', disabled: false, status: true, effective: false });
  });

  it('none mode: never disables, still projects status and effective', () => {
    const tree = buildDeptSelectTree(
      [dept('hq', '0', false, false), dept('rd', 'hq', true, false)],
      { disableMode: 'none' }
    );

    expect(tree[0]).toMatchObject({ id: 'hq', disabled: false, status: false, effective: false });
    expect(tree[0].children?.[0]).toMatchObject({ id: 'rd', disabled: false, status: true, effective: false });
  });
});
