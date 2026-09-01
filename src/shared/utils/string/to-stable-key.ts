/**
 * 将标量收成稳定字符串 key；非 string/number/boolean 返回空串，避免 `[object Object]`。
 * @param value 待转换值
 */
export function toStableKey(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return '';
}
