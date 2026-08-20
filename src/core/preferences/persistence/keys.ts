/** UI 偏好配置键 */
export const UI_PREFERENCE_KEYS = {
  LOCALE: 'ui.locale',
  LAYOUT: 'ui.layout',
  CONFIGURE: 'ui.configure',
  /** 多标签页快照（跨浏览器恢复） */
  TAGS: 'ui.tags',
} as const;

/** UI 偏好配置键联合类型 */
export type UiPreferenceKey = (typeof UI_PREFERENCE_KEYS)[keyof typeof UI_PREFERENCE_KEYS];
