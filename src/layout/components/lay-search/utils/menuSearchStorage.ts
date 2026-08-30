import { MENU_SEARCH_COLLECT_TYPE, MENU_SEARCH_HISTORY_TYPE } from '../constants';
import type { MenuSearchOption } from '../types';

/**
 * 将历史项置顶（最近访问）
 * @param list 历史列表
 * @param path 目标 path
 * @returns 新列表
 */
export function promoteHistoryEntry(list: MenuSearchOption[], path: string): MenuSearchOption[] {
  const index = list.findIndex((item) => item.path === path);
  if (index === -1) {
    return list;
  }

  const next = [...list];
  const [item] = next.splice(index, 1);
  next.unshift(item);
  return next;
}

/**
 * 写入搜索历史（已收藏项不重复写入）
 * @param history 当前历史
 * @param collect 当前收藏
 * @param entry path 与 meta
 * @param max 历史上限
 * @returns 新历史列表
 */
export function recordSearchHistory(
  history: MenuSearchOption[],
  collect: MenuSearchOption[],
  entry: { path: string; meta: MenuSearchOption['meta'] },
  max: number
): MenuSearchOption[] {
  if (collect.some((item) => item.path === entry.path)) {
    return history;
  }

  const next = history.filter((item) => item.path !== entry.path);
  if (next.length >= max) {
    next.pop();
  }
  next.unshift({ path: entry.path, meta: entry.meta, type: MENU_SEARCH_HISTORY_TYPE });
  return next;
}

/**
 * 收藏项：从历史移除并加入收藏（去重）
 * @param history 当前历史
 * @param collect 当前收藏
 * @param item 待收藏项
 * @returns 更新后的历史与收藏
 */
export function collectHistoryItem(
  history: MenuSearchOption[],
  collect: MenuSearchOption[],
  item: MenuSearchOption
): { history: MenuSearchOption[]; collect: MenuSearchOption[] } {
  const nextHistory = history.filter((historyItem) => historyItem.path !== item.path);
  if (collect.some((collectItem) => collectItem.path === item.path)) {
    return { history: nextHistory, collect };
  }

  return {
    history: nextHistory,
    collect: [{ ...item, type: MENU_SEARCH_COLLECT_TYPE }, ...collect],
  };
}

/**
 * 拖拽调整收藏顺序
 * @param list 收藏列表
 * @param oldIndex 原索引
 * @param newIndex 新索引
 * @returns 新列表
 */
export function reorderCollectList(list: MenuSearchOption[], oldIndex: number, newIndex: number): MenuSearchOption[] {
  const next = [...list];
  const [item] = next.splice(oldIndex, 1);
  next.splice(newIndex, 0, item);
  return next;
}
