import type { RouteConfigs } from '@/layout/types';

/** 服务端 ui.tags 配置值形态 */
interface UiTagsPreferenceValue {
  items: RouteConfigs[];
}

/**
 * 判断是否为可持久化的标签项（至少含 path）
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
 * 去掉不可 JSON 序列化的字段（如函数型 icon），得到可 upsert 的标签
 * @param tag 运行时标签
 * @returns 可持久化标签
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

/**
 * 从服务端 configValue 解析标签列表
 * @param configValue ui.tags 对象
 * @returns 规范化后的标签数组
 */
export function parseTagsPreferenceValue(configValue: Record<string, unknown>): RouteConfigs[] {
  const items = configValue.items;
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter(isPersistedTag).map(toPersistedTag);
}

/**
 * 组装 upsert 用的 ui.tags 配置值
 * @param tags 当前标签
 * @returns `{ items }` 对象
 */
export function buildTagsPreferenceValue(tags: RouteConfigs[]): UiTagsPreferenceValue {
  return { items: tags.map(toPersistedTag) };
}
