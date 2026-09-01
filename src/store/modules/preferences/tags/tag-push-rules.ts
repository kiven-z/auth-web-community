import type { RouteConfigs } from '@/router/types';
import type { TagRouteItem } from '@/store/types';
import { isUrl } from '@/shared/utils/url/url';
import isBoolean from 'lodash/isBoolean';
import isEqual from 'lodash/isEqual';

/**
 * 是否应跳过 push（隐藏标签、外链、空标题、showLink 为 false）
 */
export function shouldSkipPush(tag: TagRouteItem): boolean {
  if (tag?.meta?.hiddenTag) {
    return true;
  }
  if (typeof tag?.name === 'string' && isUrl(tag.name)) {
    return true;
  }
  if (tag?.meta?.title?.length === 0) {
    return true;
  }
  return isBoolean(tag?.meta?.showLink) && !tag?.meta?.showLink;
}

/**
 * 是否与已有标签重复（path + query + params）
 */
export function isDuplicateTag(tags: RouteConfigs[], tag: TagRouteItem): boolean {
  return tags.some((existing) => {
    return existing.path === tag.path && isEqual(existing?.query, tag?.query) && isEqual(existing?.params, tag?.params);
  });
}

/**
 * dynamicLevel 超限时移除同 path 的第一个标签
 */
export function trimBeforePush(tags: RouteConfigs[], tag: TagRouteItem): RouteConfigs[] {
  const dynamicLevel = tag?.meta?.dynamicLevel ?? -1;
  if (dynamicLevel <= 0) {
    return tags;
  }
  const tagPath = tag.path;
  if (tags.filter((item) => item?.path === tagPath).length < dynamicLevel) {
    return tags;
  }
  const index = tags.findIndex((item) => item?.path === tagPath);
  if (index === -1) {
    return tags;
  }
  const next = [...tags];
  next.splice(index, 1);
  return next;
}

/**
 * 计算 push 后的标签列表；无需 push 时返回 null
 */
export function applyPushTag(tags: RouteConfigs[], tag: TagRouteItem): RouteConfigs[] | null {
  if (shouldSkipPush(tag) || isDuplicateTag(tags, tag)) {
    return null;
  }
  const next = trimBeforePush(tags, tag);
  return [...next, tag as RouteConfigs];
}
