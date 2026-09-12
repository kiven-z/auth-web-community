import type { RouteConfigs } from '@/router/types';
import {
  TAG_MENU_DEFS,
  TagMenuAction,
  type TagContextMenuItem,
  type TagMenuDefinition,
  type TagMenuGroup,
} from '../constants/tag-menu';
import { isSameTag } from '@/store/modules/preferences/tags/tag-push-rules';
import { isFixedTagMeta } from './fixed-tag';

/** 右键菜单计算上下文 */
interface TagMenuContext {
  tag: RouteConfigs;
  route: { path?: string; query?: object; params?: object };
  tags: RouteConfigs[];
  topPath?: string;
  contentFullscreen: boolean;
}

/**
 * 该标签是否允许关闭类动作
 * @param tags 标签列表
 * @param index 目标下标
 * @param tag 目标标签
 * @param topPath 首页 path
 * @returns 是否可关
 */
function canCloseTag(tags: RouteConfigs[], index: number, tag: RouteConfigs, topPath?: string): boolean {
  if (index <= 0) {
    return false;
  }
  if (topPath && tag.path === `/redirect${topPath}`) {
    return false;
  }
  return !isFixedTagMeta(tags[index]?.meta);
}

/**
 * 各动作是否出现在菜单中
 * @param ctx 菜单上下文
 * @param index 目标下标
 * @param canClose 是否可关
 * @returns 动作 → 是否可见
 */
function actionAvailability(ctx: TagMenuContext, index: number, canClose: boolean): Record<TagMenuAction, boolean> {
  const { tag, route, tags } = ctx;
  return {
    [TagMenuAction.Reload]: isSameTag(tag, route),
    [TagMenuAction.Close]: canClose,
    [TagMenuAction.CloseLeft]: canClose && tags.slice(1, index).some((item) => !isFixedTagMeta(item.meta)),
    [TagMenuAction.CloseRight]: canClose && index < tags.length - 1,
    [TagMenuAction.CloseOther]: canClose && tags.some((item, i) => i !== index && i > 0 && !isFixedTagMeta(item.meta)),
    [TagMenuAction.CloseAll]: canClose,
    [TagMenuAction.Fullscreen]: true,
  };
}

/**
 * 全屏项文案：进入或退出
 * @param def 静态定义
 * @param contentFullscreen 是否已全屏
 * @returns i18n key
 */
function resolveLabelKey(def: TagMenuDefinition, contentFullscreen: boolean): string {
  if (def.action === TagMenuAction.Fullscreen && contentFullscreen) {
    return 'buttons.contentExitFullScreen';
  }
  return def.labelKey;
}

/**
 * 按右击标签派生可见菜单项（不可用项隐藏）
 * @param ctx 当前标签与路由上下文
 * @returns 可见菜单项
 */
export function resolveTagMenuItems(ctx: TagMenuContext): TagContextMenuItem[] {
  const index = ctx.tags.findIndex((item) => isSameTag(item, ctx.tag));
  const available = actionAvailability(ctx, index, canCloseTag(ctx.tags, index, ctx.tag, ctx.topPath));

  const items: TagContextMenuItem[] = [];
  let lastGroup: TagMenuGroup | undefined;
  for (const def of TAG_MENU_DEFS) {
    if (!available[def.action]) {
      continue;
    }
    items.push({
      action: def.action,
      labelKey: resolveLabelKey(def, ctx.contentFullscreen),
      divided: lastGroup !== undefined && lastGroup !== def.group,
    });
    lastGroup = def.group;
  }
  return items;
}
