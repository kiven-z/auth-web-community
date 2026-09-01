/**
 * 解析个人空间返回目标：来源页 → 首页
 */
export function resolvePersonalBackTarget(historyFrom: unknown): string {
  if (typeof historyFrom === 'string' && historyFrom.startsWith('/')) {
    return historyFrom;
  }
  return '/';
}
