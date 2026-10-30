import type { SysDeptListVO } from '@/features/system/api/dept/dept';
import { handleTree } from '@/shared/utils/tree';
import type { DeptSelectTreeNode } from './types';

/**
 * 扁平部门列表 → 选择树。存在的节点均可选
 * @param list 部门扁平列表
 * @returns 部门选择树
 */
export function buildDeptSelectTree(list: SysDeptListVO[]): DeptSelectTreeNode[] {
  const nodes = list.map((item) => ({
    id: item.id,
    value: item.id,
    parentId: item.parentId,
    label: item.deptName,
    deptCode: item.deptCode,
  }));
  return handleTree(nodes, 'id', 'parentId', 'children') as DeptSelectTreeNode[];
}
