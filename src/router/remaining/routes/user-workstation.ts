import { $t } from '@/app/plugins/i18n';
import {
  SYS_USER_DEPT_PERMS,
  SYS_USER_PERMS,
  SYS_USER_POST_PERMS,
  SYS_USER_ROLE_PERMS,
} from '@/features/system/user/constants/permissions';

/** 用户管理工作台（独立全页，不进侧栏菜单，由用户列表进入） */
export default [
  {
    path: '/system/user-workstation/:userId',
    name: 'UserWorkstation',
    component: () => import('@/features/system/user/workstation/index.vue'),
    /** 相对当前父路径，保留 :userId；裸 overview 会吃掉 userId 段 */
    redirect: './overview',
    meta: {
      title: $t('users.workstation.title'),
      showLink: false,
      /** 进入门槛：与用户列表查询权限一致 */
      auths: SYS_USER_PERMS.QUERY,
    },
    children: [
      {
        path: 'overview',
        name: 'UserWorkstationOverview',
        component: () => import('@/features/system/user/workstation/panels/OverviewPanel.vue'),
        meta: {
          title: $t('users.workstation.nav.overview'),
          showLink: false,
          section: 'overview',
          auths: SYS_USER_PERMS.QUERY,
        },
      },
      {
        path: 'profile',
        name: 'UserWorkstationProfile',
        component: () => import('@/features/system/user/workstation/panels/profile/ProfilePanel.vue'),
        meta: {
          title: $t('users.workstation.nav.profile'),
          showLink: false,
          section: 'profile',
          auths: SYS_USER_PERMS.UPDATE,
        },
      },
      {
        path: 'grant-role',
        name: 'UserWorkstationGrantRole',
        component: () => import('@/features/system/user/workstation/panels/assign/role/GrantRolePanel.vue'),
        meta: {
          title: $t('users.workstation.nav.grantRole'),
          showLink: false,
          section: 'grant-role',
          auths: SYS_USER_ROLE_PERMS.QUERY,
        },
      },
      {
        path: 'grant-dept',
        name: 'UserWorkstationGrantDept',
        component: () => import('@/features/system/user/workstation/panels/assign/dept/GrantDeptPanel.vue'),
        meta: {
          title: $t('users.workstation.nav.grantDept'),
          showLink: false,
          section: 'grant-dept',
          auths: SYS_USER_DEPT_PERMS.QUERY,
        },
      },
      {
        path: 'grant-post',
        name: 'UserWorkstationGrantPost',
        component: () => import('@/features/system/user/workstation/panels/assign/post/GrantPostPanel.vue'),
        meta: {
          title: $t('users.workstation.nav.grantPost'),
          showLink: false,
          section: 'grant-post',
          auths: SYS_USER_POST_PERMS.QUERY,
        },
      },
      {
        path: 'grant-scope',
        name: 'UserWorkstationGrantScope',
        component: () => import('@/features/system/user/workstation/panels/assign/role/GrantScopePanel.vue'),
        meta: {
          title: $t('users.workstation.nav.grantScope'),
          showLink: false,
          section: 'grant-scope',
          auths: SYS_USER_PERMS.QUERY,
        },
      },
      {
        path: 'security',
        name: 'UserWorkstationSecurity',
        component: () => import('@/features/system/user/workstation/panels/security/SecurityPanel.vue'),
        meta: {
          title: $t('users.workstation.nav.security'),
          showLink: false,
          section: 'security',
          /** 页内按动作细粒度鉴权；入口与工作台查询权一致 */
          auths: SYS_USER_PERMS.QUERY,
        },
      },
    ],
  },
] satisfies Array<RouteConfigsTable>;
