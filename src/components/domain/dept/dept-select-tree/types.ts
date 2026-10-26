/** 部门选择树节点（cascader / tree-select） */
export interface DeptSelectTreeNode {
  id: string;
  value: string;
  label: string;
  deptCode: string;
  children?: DeptSelectTreeNode[];
}
