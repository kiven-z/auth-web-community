import type { RouteConfigs } from '@/layout/types';
import type { Router } from 'vue-router';

/**
 * 跳转到标签对应路由
 * @param router 路由实例
 * @param tag 标签
 */
export function navigateToTag(router: Router, tag?: RouteConfigs): void {
  if (!tag) {
    return;
  }
  const { name, path } = tag;
  if (name) {
    if (tag.query) {
      router.push({ name, query: tag.query as Record<string, string> });
      return;
    }
    if (tag.params) {
      router.push({ name, params: tag.params as Record<string, string> });
      return;
    }
    router.push({ name });
    return;
  }
  router.push({ path });
}
