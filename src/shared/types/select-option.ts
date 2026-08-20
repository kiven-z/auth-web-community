import type { TagProps } from 'element-plus';

/** ElTag type，与 element-plus TagProps 一致 */
export type ElTagType = NonNullable<TagProps['type']>;

/** 普通下拉 / 筛选项 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
}

/** 带 Tag 样式的筛选项 */
export interface TagSelectOption<T = string> {
  value: T;
  label: string;
  tagType: ElTagType;
}
