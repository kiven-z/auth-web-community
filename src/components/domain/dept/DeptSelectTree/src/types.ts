/** 选择树节点禁用口径 */
export type DeptSelectDisableMode =
  /** 计算无效不可选（新任职 / 岗位挂载等 requireEffective） */
  | 'ineffective'
  /** 仅本节点停用不可选（数据范围等存在性校验） */
  | 'inactive'
  /** 均可选，仅展示状态（父部门结构编辑） */
  | 'none';

/** 构建选择树选项 */
export interface BuildDeptSelectTreeOptions {
  /** 默认 `ineffective` */
  disableMode?: DeptSelectDisableMode;
}

/** 部门选择树节点（cascader / tree-select） */
export interface DeptSelectTreeNode {
  id: string;
  value: string;
  label: string;
  deptCode: string;
  /** 本节点启用状态 */
  status: boolean;
  /** 计算有效（后端投影） */
  effective: boolean;
  /** 按 disableMode 计算；不可选时仍展示 */
  disabled?: boolean;
  children?: DeptSelectTreeNode[];
}
