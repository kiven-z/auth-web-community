/** 本机 UI 偏好（locale + 主题）localStorage 键 */
export const DEVICE_UI_STORAGE_KEY = 'ui-device';

/** 用户资料 localStorage 键 */
export const USER_INFO_STORAGE_KEY = 'user-info';

/** 开发环境 accessToken localStorage 键（生产不落盘） */
export const ACCESS_TOKEN_STORAGE_KEY = 'authorized-token';

/**
 * 多标签登录态 Cookie 键：存在则视为已登录会话（关浏览器后清除）。
 */
export const MULTIPLE_TABS_COOKIE_KEY = 'multiple-tabs';

/** 异步路由缓存 localStorage 键 */
export const ASYNC_ROUTES_STORAGE_KEY = 'async-routes';

/** 记住登录相关偏好 localStorage 键 */
export const SESSION_PREFERENCES_KEY = 'session-preferences';

/**
 * UI 偏好配置键。
 * 均可与服务端往返；Device LS 仅作本机冷启动缓存。
 */
export const UI_PREFERENCE_KEYS = {
  /** 界面语言 */
  LOCALE: 'ui.locale',
  /** 颜色方案 + 侧栏皮肤 + 品牌主色 */
  THEME: 'ui.theme',
  /** 导航布局模式 + 侧栏展开状态 */
  LAYOUT: 'ui.layout',
  /** 界面显示开关 + 标签风格 + 页宽 */
  DISPLAY: 'ui.display',
  /** 多标签页快照（跨浏览器恢复） */
  TAGS: 'ui.tags',
} as const;

/** UI 偏好配置键联合类型 */
export type UiPreferenceKey = (typeof UI_PREFERENCE_KEYS)[keyof typeof UI_PREFERENCE_KEYS];
