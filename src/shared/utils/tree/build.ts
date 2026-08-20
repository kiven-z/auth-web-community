import { hasTreeChildren, normalizeTreeInput } from './normalize';

/**
 * 写入层级字段：id / parentId / pathList
 * @param node 当前节点
 * @param key 数组下标
 * @param pathList 祖先 id 路径
 */
function assignHierarchyFields(node: Record<string, unknown>, key: number, pathList: number[]): void {
  node.id = key;
  node.parentId = pathList.length ? pathList.at(-1) : null;
  node.pathList = [...pathList, node.id as number];
}

/**
 * @description 如果父级下children的length为1，删除children并自动组建唯一uniqueId
 * @param tree 树
 * @param pathList 每一项的id组成的数组
 * @returns 组件唯一uniqueId后的树
 */

export const deleteChildren = (tree: any, pathList: number[] = []): any => {
  const nodes = normalizeTreeInput<Record<string, unknown>>(tree);
  if (!nodes) {
    return [];
  }

  for (const [key, node] of nodes.entries()) {
    if ((node.children as unknown[] | undefined)?.length === 1) {
      delete node.children;
    }
    assignHierarchyFields(node, key, pathList);
    const pathListValue = node.pathList as number[];
    node.uniqueId = pathListValue.length > 1 ? pathListValue.join('-') : pathListValue[0];
    if (hasTreeChildren(node)) {
      deleteChildren(node.children, pathListValue);
    }
  }
  return nodes;
};

/**
 * @description 创建层级关系
 * @param tree 树
 * @param pathList 每一项的id组成的数组
 * @returns 创建层级关系后的树
 */

export const buildHierarchyTree = (tree: any, pathList: number[] = []): any => {
  const nodes = normalizeTreeInput<Record<string, unknown>>(tree);
  if (!nodes) {
    return [];
  }

  for (const [key, node] of nodes.entries()) {
    assignHierarchyFields(node, key, pathList);
    if (hasTreeChildren(node)) {
      buildHierarchyTree(node.children, node.pathList as number[]);
    }
  }
  return nodes;
};

/**
 * @description 构造树型结构数据
 * @param data 数据源
 * @param id id字段 默认id
 * @param parentId 父节点字段，默认parentId
 * @param children 子节点字段，默认children
 * @returns 追加字段后的树
 */

export const handleTree = (data: any, id?: string, parentId?: string, children?: string): any => {
  if (!Array.isArray(data)) {
    return [];
  }

  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  };

  const childrenListMap: Record<string | number, any[]> = {};
  const nodeIds: Record<string | number, any> = {};
  const tree: any[] = [];

  for (const row of data) {
    const rowParentId = row[config.parentId];
    childrenListMap[rowParentId] ??= [];
    nodeIds[row[config.id]] = row;
    childrenListMap[rowParentId].push(row);
  }

  for (const row of data) {
    const rowParentId = row[config.parentId];
    if (nodeIds[rowParentId] == null) {
      tree.push(row);
    }
  }

  for (const root of tree) {
    adaptToChildrenList(root);
  }

  function adaptToChildrenList(node: Record<string, any>): void {
    const nodeId = node[config.id];
    if (childrenListMap[nodeId] !== null) {
      node[config.childrenList] = childrenListMap[nodeId];
    }
    if (node[config.childrenList]) {
      for (const child of node[config.childrenList]) {
        adaptToChildrenList(child);
      }
    }
  }

  return tree;
};
