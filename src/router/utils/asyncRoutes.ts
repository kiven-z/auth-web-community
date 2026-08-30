import { modulesRoutes, modulesRoutesKeys } from '@/router/pageResolver';
import type { RouteRecordRaw } from 'vue-router';

const IFrame = () => import('@/layout/IframeView.vue');

/**
 * 在后端路由中匹配对应的 Vite glob 组件路径
 * 匹配策略：
 *   - 优先使用 v.component 字段（后端显式指定组件路径）
 *   - 回退使用 v.path 字段（与组件路径同名）
 *   - 使用子串匹配（includes），因为 vite glob 返回的路径如 /src/features/xxx.vue
 *     天然包含路由路径 /xxx 作为子串
 */
function resolveComponent(v: RouteRecordRaw): boolean {
  const searchKey = (v.component || v.path) as string;
  const index = modulesRoutesKeys.findIndex((ev) => ev.includes(searchKey));
  if (index === -1) {
    console.warn(`[router] 未找到组件路径匹配: "${searchKey}"，跳过路由: ${v.path}`);
    v.component = undefined;
    return false;
  }
  v.component = modulesRoutes[modulesRoutesKeys[index]];
  return true;
}

/**
 * 过滤后端传来的动态路由 重新生成规范路由
 * @param arrRoutes 后端传来的动态路由
 * @returns 规范路由
 */
function addAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
  if (!arrRoutes?.length) return;
  arrRoutes.forEach((v: RouteRecordRaw) => {
    // 将backstage属性加入meta，标识此路由为后端返回路由
    v.meta = { ...(v.meta ?? { title: v.path }), backstage: true };
    // 父级的redirect属性取值：如果子级存在且父级的redirect属性不存在，默认取第一个子级的path
    if (v?.children?.length && !v.redirect) v.redirect = v.children[0].path;
    // 父级的name属性取值：如果子级存在且父级的name属性不存在，默认取第一个子级的name并追加Parent后缀避免重复
    if (v?.children?.length && !v.name) v.name = `${v.children[0].name as string}Parent`;
    if (v.meta?.frameSrc) {
      // 内嵌iframe页面
      v.component = IFrame;
    } else if (v.component) {
      // 后端显式指定了组件路径，尝试匹配
      if (!resolveComponent(v)) return;
    } else {
      // 未指定组件：可能是外部链接路由（纯导航，点击跳转百度等），无需解析组件
      // 保留 v.component = undefined，router 跳转时由 router.beforeEach 中的 externalLink 逻辑处理
      v.component = undefined;
      // 子路由仍需要处理
    }
    if (v?.children?.length) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
}

export { addAsyncRoutes };
