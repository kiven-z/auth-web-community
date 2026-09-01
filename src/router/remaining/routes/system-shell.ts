import { $t } from '@/app/plugins/i18n';

const Layout = () => import('@/layout/AppLayout.vue');

/** 布局壳子工具路由（全屏异常页、重定向） */
export default [
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: () => import('@/features/home/error/403.vue'),
    meta: {
      title: $t('menus.accessDenied'),
      showLink: false,
    },
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: () => import('@/features/home/error/500.vue'),
    meta: {
      title: $t('menus.serverError'),
      showLink: false,
    },
  },
  {
    path: '/redirect',
    component: Layout,
    meta: {
      title: $t('status.loading'),
      showLink: false,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/layout/LayoutRedirect.vue'),
      },
    ],
  },
] satisfies Array<RouteConfigsTable>;
