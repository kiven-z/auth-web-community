/**
 * 元素是否包含指定 class
 * @param element 目标元素
 * @param className class 名
 * @returns 是否包含
 */
export function hasClass(element: Element | null | undefined, className: string): boolean {
  if (!element || !className) {
    return false;
  }
  return element.classList.contains(className);
}

/**
 * 按开关添加或移除 class
 * @param enabled true 添加，false 移除
 * @param className class 名
 * @param element 目标元素；省略时为 document.body
 */
export function toggleClass(
  enabled: boolean,
  className: string,
  element: Element | null | undefined = document.body
): void {
  if (!element || !className) {
    return;
  }
  element.classList.toggle(className, enabled);
}
