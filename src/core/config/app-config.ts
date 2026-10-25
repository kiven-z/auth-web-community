import en from 'element-plus/es/locale/lang/en.mjs';
import zhCn from 'element-plus/es/locale/lang/zh-cn.mjs';
import type { LayoutMode } from '@/shared/utils/layout/layout-mode';

/** 颜色方案：浅色 / 深色 / 跟随系统 */
export type ColorScheme = 'light' | 'dark' | 'system';

/** 导航主题色条目 */
interface NavThemeColorItem {
  /** 色板展示色 */
  color: string;
  /** 侧栏皮肤标识，对应 html[data-theme] */
  navTheme: string;
  /** 选中后写入的主色 */
  primaryColor: string;
}

const primaryColor = '#006eff';

export const APP_CONFIG = {
  app: {
    /** 应用标题 */
    title: 'BunnyAdmin',
    /** 菜单搜索历史条数上限 */
    menuSearchHistory: 6,
  },

  http: {
    /**
     * 业务成功码。
     * 约定：HTTP 2xx 且统一信封 code === successCode 表示业务成功。
     */
    successCode: 0,
    /** Axios baseURL */
    baseUrl: '/api',
    /** 请求超时毫秒 */
    timeout: 30_000,
  },

  storage: {
    /** 界面偏好 localStorage（语言、主题、布局、显示开关、页签） */
    preferences: 'ui-preferences',
    /** 用户资料 localStorage */
    userProfile: 'user-info',
    /** 开发环境 accessToken localStorage */
    accessToken: 'authorized-token',
    /** 登录会话 Cookie；存在则视为已登录 */
    sessionCookie: 'multiple-tabs',
    /** 记住登录偏好 localStorage */
    sessionPreferences: 'session-preferences',
  },

  /**
   * 语言表。locale 对应 locales/ 下目录名。
   * 默认语言取首项。
   */
  locales: [
    { locale: 'zh-CN', label: '简体中文', el: zhCn },
    { locale: 'en', label: 'English', el: en },
  ],

  theme: {
    /** 默认颜色方案 */
    colorScheme: 'light' satisfies ColorScheme,
    /** 默认侧栏皮肤 */
    navTheme: 'light',
    /** 默认品牌主色 */
    primaryColor,
    /** 导航主题色列表 */
    navThemes: [
      { color: '#ffffff', navTheme: 'light', primaryColor },
      { color: '#1b2a47', navTheme: 'default', primaryColor },
      { color: '#722ed1', navTheme: 'saucePurple', primaryColor: '#722ed1' },
      { color: '#13c2c2', navTheme: 'mingQing', primaryColor: '#13c2c2' },
      { color: '#00b96b', navTheme: 'cyberGreen', primaryColor: '#00b96b' },
      { color: '#fa8c16', navTheme: 'sunsetOrange', primaryColor: '#fa8c16' },
    ] satisfies readonly NavThemeColorItem[],
  },

  layout: {
    /** 默认布局模式 */
    mode: 'vertical' satisfies LayoutMode,
  },
} as const;

/** 语言代码 */
export type LocaleType = (typeof APP_CONFIG.locales)[number]['locale'];

/** 默认语言 = 语言表首项 */
export const DEFAULT_LOCALE: LocaleType = APP_CONFIG.locales[0].locale;

/**
 * 获取语言定义
 * @param locale 语言代码
 * @returns 语言定义；未命中为表首项
 */
export const getLocaleDef = (locale?: string) => {
  return APP_CONFIG.locales.find((item) => item.locale === locale) ?? APP_CONFIG.locales[0];
};
