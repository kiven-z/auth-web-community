/** 统计数字语义色 */
export type StatMetricTone = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

/** StatMetricCard 入参 */
export interface StatMetricCardProps {
  /** 指标标题 */
  title: string;
  /** 目标数值 */
  value: number;
  /** 小数位，默认 0 */
  precision?: number;
  /** 数值后缀 */
  suffix?: string;
  /** 底部说明（如占比） */
  footer?: string;
  /** 数值语义色 */
  tone?: StatMetricTone;
  /** 是否可点击跳转 */
  clickable?: boolean;
  /** 标题旁提示 */
  tooltip?: string;
  /** 数字滚动时长（毫秒） */
  duration?: number;
}
