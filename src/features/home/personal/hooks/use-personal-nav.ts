import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/** 个人空间侧栏分区键 */
export type PersonalSection = 'profile' | 'security' | 'login-log' | 'inbox' | 'files' | 'recycle';

/** 侧栏分组键 */
export type PersonalNavGroup = 'account' | 'message' | 'files';

/** 侧栏菜单项（label 已翻译） */
export interface PersonalNavItem {
  /** 分区键（el-menu index） */
  key: PersonalSection;
  /** 菜单文案 */
  label: string;
  /** Remix Icon 离线键，须在 Icon/src/offline/packs 注册（`ri/图标名`） */
  icon: string;
}

/** 侧栏分组（title 已翻译） */
export interface PersonalNavGroupConfig {
  /** 分组键 */
  key: PersonalNavGroup;
  /** 分组标题 */
  title: string;
  /** 分组下菜单项 */
  items: PersonalNavItem[];
}

/** 默认激活分区 */
export const PERSONAL_DEFAULT_SECTION: PersonalSection = 'profile';

/**
 * 个人空间侧栏导航
 * @returns 可见分组
 */
function usePersonalNav() {
  const { t } = useI18n();

  const navGroups = computed<PersonalNavGroupConfig[]>(() => [
    {
      key: 'account',
      title: t('personal.nav.group.account'),
      items: [
        {
          key: 'profile',
          label: t('personal.nav.profile'),
          icon: 'ri/user-settings-line',
        },
        {
          key: 'security',
          label: t('personal.nav.security'),
          icon: 'ri/lock-password-line',
        },
        {
          key: 'login-log',
          label: t('personal.nav.loginLog'),
          icon: 'ri/history-line',
        },
      ],
    },
    {
      key: 'message',
      title: t('personal.nav.group.message'),
      items: [
        {
          key: 'inbox',
          label: t('personal.nav.inbox'),
          icon: 'ri/inbox-2-line',
        },
      ],
    },
    {
      key: 'files',
      title: t('personal.nav.group.files'),
      items: [
        {
          key: 'files',
          label: t('personal.nav.files'),
          icon: 'ri/file-user-line',
        },
        {
          key: 'recycle',
          label: t('personal.nav.recycle'),
          icon: 'ri/recycle-line',
        },
      ],
    },
  ]);

  return { navGroups };
}

export default usePersonalNav;
