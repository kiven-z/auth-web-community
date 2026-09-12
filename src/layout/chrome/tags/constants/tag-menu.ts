/** 标签右键菜单动作 */
export enum TagMenuAction {
  Reload = 'reload',
  Close = 'close',
  CloseLeft = 'closeLeft',
  CloseRight = 'closeRight',
  CloseOther = 'closeOther',
  CloseAll = 'closeAll',
  Fullscreen = 'fullscreen',
}

/** 菜单分组（相邻不同组之间画分隔线） */
export type TagMenuGroup = 'page' | 'close' | 'layout';

/** 菜单项静态定义 */
export interface TagMenuDefinition {
  action: TagMenuAction;
  group: TagMenuGroup;
  labelKey: string;
}

/** 标签页右键菜单可见项 */
export interface TagContextMenuItem {
  action: TagMenuAction;
  labelKey: string;
  divided: boolean;
}

/** 右键菜单声明（打开时按策略过滤） */
export const TAG_MENU_DEFS: readonly TagMenuDefinition[] = [
  { action: TagMenuAction.Reload, group: 'page', labelKey: 'buttons.reload' },
  { action: TagMenuAction.Close, group: 'close', labelKey: 'buttons.closeCurrentTab' },
  { action: TagMenuAction.CloseLeft, group: 'close', labelKey: 'buttons.closeLeftTabs' },
  { action: TagMenuAction.CloseRight, group: 'close', labelKey: 'buttons.closeRightTabs' },
  { action: TagMenuAction.CloseOther, group: 'close', labelKey: 'buttons.closeOtherTabs' },
  { action: TagMenuAction.CloseAll, group: 'close', labelKey: 'buttons.closeAllTabs' },
  { action: TagMenuAction.Fullscreen, group: 'layout', labelKey: 'buttons.contentFullScreen' },
];
