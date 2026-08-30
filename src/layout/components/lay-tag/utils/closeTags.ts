import type { RouteConfigs } from '@/layout/types';
import type { CloseScope } from '../types';

/**
 * 按关闭策略计算新的标签列表
 * @param tags 当前标签
 * @param targetIndex 目标标签下标
 * @param scope 关闭范围
 * @param fixedTagCount 固定标签数量
 * @param targetTag 关闭「其他」时保留的目标标签
 * @param topMenuTag 无首页固定标签时的顶栏菜单标签
 * @param keepHomeFixedTags 是否保留 routerArrays 固定标签
 * @returns 关闭后的标签列表
 */
export function applyCloseScope(
  tags: RouteConfigs[],
  targetIndex: number,
  scope: CloseScope,
  fixedTagCount: number,
  targetTag: RouteConfigs,
  topMenuTag: RouteConfigs | undefined,
  keepHomeFixedTags: boolean
): RouteConfigs[] {
  if (targetIndex < 0) {
    return [...tags];
  }

  switch (scope) {
    case 'other': {
      let base: RouteConfigs[];
      if (keepHomeFixedTags) {
        base = tags.slice(0, fixedTagCount);
      } else if (topMenuTag) {
        base = [topMenuTag];
      } else {
        base = [];
      }
      return [...base, targetTag];
    }
    case 'left':
      return [...tags.slice(0, fixedTagCount), ...tags.slice(targetIndex)];
    case 'right':
      return tags.slice(0, targetIndex + 1);
    case 'all':
      return tags.slice(0, fixedTagCount);
    case 'current':
    default:
      return [...tags.slice(0, targetIndex), ...tags.slice(targetIndex + 1)];
  }
}

/**
 * 关闭标签后是否需要跳转到剩余最后一个标签
 * @param closedPath 被关闭标签 path
 * @param currentRoutePath 当前路由 path
 * @param scope 关闭范围
 * @param remainingTags 关闭后的标签列表
 * @returns 是否应导航
 */
export function shouldNavigateAfterClose(
  closedPath: string,
  currentRoutePath: string,
  scope: CloseScope,
  remainingTags: RouteConfigs[]
): boolean {
  if (closedPath === currentRoutePath) {
    return scope !== 'left';
  }
  if (!remainingTags.length) {
    return false;
  }
  return !remainingTags.some((item) => item.path === currentRoutePath);
}

/**
 * 取关闭后用于导航的目标标签（默认最后一个）
 * @param remainingTags 关闭后的标签列表
 * @returns 导航目标
 */
export function pickNavigateTag(remainingTags: RouteConfigs[]): RouteConfigs | undefined {
  return remainingTags.at(-1);
}
