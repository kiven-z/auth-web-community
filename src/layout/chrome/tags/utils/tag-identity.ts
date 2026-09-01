import type { RouteConfigs } from '@/router/types';
import isEqual from 'lodash/isEqual';

/**
 * 标签稳定 key（path + query + params）
 * @param item 标签路由项
 * @returns key
 */
export function getTagItemKey(item: RouteConfigs): string {
  return `${item.path ?? ''}::${JSON.stringify(item.query ?? {})}::${JSON.stringify(item.params ?? {})}`;
}

/**
 * 两个标签是否指向同一路由实例
 * @param a 标签 A
 * @param b 标签 B
 * @returns 是否相同
 */
function isSameTag(a: RouteConfigs, b: Pick<RouteConfigs, 'path' | 'query' | 'params'>): boolean {
  return a.path === b.path && isEqual(a.query, b.query) && isEqual(a.params, b.params);
}

/**
 * 在标签列表中查找目标下标
 * @param tags 标签列表
 * @param target 目标标签
 * @returns 下标，未找到为 -1
 */
export function findTagIndex(tags: RouteConfigs[], target: Pick<RouteConfigs, 'path' | 'query' | 'params'>): number {
  return tags.findIndex((item) => isSameTag(item, target));
}
