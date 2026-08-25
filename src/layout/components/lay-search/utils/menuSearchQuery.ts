/** 菜单树节点（搜索扁平化用） */
export interface MenuTreeNode {
  path: string;
  meta?: { icon?: string; title?: string };
  children?: MenuTreeNode[];
}

/**
 * 将菜单树扁平化为一维列表
 * @param nodes 菜单树根节点
 * @returns 扁平菜单项
 */
function flatMenuTree(nodes: MenuTreeNode[]): MenuTreeNode[] {
  const result: MenuTreeNode[] = [];

  const walk = (items: MenuTreeNode[]) => {
    for (const item of items) {
      result.push(item);
      if (item.children?.length) {
        walk(item.children);
      }
    }
  };

  walk(nodes);
  return result;
}

/**
 * 按关键字过滤菜单（标题匹配，忽略大小写）
 * @param menus 菜单树
 * @param keyword 搜索关键字
 * @param resolveTitle 从 meta 解析展示标题
 * @returns 匹配的菜单项
 */
export function filterMenusByKeyword(
  menus: MenuTreeNode[],
  keyword: string,
  resolveTitle: (meta: MenuTreeNode['meta']) => string
): MenuTreeNode[] {
  const normalized = keyword.trim().toLocaleLowerCase();
  if (!normalized) {
    return [];
  }

  return flatMenuTree(menus).filter((menu) => resolveTitle(menu.meta).toLocaleLowerCase().includes(normalized));
}

/**
 * 在列表中循环移动索引
 * @param currentIndex 当前索引（未找到时为 -1）
 * @param length 列表长度
 * @param direction 方向
 * @returns 新索引；空列表返回 -1
 */
export function cycleListIndex(currentIndex: number, length: number, direction: 'prev' | 'next'): number {
  if (length === 0) {
    return -1;
  }

  const delta = direction === 'prev' ? -1 : 1;
  let base = currentIndex;
  if (currentIndex < 0) {
    base = direction === 'next' ? -1 : 0;
  }
  return (base + delta + length) % length;
}
