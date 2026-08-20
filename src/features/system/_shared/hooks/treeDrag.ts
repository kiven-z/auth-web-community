import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';

/** Element Plus 树拖拽落点类型 */
export type TreeDropType = 'prev' | 'next' | 'inner';

/** 树节点移动所需的最小字段 */
export interface TreeMoveNode {
  id: string;
  parentId?: string | null;
}

/**
 * 规范父节点 ID
 * @param parentId 原始父节点 ID
 * @param rootParentId 顶级 parentId，默认
 * @returns 规范化后的父节点 ID
 */
export function normalizeTreeParentId(
  parentId: string | undefined | null,
  rootParentId: string = TREE_ROOT_PARENT_ID
): string {
  if (!parentId || parentId === rootParentId) {
    return rootParentId;
  }
  return parentId;
}

/**
 * 根据落点计算移动后的 parentId
 */
export function resolveNewParentIdFromDrop<T extends TreeMoveNode>(
  dropNode: T,
  dropType: TreeDropType,
  rootParentId: string
): string {
  if (dropType === 'inner') {
    return dropNode.id;
  }
  return normalizeTreeParentId(dropNode.parentId, rootParentId);
}

/**
 * 收集节点子树内全部 ID（含自身）
 */
export function collectSubtreeIds<T extends TreeMoveNode & { children?: T[] }>(node: T): Set<string> {
  const ids = new Set<string>();
  const walk = (current: T) => {
    ids.add(current.id);
    current.children?.forEach(walk);
  };
  walk(node);
  return ids;
}

/**
 * 在树中查找节点
 */
export function findTreeNode<T extends TreeMoveNode & { children?: T[] }>(tree: T[], nodeId: string): T | undefined {
  for (const node of tree) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children?.length) {
      const found = findTreeNode(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * 目标节点是否落在被拖拽节点的子树内（禁止形成环）
 */
export function isDropTargetInDraggedSubtree<T extends TreeMoveNode & { children?: T[] }>(
  draggedId: string,
  dropTargetId: string,
  tree: T[]
): boolean {
  const draggedNode = findTreeNode(tree, draggedId);
  if (!draggedNode) {
    return false;
  }
  return collectSubtreeIds(draggedNode).has(dropTargetId);
}

/**
 * 是否允许放置：禁止自身/后代落点
 */
export function canDropTreeNode<T extends TreeMoveNode & { children?: T[] }>(
  draggedId: string,
  dropTargetId: string,
  tree: T[]
): boolean {
  if (draggedId === dropTargetId) {
    return false;
  }
  return !isDropTargetInDraggedSubtree(draggedId, dropTargetId, tree);
}

/**
 * 移动后的上级节点展示名（顶级用调用方传入文案）
 */
export function resolveMoveTargetParentLabel<T extends TreeMoveNode & { children?: T[] }>(
  newParentId: string,
  tree: T[],
  rootParentId: string,
  topLevelLabel: string,
  getNodeLabel: (node: T) => string
): string {
  if (normalizeTreeParentId(newParentId, rootParentId) === rootParentId) {
    return topLevelLabel;
  }
  const parent = findTreeNode(tree, newParentId);
  return parent ? getNodeLabel(parent) : newParentId;
}
