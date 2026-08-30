import { APP_MENU_SEARCH_HISTORY } from '@/core/config/appConfig';
import { storageLocal } from '@/core/storage/storageLocal';
import type { Ref, ShallowRef } from 'vue';

import { MENU_SEARCH_COLLECT_KEY, MENU_SEARCH_HISTORY_KEY, MENU_SEARCH_HISTORY_TYPE } from '../constants';
import type { MenuSearchDrag, MenuSearchOption } from '../types';
import {
  collectHistoryItem,
  promoteHistoryEntry,
  recordSearchHistory,
  reorderCollectList,
} from '../utils/menuSearchStorage';

function readStorage(key: string): MenuSearchOption[] {
  return storageLocal().getItem<MenuSearchOption[]>(key) || [];
}

function writeStorage(key: string, value: MenuSearchOption[]) {
  storageLocal().setItem(key, value);
}

function bumpHistoryAccess(path: string) {
  const next = promoteHistoryEntry(readStorage(MENU_SEARCH_HISTORY_KEY), path);
  writeStorage(MENU_SEARCH_HISTORY_KEY, next);
}

interface UseMenuSearchHistoryOptions {
  historyOptions: ShallowRef<MenuSearchOption[]>;
  historyPath: Ref<string>;
}

/**
 * 菜单搜索历史与收藏：localStorage 读写
 * @param options 历史展示状态
 * @returns 历史操作方法
 */
export function useMenuSearchHistory(options: UseMenuSearchHistoryOptions) {
  const historyLimit = APP_MENU_SEARCH_HISTORY;

  function refreshHistoryOptions() {
    const history = readStorage(MENU_SEARCH_HISTORY_KEY);
    const collect = readStorage(MENU_SEARCH_COLLECT_KEY);
    options.historyOptions.value = [...history, ...collect];
    options.historyPath.value = options.historyOptions.value[0]?.path ?? '';
  }

  function removeItem(item: MenuSearchOption) {
    const key = item.type === MENU_SEARCH_HISTORY_TYPE ? MENU_SEARCH_HISTORY_KEY : MENU_SEARCH_COLLECT_KEY;
    const list = readStorage(key).filter((listItem) => listItem.path !== item.path);
    writeStorage(key, list);
    refreshHistoryOptions();
  }

  function collectItem(item: MenuSearchOption) {
    const { history, collect } = collectHistoryItem(
      readStorage(MENU_SEARCH_HISTORY_KEY),
      readStorage(MENU_SEARCH_COLLECT_KEY),
      item
    );
    writeStorage(MENU_SEARCH_HISTORY_KEY, history);
    writeStorage(MENU_SEARCH_COLLECT_KEY, collect);
    refreshHistoryOptions();
  }

  function saveSearchResult(path: string, meta: MenuSearchOption['meta']) {
    const history = readStorage(MENU_SEARCH_HISTORY_KEY);
    const collect = readStorage(MENU_SEARCH_COLLECT_KEY);
    const next = recordSearchHistory(history, collect, { path, meta }, historyLimit);
    writeStorage(MENU_SEARCH_HISTORY_KEY, next);
  }

  function reorderCollect(drag: MenuSearchDrag) {
    const collect = reorderCollectList(readStorage(MENU_SEARCH_COLLECT_KEY), drag.oldIndex, drag.newIndex);
    writeStorage(MENU_SEARCH_COLLECT_KEY, collect);
    options.historyOptions.value = [...readStorage(MENU_SEARCH_HISTORY_KEY), ...collect];
    options.historyPath.value = collect[drag.newIndex]?.path ?? options.historyPath.value;
  }

  return {
    refreshHistoryOptions,
    removeItem,
    collectItem,
    saveSearchResult,
    bumpHistoryAccess,
    reorderCollect,
  };
}
