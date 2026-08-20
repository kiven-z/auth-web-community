import { getConfig } from '@/auth/config';
import { transformI18n } from '@/app/plugins/i18n';
import { isUrl } from '@/shared/utils/url/url';
import type { Router } from 'vue-router';

/**
 * 页面标题守卫：根据路由 meta.title 动态修改浏览器 document.title。
 */
export function createTitleGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const externalLink = isUrl(to?.name as string);

    if (!externalLink) {
      to.matched.some((item) => {
        if (!item.meta.title) return '';
        const Title = getConfig().Title;
        if (Title) document.title = `${transformI18n(item.meta.title)} | ${Title}`;
        else document.title = transformI18n(item.meta.title);
      });
    }

    next();
  });
}
