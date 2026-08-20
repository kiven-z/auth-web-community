import { $t } from '@/app/plugins/i18n';

/** 登录入口路由 */
export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/home/login/index.vue'),
    meta: {
      title: $t('menus.login'),
      showLink: false,
    },
  },
] satisfies Array<RouteConfigsTable>;
