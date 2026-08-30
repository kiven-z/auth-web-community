import { isUrl } from '@/shared/utils/url/url';
import type { Router } from 'vue-router';
import { APP_TITLE } from '@/core/config/appConfig';
import { transformI18n } from '@/app/plugins/i18n';

/**
 * 页面标题守卫：根据路由 meta.title 动态修改浏览器 document.title。
 */
export function createTitleGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const externalLink = isUrl(to?.name as string);

    if (!externalLink) {
      to.matched.some((item) => {
        const title = item.meta.title;
        if (!title) {
          return false;
        }
        document.title = `${transformI18n(title)} | ${APP_TITLE}`;
        return true;
      });
    }

    next();
  });
}
