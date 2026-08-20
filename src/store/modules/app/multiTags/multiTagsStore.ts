import { DEFAULT_MULTI_TAGS_CACHE } from '@/core/preferences/defaults/preference-defaults';
import { getConfigureSnapshot, replaceTags } from '@/core/preferences/persistence/storage';
import { type RouteConfigs, routerArrays } from '@/layout/types';
import { defineStore } from 'pinia';
import type { TagRouteItem, TagSplicePosition } from '@/store/types';
import { applyPushTag } from './tagPushRules';

export const useMultiTagsStore = defineStore('multi-tags', {
  state: () => ({
    multiTags: [...routerArrays] as Array<RouteConfigs>,
    multiTagsCache: getConfigureSnapshot().multiTagsCache ?? DEFAULT_MULTI_TAGS_CACHE,
  }),
  getters: {
    getMultiTagsCache(state) {
      return state.multiTagsCache;
    },
  },
  actions: {
    /**
     * 切换是否将打开的标签同步到服务端（跨浏览器恢复）
     * @param multiTagsCache 是否记住标签
     */
    multiTagsCacheChange(multiTagsCache: boolean) {
      this.multiTagsCache = multiTagsCache;
      if (multiTagsCache) {
        this.persistTagsCache();
      }
    },

    /**
     * hydrate 完成后灌入服务端标签（不触发写回；由调用方保证处于 hydrate 或已停同步）
     * @param enabled 是否启用记住标签
     * @param tags 服务端标签；缺省或空则保留当前（通常为首页）
     */
    hydrateTags(enabled: boolean, tags?: RouteConfigs[]) {
      this.multiTagsCache = enabled;
      if (enabled && tags && tags.length > 0) {
        this.multiTags = tags;
      }
    },

    setTags(tags: RouteConfigs[]) {
      this.multiTags = tags;
      this.persistTagsCache();
    },
    pushTag(tag: TagRouteItem) {
      const next = applyPushTag(this.multiTags, tag);
      if (!next) {
        return;
      }
      this.multiTags = next;
      this.persistTagsCache();
    },
    removeTags(position: TagSplicePosition) {
      this.multiTags.splice(position?.startIndex, position?.length);
      this.persistTagsCache();
      return this.multiTags;
    },
    getLastTag() {
      return this.multiTags.slice(-1);
    },
    /**
     * 开启记住标签时，将当前标签写入偏好内存并调度服务端同步
     */
    persistTagsCache() {
      if (!this.getMultiTagsCache) {
        return;
      }
      replaceTags(this.multiTags);
    },
  },
});
