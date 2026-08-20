import type { RouteConfigs } from '@/layout/types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { CLOSE_MENU_ACTIONS, TagMenuAction } from '../constants/tagMenu';
import type { TagMenuState } from '../types';
import { isFixedTagMeta } from './fixedTag';

interface ComputeMenuStateInput {
  tags: RouteConfigs[];
  currentPath: string;
  query?: object;
  params?: object;
  topPath?: string;
}

/**
 * 按 path、query、params 解析当前标签在列表中的下标
 * @param tags 标签列表
 * @param currentPath 当前 path 或 fullPath
 * @param query query
 * @param params params
 * @returns 下标；未命中为 -1
 */
export function resolveTagIndex(
  tags: RouteConfigs[],
  currentPath: string,
  query: object = {},
  params: object = {}
): number {
  if (!isEmpty(params)) {
    return tags.findIndex((item) => isEqual(item.params, params));
  }
  if (isEmpty(query)) {
    return tags.findIndex((item) => item.path === currentPath);
  }
  return tags.findIndex((item) => isEqual(item.query, query));
}

/**
 * 计算下拉菜单各动作的禁用态（show 恒为 true，由 dropdown 的 disabled 控制）
 * @param input 当前标签上下文
 * @returns 菜单状态
 */
export function computeMenuState(input: ComputeMenuStateInput): TagMenuState {
  const { tags, currentPath, query = {}, params = {}, topPath } = input;
  const index = resolveTagIndex(tags, currentPath, query, params);
  const isHome = index <= 0 || (!!topPath && currentPath === `/redirect${topPath}`);
  const canClose = !isHome && !isFixedTagMeta(tags[index]?.meta);
  const canLeft = canClose && tags.slice(1, index).some((item) => !isFixedTagMeta(item.meta));
  const canRight = canClose && index < tags.length - 1;
  const canOther = canClose && tags.some((item, i) => i !== index && i > 0 && !isFixedTagMeta(item.meta));

  return {
    [TagMenuAction.Reload]: { show: true, disabled: false },
    [TagMenuAction.Close]: { show: true, disabled: !canClose },
    [TagMenuAction.CloseLeft]: { show: true, disabled: !canLeft },
    [TagMenuAction.CloseRight]: { show: true, disabled: !canRight },
    [TagMenuAction.CloseOther]: { show: true, disabled: !canOther },
    [TagMenuAction.CloseAll]: { show: true, disabled: !canClose },
    [TagMenuAction.Fullscreen]: { show: true, disabled: false },
  };
}

interface ResolveContextMenuStateInput {
  tag: RouteConfigs;
  route: RouteLocationNormalizedLoaded;
  tags: RouteConfigs[];
  topPath?: string;
}

/**
 * 右键菜单状态：关闭类不可做则隐藏；非当前路由隐藏刷新
 * @param input 当前标签与路由上下文
 * @returns 菜单状态
 */
export function resolveContextMenuState(input: ResolveContextMenuStateInput): TagMenuState {
  const { tag, route, tags, topPath } = input;
  const state = computeMenuState({
    tags,
    currentPath: tag.path ?? '',
    query: tag.query,
    params: tag.params,
    topPath,
  });

  state[TagMenuAction.Reload].show = route.path === tag.path || route.name === tag.name;
  for (const action of CLOSE_MENU_ACTIONS) {
    state[action].show = !state[action].disabled;
  }
  return state;
}
