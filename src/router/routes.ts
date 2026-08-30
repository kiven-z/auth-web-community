import { buildHierarchyTree } from '@/shared/utils/tree';
import cloneDeep from 'lodash/cloneDeep';
import type { RouteComponent, RouteRecordRaw } from 'vue-router';
import remainingRouter from './remaining';
import { ascending } from './utils/menuSort';
import { formatFlatteningRoutes, formatTwoStageRoutes } from './utils/routeTree';

export { default as remainingRouter } from './remaining';

/** 自动导入全部静态路由。匹配 modules 目录（任何嵌套级别）中的 .ts 文件；remaining 见 ./remaining */
const modules: Record<string, { default: unknown }> = import.meta.glob(['./modules/**/*.ts'], {
  eager: true,
});

const routes: unknown[] = [];

Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});

/** glob 展开后的静态路由（未拍平），供重置路由表时复算 */
export const moduleRouteRecords = routes.flat(Infinity);

/**
 * 处理后的静态路由（三级及以上全部拍成二级）
 */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(moduleRouteRecords)))
);

/** 退出登录时用于重置的静态路由快照 */
export const initConstantRoutes: Array<RouteRecordRaw> = cloneDeep(constantRoutes);

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(moduleRouteRecords).concat(...remainingRouter);

/**
 * 不参与菜单的路由 path
 */
export const remainingPaths = remainingRouter.map((route) => route.path);
