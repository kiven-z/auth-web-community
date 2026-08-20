/**
 * 校验树形输入：非数组或空数组时返回 null，调用方统一回落为 []
 * @param tree 树形数据
 * @returns 非空数组或 null
 */
export function normalizeTreeInput<T>(tree: unknown): T[] | null {
  if (!Array.isArray(tree) || tree.length === 0) {
    return null;
  }
  return tree as T[];
}

/**
 * 节点是否含非空 children
 * @param node 树节点
 * @returns 是否有子节点
 */
export function hasTreeChildren(node: { children?: unknown[] }): boolean {
  return Array.isArray(node.children) && node.children.length > 0;
}
