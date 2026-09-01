/** 弹层内容可暴露的首焦入口（特殊控件无法用 DOM 首焦时） */
export interface OverlayContentExpose {
  focusTarget?: () => void;
}

/** 内容区内可聚焦控件选择器（EP 输入 / 原生控件） */
const FOCUSABLE_SELECTOR = [
  'input:not([disabled]):not([type="hidden"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[contenteditable="true"]',
  '.el-input__inner:not([disabled])',
  '.el-textarea__inner:not([disabled])',
].join(', ');

/**
 * FocusTrap 完成后，将焦点落到内容区首个可聚焦控件（或 expose.focusTarget）
 * @param root 弹层内容根节点
 * @param content 内容组件实例（可选）
 */
export function focusOverlayContent(root: HTMLElement | null | undefined, content?: OverlayContentExpose | null) {
  if (content && typeof content.focusTarget === 'function') {
    content.focusTarget();
    return;
  }
  if (!root) {
    return;
  }
  const target = root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  target?.focus();
}
