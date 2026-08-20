import NProgress from '@/services/progress';
import type { Router } from 'vue-router';

/**
 * 记录已加载的页面路径集合，用于鉴别是首次进入还是刷新。
 */
const loadedPaths = new Set<string>();

export function resetLoadedPaths(): void {
  loadedPaths.clear();
}

/**
 * 路由加载进度守卫：标记页面加载状态并控制 NProgress。
 */
export function createProgressGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    to.meta.loaded = loadedPaths.has(to.path);

    if (!to.meta.loaded) {
      NProgress.start();
    }

    next();
  });

  router.afterEach((to) => {
    loadedPaths.add(to.path);
    NProgress.done();
  });
}
