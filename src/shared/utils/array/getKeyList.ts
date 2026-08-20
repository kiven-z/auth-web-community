/**
 * 从对象数组提取某字段值列表（默认去重）
 * @param list 源数组
 * @param key 字段名
 * @param unique 是否去重，默认 true
 * @returns 字段值数组
 */
export function getKeyList<T extends object, K extends keyof T>(
  list: ReadonlyArray<T>,
  key: K,
  unique = true
): Array<NonNullable<T[K]>> {
  const values: Array<NonNullable<T[K]>> = [];
  for (const item of list) {
    const value = item[key];
    if (value !== undefined && value !== null) {
      values.push(value);
    }
  }
  return unique ? Array.from(new Set(values)) : values;
}
