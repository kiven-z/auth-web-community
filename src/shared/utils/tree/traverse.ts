import { TREE_ROOT_PARENT_ID } from './constants';
import { hasTreeChildren, normalizeTreeInput } from './normalize';
import type { TreePathNode } from './types';

interface UniqueIdNode {
  uniqueId?: number | string;
  children?: UniqueIdNode[];
}

/**
 * @description 提取菜单树中的每一项uniqueId
 * @param tree 树
 * @returns 每一项uniqueId组成的数组
 */

export const extractPathList = (tree: any): any => {
  const nodes = normalizeTreeInput<UniqueIdNode>(tree);
  if (!nodes) {
    return [];
  }

  const expandedPaths: Array<number | string> = [];
  for (const node of nodes) {
    if (hasTreeChildren(node)) {
      extractPathList(node.children);
    }
    expandedPaths.push(node.uniqueId);
  }
  return expandedPaths;
};

/**
 * @description 广度优先遍历，根据唯一uniqueId找当前节点信息
 * @param tree 树
 * @param uniqueId 唯一uniqueId
 * @returns 当前节点信息
 */

export const getNodeByUniqueId = (tree: any, uniqueId: number | string): any => {
  const nodes = normalizeTreeInput<UniqueIdNode>(tree);
  if (!nodes) {
    return [];
  }

  const item = nodes.find((node) => node.uniqueId === uniqueId);
  if (item) {
    return item;
  }

  const childrenList = nodes.flatMap((node) => node.children ?? []);
  return getNodeByUniqueId(childrenList, uniqueId);
};

/**
 * @description 向当前唯一uniqueId节点中追加字段
 * @param tree 树
 * @param uniqueId 唯一uniqueId
 * @param fields 需要追加的字段
 * @returns 追加字段后的树
 */

export const appendFieldByUniqueId = (tree: any, uniqueId: number | string, fields: object): any => {
  const nodes = normalizeTreeInput<UniqueIdNode>(tree);
  if (!nodes) {
    return [];
  }

  const isPlainObject = Object.prototype.toString.call(fields) === '[object Object]';
  for (const node of nodes) {
    if (node.uniqueId === uniqueId && isPlainObject) {
      Object.assign(node, fields);
    }
    if (hasTreeChildren(node)) {
      appendFieldByUniqueId(node.children, uniqueId, fields);
    }
  }
  return nodes;
};

/**
 * 查找自根到目标 id 的路径（用于 el-cascader v-model）
 * @param nodes 树形数据
 * @param targetId 目标节点 id；空或顶级时返回空路径
 * @param path 当前路径
 * @returns 自根到目标的 id 路径
 */
export const findTreePathById = (
  nodes: TreePathNode[],
  targetId: string | null | undefined,
  path: string[] = []
): string[] => {
  if (!targetId || targetId === TREE_ROOT_PARENT_ID) {
    return [];
  }

  for (const node of nodes) {
    const next = [...path, node.id];
    if (node.id === targetId) {
      return next;
    }
    const children = node.children;
    if (children?.length) {
      const hit = findTreePathById(children, targetId, next);
      if (hit.length) {
        return hit;
      }
    }
  }
  return [];
};
