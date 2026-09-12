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
 * 根据鼠标与标签栏容器计算右键菜单定位
 * @param event 鼠标事件
 * @param container 标签栏容器
 * @returns left / top；无容器时均为 0
 */
export function positionContextMenu(
  event: MouseEvent,
  container: HTMLElement | undefined
): { left: number; top: number } {
  if (!container) {
    return { left: 0, top: 0 };
  }
  const rect = container.getBoundingClientRect();
  return {
    left: resolveContextMenuLeft(event.clientX, rect.left, container.offsetWidth),
    top: event.clientY - rect.top,
  };
}
