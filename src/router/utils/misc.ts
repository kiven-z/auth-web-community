import { ROUTE_PENDING_NAME } from '@/router/pending-catch-all';
import type { SidebarMenuNode } from '@/router/types';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { useTimeoutFn } from '@vueuse/core';
import { router } from '../index';

const PAGE_NOT_FOUND_NAME = 'PageNotFound';

/**
 * 动态路由注册完成后，用全屏 404 替换启动占位，避免刷新动态路由页面时误进 404
 */
function addPathMatch() {
  if (router.hasRoute(ROUTE_PENDING_NAME)) {
    router.removeRoute(ROUTE_PENDING_NAME);
  }
  if (router.hasRoute(PAGE_NOT_FOUND_NAME)) {
    return;
  }
  router.addRoute({
    path: '/:pathMatch(.*)*',
    name: PAGE_NOT_FOUND_NAME,
    component: () => import('@/features/home/error/404.vue'),
    meta: {
      title: 'menus.pageNotFound',
      showLink: false,
    },
  });
}

/**
 * 处理缓存路由（添加、删除、刷新）
 * @param name 路由名称
 * @param mode 模式
 */
function handleAliveRoute({ name }: ToRouteType, mode?: string) {
  switch (mode) {
    case 'add':
      usePermissionStore().cacheOperate({
        mode: 'add',
        name,
      });
      break;
    case 'delete':
      usePermissionStore().cacheOperate({
        mode: 'delete',
        name,
      });
      break;
    case 'refresh':
      usePermissionStore().cacheOperate({
        mode: 'refresh',
        name,
      });
      break;
    default:
      usePermissionStore().cacheOperate({
        mode: 'delete',
        name,
      });
      useTimeoutFn(() => {
        usePermissionStore().cacheOperate({
          mode: 'add',
          name,
        });
      }, 100);
  }
}

/**
 * 处理顶部菜单
 * @param route 路由
 * @returns 顶部菜单
 */
function handleTopMenu(route) {
  if (route?.children && route.children.length > 1) {
    if (route.redirect) {
      return route.children.find((cur) => cur.path === route.redirect);
    } else {
      return route.children[0];
    }
  } else {
    return route;
  }
}

/**
 * 获取所有菜单中的第一个菜单（顶级菜单）
 * @param tag 是否添加到标签页
 * @returns 顶级菜单
 */
function getTopMenu(tag = false): SidebarMenuNode | undefined {
  const wholeMenus = usePermissionStore().wholeMenus;
  if (!wholeMenus?.length) return undefined;
  const topMenu = handleTopMenu(wholeMenus[0]?.children[0]);
  if (!topMenu) return undefined;
  tag && useTagsPreferencesStore().pushTag(topMenu);
  return topMenu;
}

export { addPathMatch, getTopMenu, handleAliveRoute };
