/** Iconify 图标属性，见 https://docs.iconify.design/icon-components/vue/#properties */
export interface IconProps {
  inline?: boolean;
  width?: string | number;
  height?: string | number;
  horizontalFlip?: boolean;
  verticalFlip?: boolean;
  flip?: string;
  rotate?: number | string;
  color?: string;
  horizontalAlign?: boolean;
  verticalAlign?: boolean;
  align?: string;
  onLoad?: Function;
  includes?: Function;
  /** SVG fill，其余 SVG 属性按需扩展 */
  fill?: string;
  style?: object;
}
