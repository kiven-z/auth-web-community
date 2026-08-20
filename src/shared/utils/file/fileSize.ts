/**
 * 将字节大小格式化为可读文案。
 * @param sizeInByte 文件大小（字节）
 * @returns 格式化后的字符串
 */
export function formatFileSize(sizeInByte?: number): string {
  if (sizeInByte === undefined || sizeInByte === null || Number.isNaN(sizeInByte)) {
    return '—';
  }
  if (sizeInByte < 1024) {
    return `${sizeInByte} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = sizeInByte / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}
