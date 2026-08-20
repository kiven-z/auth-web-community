import type { Component, VNode } from 'vue';
import type { IconProps } from '@/components/ui/Icon';

/** 分段控制器选项 */
export interface OptionsType {
  /** 文字 */
  label?: string | (() => VNode | Component);
  /**
   * @description 图标，采用平台内置的 useRenderIcon 函数渲染
   * Segmented 选项类型
   */
  icon?: string | Component;
  /** 图标属性、样式配置 */
  iconAttrs?: IconProps;
  /** 值 */
  value?: any;
  /** 是否禁用 */
  disabled?: boolean;
  /** tooltip 提示 */
  tip?: string;
}
