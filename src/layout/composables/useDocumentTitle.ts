import { getConfig } from '@/auth/config';
import { transformI18n } from '@/app/plugins/i18n';
import type { RouteMeta } from '@/layout/types';

/**
 * 根据路由 meta 更新浏览器标题
 * @param meta 路由 meta（含 i18n title）
 */
export function changeDocumentTitle(meta: RouteMeta): void {
  const appTitle = getConfig().Title;
  const pageTitle = transformI18n(meta.title);
  document.title = appTitle ? `${pageTitle} | ${appTitle}` : pageTitle;
}
