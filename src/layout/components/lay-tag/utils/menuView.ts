import type { TagContextMenuItem } from '@/layout/types';
import { TAG_MENU_INDEX, type TagMenuAction } from '../constants/tagMenu';
import type { TagMenuState } from '../types';

/**
 * 将计算后的菜单状态写回 tagsViews
 * @param tagsViews 菜单项数组
 * @param state 菜单状态
 */
export function applyMenuState(tagsViews: TagContextMenuItem[], state: TagMenuState): void {
  for (const [action, index] of Object.entries(TAG_MENU_INDEX) as Array<[TagMenuAction, number]>) {
    tagsViews[index].show = state[action].show;
    tagsViews[index].disabled = state[action].disabled;
  }
}

/**
 * 计算右键菜单相对容器的 left 偏移
 * @param clientX 鼠标 clientX
 * @param containerLeft 容器 left
 * @param containerWidth 容器宽度
 * @param menuMinWidth 菜单最小宽度
 * @returns left 值
 */
function resolveContextMenuLeft(
  clientX: number,
  containerLeft: number,
  containerWidth: number,
  menuMinWidth = 140
): number {
  const maxLeft = containerWidth - menuMinWidth;
  const left = clientX - containerLeft + 5;
  return Math.min(left, maxLeft);
}

/**
 * 根据鼠标与容器计算右键菜单定位
 * @param event 鼠标事件
 * @param container 标签栏容器
 * @param hiddenSideBar 是否隐藏侧栏（全屏内容区）
 * @returns left / top；无容器时 left 为 0
 */
export function positionContextMenu(
  event: MouseEvent,
  container: HTMLElement | undefined,
  hiddenSideBar: boolean
): { left: number; top: number } {
  let left = 0;
  if (container) {
    const rect = container.getBoundingClientRect();
    left = resolveContextMenuLeft(event.clientX, rect.left, container.offsetWidth);
  }
  return {
    left,
    top: hiddenSideBar ? event.clientY : event.clientY - 40,
  };
}
