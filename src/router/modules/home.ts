import { $t } from '@/app/plugins/i18n';

const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import('@/layout/index.vue');

export default {
  path: '/',
  name: 'Home',
  component: Layout,
  redirect: '/welcome',
  meta: {
    icon: 'ep/home-filled',
    title: $t('menus.home'),
    rank: 0,
  },
  children: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('@/features/home/welcome/index.vue'),
      meta: {
        title: $t('menus.home'),
        showLink: VITE_HIDE_HOME !== 'true',
      },
    },
  ],
} satisfies RouteConfigsTable;
