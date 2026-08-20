import { message } from '@/services/feedback/message';
import { toStableKey } from '@/shared/utils/string/toStableKey';

/**
 * 判断值是否为空，不可复制。
 */
function isEmptyCopyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
}

/**
 * 将任意值转为可写入剪贴板的文本。
 */
function toCopyText(value: unknown): string {
  // 对象优先 JSON 序列化，避免把 `[object Object]` 直接写入剪贴板
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  return toStableKey(value);
}

/**
 * 非安全上下文（如 http://IP）下 Clipboard API 不可用，用 execCommand 兜底。
 */
function copyTextWithExecCommand(text: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  let success = false;
  try {
    // 非 HTTPS 场景无 Clipboard API，execCommand 为唯一可用降级路径
    // NOSONAR typescript:S1874
    success = document.execCommand('copy');
  } catch {
    success = false;
  } finally {
    textarea.remove();
  }

  return success;
}

/**
 * 写入剪贴板：优先 Clipboard API，失败或非安全上下文时降级 execCommand。
 * @param text 纯文本
 * @returns 是否写入成功
 */
async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 权限拒绝或非安全上下文等场景，继续尝试 execCommand
    }
  }

  return copyTextWithExecCommand(text);
}

/**
 * 复制值到剪贴板，并给出成功/失败提示。
 * @param value 待复制值
 * @returns 是否复制成功；空值直接返回 false
 */
export async function copyToClipboard(value: unknown): Promise<boolean> {
  if (isEmptyCopyValue(value)) {
    return false;
  }

  const text = toCopyText(value);
  if (!text) return false;

  const success = await copyTextToClipboard(text);
  if (success) {
    message('复制成功', { type: 'success' });
  } else {
    message('复制失败', { type: 'error' });
  }
  return success;
}
