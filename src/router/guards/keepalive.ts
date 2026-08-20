import { handleAliveRoute } from '@/router/utils/misc';
import type { Router } from 'vue-router';

/**
 * KeepAlive 缓存守卫：管理页面组件的缓存生命周期
 * @param router 路由
 */
export function createKeepAliveGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    if (to.meta?.keepAlive) {
      handleAliveRoute(to, 'add');

      if (_from.name === undefined || _from.name === 'Redirect') {
        handleAliveRoute(to);
      }
    }

    next();
  });
}
