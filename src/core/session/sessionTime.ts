import { DISPLAY_DATETIME_FORMAT } from '@/shared/utils/date/dateTime';
import dayjs from 'dayjs';

/**
 * 将毫秒时间戳格式化为展示文案
 * @param value 毫秒时间戳
 * @param pattern 格式，默认 YYYY-MM-DD HH:mm:ss
 * @returns 展示文案，无效值返回 —
 */
export function formatMillisTimestamp(value: number | null | undefined, pattern = DISPLAY_DATETIME_FORMAT): string {
  if (value == null || value <= 0) {
    return '-';
  }
  return dayjs(value).format(pattern);
}

/**
 * 将过期时间转为毫秒时间戳
 * @param expires 过期时间
 * @returns 毫秒时间戳
 */
export function toExpiresTimestamp(expires: string | number | undefined | null): number {
  if (expires === undefined || expires === null) {
    return 0;
  }
  if (typeof expires === 'number') {
    return expires;
  }
  const parsed = dayjs(expires);
  return parsed.isValid() ? parsed.valueOf() : 0;
}

/**
 * 解析会话过期时间：未提供时默认 8 小时后过期。
 * @param expires 过期时间
 * @returns 毫秒时间戳
 */
export function resolveSessionExpires(expires: string | number | undefined | null): number {
  const source = expires ?? Date.now() + 8 * 3600000;
  return toExpiresTimestamp(source);
}
