import type { FunctionalComponent } from 'vue';
import type { TagMenuAction } from './constants/tagMenu';

/** 标签页右键 / 下拉菜单项 */
export interface TagContextMenuItem {
  icon: string | FunctionalComponent;
  text: string;
  divided: boolean;
  disabled: boolean;
  show: boolean;
}

/** 单个菜单项显隐与禁用态 */
interface TagMenuItemState {
  show: boolean;
  disabled: boolean;
}

/** 右键 / 下拉菜单完整状态 */
export type TagMenuState = Record<TagMenuAction, TagMenuItemState>;

/** 标签关闭范围 */
export type CloseScope = 'current' | 'left' | 'right' | 'other' | 'all';
