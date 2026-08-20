import dayjs, { type ConfigType } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/** 导出文件名时间戳格式 */
export const EXPORT_FILENAME_STAMP_FORMAT = 'YYYYMMDDHHmmss';

/** 展示用日期时间格式 */
export const DISPLAY_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/** 瞬时点日期选择器 value-format */
export const INSTANT_PICKER_VALUE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

/** 调度墙钟日期选择器 value-format */
export const WALL_CLOCK_PICKER_VALUE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

/**
 * 格式化日期时间
 * @param value 时间值
 * @param pattern 展示格式，默认 YYYY-MM-DD HH:mm:ss
 * @returns 展示文案；无效值返回 —
 */
export function formatDateTime(value?: unknown, pattern: string = DISPLAY_DATETIME_FORMAT): string {
  // dayjs(undefined) 会得到当前时间，空值须先拦截
  if (
    value == null ||
    value === '' ||
    (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date))
  ) {
    return '-';
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(pattern) : '-';
}

/**
 * 生成导出文件名时间戳（UTC，与后端 FileDownloadNames 一致）
 * @param time 基准时间，默认当前时刻
 * @returns 形如 20250628153045 的时间戳片段
 */
export function buildExportFilenameStamp(time?: ConfigType): string {
  const parsed = time == null ? dayjs() : dayjs(time);
  return (parsed.isValid() ? parsed : dayjs()).utc().format(EXPORT_FILENAME_STAMP_FORMAT);
}
