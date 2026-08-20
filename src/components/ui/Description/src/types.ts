export type Row = Record<string, any>;
export type RowKey = string | number;
import type { DescriptionItemProps } from 'element-plus';

/**
 * 描述项属性
 */
export interface ColumnProps extends Partial<DescriptionItemProps> {
  label: string;
  /** 支持 lodash path，如 `a.b.c` */
  prop: string;
  copy?: boolean;
  cellRenderer?: (params: { value: any; data: Row | Row[]; index: number; row: Row }) => any;
  labelRenderer?: (params: { data: Row | Row[] }) => any;
  [key: string]: any;
}

export type RowKeyProp = string | ((row: Row, index: number) => RowKey);
