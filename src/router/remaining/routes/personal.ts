import { $t } from '@/app/plugins/i18n';

/** 个人空间（个人中心 / 我的消息 / 我的文件） */
export default [
  {
    path: '/personal',
    name: 'Personal',
    component: () => import('@/features/home/personal/index.vue'),
    redirect: '/personal/profile',
    meta: {
      showLink: false,
      title: $t('personal.title'),
      icon: 'ri/user-settings-line',
    },
    children: [
      {
        path: 'profile',
        name: 'PersonalProfile',
        component: () => import('@/features/home/personal/panels/profile/ProfilePanel.vue'),
        meta: {
          title: $t('personal.nav.profile'),
          showLink: false,
          section: 'profile',
        },
      },
      {
        path: 'security',
        name: 'PersonalSecurity',
        component: () => import('@/features/home/personal/panels/security/SecurityPanel.vue'),
        meta: {
          title: $t('personal.nav.security'),
          showLink: false,
          section: 'security',
        },
      },
      {
        path: 'login-log',
        name: 'PersonalLoginLog',
        component: () => import('@/features/home/personal/panels/login-log/LoginLogPanel.vue'),
        meta: {
          title: $t('personal.nav.loginLog'),
          showLink: false,
          section: 'login-log',
        },
      },
      {
        path: 'appearance',
        name: 'PersonalAppearance',
        component: () => import('@/features/home/personal/panels/appearance/AppearancePanel.vue'),
        meta: {
          title: $t('personal.nav.appearance'),
          showLink: false,
          section: 'appearance',
        },
      },
      {
        path: 'inbox',
        name: 'PersonalInbox',
        component: () => import('@/features/home/personal/panels/inbox/InboxPanel.vue'),
        meta: {
          title: $t('personal.nav.inbox'),
          showLink: false,
          section: 'inbox',
        },
      },
      {
        path: 'inbox/detail/:id',
        name: 'PersonalInboxDetail',
        component: () => import('@/features/home/personal/panels/inbox/InboxMessageDetailView.vue'),
        meta: {
          title: $t('inAppInbox.detail.title'),
          showLink: false,
          section: 'inbox',
        },
      },
      {
        path: 'files',
        name: 'PersonalFiles',
        component: () => import('@/features/home/personal/panels/files/FilesPanel.vue'),
        meta: {
          title: $t('personal.nav.files'),
          showLink: false,
          section: 'files',
        },
      },
      {
        path: 'export-task',
        name: 'PersonalFileExportTask',
        component: () => import('@/features/home/personal/panels/export-task/ExportTaskPanel.vue'),
        meta: {
          title: $t('personal.nav.exportTask'),
          showLink: false,
          section: 'export-task',
        },
      },
      {
        path: 'recycle',
        name: 'PersonalFileRecycle',
        component: () => import('@/features/home/personal/panels/recycle/RecyclePanel.vue'),
        meta: {
          title: $t('personal.nav.recycle'),
          showLink: false,
          section: 'recycle',
        },
      },
    ],
  },
] satisfies Array<RouteConfigsTable>;
