import type { RouteConfigs, RouteMeta } from '@/layout/types';
import isBoolean from 'lodash/isBoolean';

/** 路由 meta 上的固定标签标记（类型未收口前局部读取） */
type MetaWithFixedTag = RouteMeta & { fixedTag?: boolean };

/**
 * 是否固定标签 meta
 * @param meta 路由 meta
 * @returns 是否固定
 */
export function isFixedTagMeta(meta?: RouteMeta): boolean {
  const fixedTag = (meta as MetaWithFixedTag | undefined)?.fixedTag;
  return isBoolean(fixedTag) && fixedTag;
}

/**
 * 是否固定标签项
 * @param item 标签项
 * @returns 是否固定
 */
export function isFixedTagItem(item?: RouteConfigs): boolean {
  return isFixedTagMeta(item?.meta);
}

/**
 * 组装固定标签列表（首页固定 + 路由 meta.fixedTag）
 * @param homeFixedTags routerArrays
 * @param flatteningRoutes 扁平路由
 * @returns 固定标签
 */
export function buildFixedTags(homeFixedTags: RouteConfigs[], flatteningRoutes: RouteConfigs[]): RouteConfigs[] {
  return [...homeFixedTags, ...flatteningRoutes.filter((item) => isFixedTagMeta(item?.meta))];
}
