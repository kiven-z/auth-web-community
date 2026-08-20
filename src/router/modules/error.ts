import { $t } from '@/app/plugins/i18n';

export default {
  path: '/error',
  redirect: '/error/403',
  meta: {
    icon: 'ri/information-line',
    showLink: false,
    title: $t('menus.abnormal'),
    rank: 9,
  },
  children: [
    {
      path: '/error/403',
      name: 'ForbiddenPage',
      component: () => import('@/features/home/error/403.vue'),
      meta: {
        title: $t('menus.accessDenied'),
      },
    },
    {
      path: '/error/404',
      name: 'NotFoundPage',
      component: () => import('@/features/home/error/404.vue'),
      meta: {
        title: $t('menus.pageNotFound'),
      },
    },
    {
      path: '/error/500',
      name: 'ServerErrorPage',
      component: () => import('@/features/home/error/500.vue'),
      meta: {
        title: $t('menus.serverError'),
      },
    },
  ],
} satisfies RouteConfigsTable;
