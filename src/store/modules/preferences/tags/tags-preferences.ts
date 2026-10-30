import { type RouteConfigs, routerArrays } from '@/router/types';
import type { TagRouteItem } from '@/store/types';
import { defineStore } from 'pinia';
import { readSavedPreferences } from '../preferences-storage';
import { applyPushTag } from './tag-push-rules';

/** 标签页偏好状态 */
interface TagsPreferencesState {
  /** 当前页签 */
  multiTags: RouteConfigs[];
  /** 本机已有页签，路由初始化时不覆盖 */
  hasSavedTags: boolean;
}

/**
 * 判断是否为可持久化的标签项
 * @param value 未知值
 * @returns 是否可写入偏好
 */
function isPersistedTag(value: unknown): value is RouteConfigs {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const path = (value as RouteConfigs).path;
  return typeof path === 'string' && path.length > 0;
}

/**
 * 去掉不可 JSON 序列化的字段
 * @param tag 运行时标签
 * @returns 可写入本机的标签
 */
export function toPersistedTag(tag: RouteConfigs): RouteConfigs {
  const icon = tag.meta?.icon;
  return {
    path: tag.path,
    name: tag.name,
    query: tag.query,
    params: tag.params,
    meta: tag.meta
      ? {
          title: tag.meta.title,
          icon: typeof icon === 'string' ? icon : undefined,
          showLink: tag.meta.showLink,
          savedPosition: tag.meta.savedPosition,
        }
      : undefined,
  };
}

function readSavedTags(): Pick<TagsPreferencesState, 'multiTags' | 'hasSavedTags'> {
  const items = readSavedPreferences()?.multiTags;
  if (!Array.isArray(items)) {
    return { multiTags: [...routerArrays], hasSavedTags: false };
  }
  const tags = items.filter(isPersistedTag).map(toPersistedTag);
  if (tags.length === 0) {
    return { multiTags: [...routerArrays], hasSavedTags: false };
  }
  return { multiTags: tags, hasSavedTags: true };
}

/**
 * 标签页偏好 Store
 *
 * 当前标签列表放在本机，刷新后恢复
 */
export const useTagsPreferencesStore = defineStore('tags-preferences', {
  state: (): TagsPreferencesState => readSavedTags(),

  actions: {
    /** 替换页签列表 */
    setTags(tags: RouteConfigs[]): void {
      this.multiTags = tags;
      this.hasSavedTags = true;
    },

    /** 追加页签 */
    pushTag(tag: TagRouteItem): void {
      const next = applyPushTag(this.multiTags, tag);
      if (!next) {
        return;
      }
      this.multiTags = next;
      this.hasSavedTags = true;
    },
  },
});
