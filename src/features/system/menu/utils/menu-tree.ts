/**
 * 在树形选项中查找自根到目标 id 的路径（用于 el-cascader v-model）
 */
export function findMenuIdPath(
  nodes: Array<{ id: string; children?: unknown[] }>,
  targetId: string | null | undefined,
  path: string[] = []
): string[] {
  if (!targetId) {
    return [];
  }
  for (const n of nodes) {
    const next = [...path, n.id];
    if (n.id === targetId) {
      return next;
    }
    const kids = n.children as Array<{ id: string; children?: unknown[] }> | undefined;
    if (kids?.length) {
      const hit = findMenuIdPath(kids, targetId, next);
      if (hit.length) {
        return hit;
      }
    }
  }
  return [];
}
