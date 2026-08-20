import type { SysDeptListVO } from '@/features/system/api/dept/dept';
import { handleTree } from '@/shared/utils/tree';
import type { BuildDeptSelectTreeOptions, DeptSelectTreeNode } from './types';

/**
 * 扁平部门列表 → 选择树（状态与计算有效来自后端，前端不再遍历祖先）
 * @param list 部门扁平列表（须含后端 effective）
 * @param options 禁用口径；默认 `ineffective`
 * @returns 部门选择树
 */
export function buildDeptSelectTree(list: SysDeptListVO[], options?: BuildDeptSelectTreeOptions): DeptSelectTreeNode[] {
  const disableMode = options?.disableMode ?? 'ineffective';
  const nodes = list.map((item) => {
    const effective = item.effective === true;
    const status = item.status === true;
    let disabled: boolean;
    switch (disableMode) {
      case 'none':
        disabled = false;
        break;
      case 'inactive':
        disabled = !status;
        break;
      default:
        disabled = !effective;
        break;
    }
    return {
      id: item.id,
      value: item.id,
      parentId: item.parentId,
      label: item.deptName,
      deptCode: item.deptCode,
      status,
      effective,
      disabled,
    };
  });
  return handleTree(nodes, 'id', 'parentId', 'children') as DeptSelectTreeNode[];
}
