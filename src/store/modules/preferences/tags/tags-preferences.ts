import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import { schedulePreferenceSync } from '@/core/preferences/persistence/sync';
import { type RouteConfigs, routerArrays } from '@/router/types';
import { defineStore } from 'pinia';
import type { TagRouteItem, TagSplicePosition } from '@/store/types';
import { applyPushTag } from './tag-push-rules';

/**
 * 标签页偏好 Store（ui.tags）：当前标签列表 + 是否跨浏览器恢复。
 * features / components 禁止直接依赖。
 */
export const useTagsPreferencesStore = defineStore('tags-preferences', {
  state: () => ({
    multiTags: [...routerArrays] as Array<RouteConfigs>,
    enabled: true,
  }),
  actions: {
    /**
     * 切换是否记住页签并落库（enabled 由 tags 域持久化，关闭也写回）
     * @param value 是否记住标签
     */
    setEnabled(value: boolean) {
      this.enabled = value;
      schedulePreferenceSync(UI_PREFERENCE_KEYS.TAGS);
    },

    /**
     * hydrate 完成后灌入服务端标签（不触发写回；由调用方保证处于 hydrate 或已停同步）
     * @param enabled 是否启用记住标签
     * @param tags 服务端标签；缺省或空则保留当前（通常为首页）
     */
    hydrateTags(enabled: boolean, tags?: RouteConfigs[]) {
      this.enabled = enabled;
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
     * 开启记住标签时，调度服务端同步当前标签列表
     */
    persistTagsCache() {
      if (!this.enabled) {
        return;
      }
      schedulePreferenceSync(UI_PREFERENCE_KEYS.TAGS);
    },
  },
});
