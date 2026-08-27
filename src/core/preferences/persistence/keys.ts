/**
 * UI 偏好配置键。
 * LOCALE / 主题走 Device LS；LAYOUT 仅壳字段与 CONFIGURE / TAGS 可同步服务端。
 */
export const UI_PREFERENCE_KEYS = {
  /** 历史键：hydrate 时忽略，不再 upsert */
  LOCALE: 'ui.locale',
  LAYOUT: 'ui.layout',
  CONFIGURE: 'ui.configure',
  /** 多标签页快照（跨浏览器恢复） */
  TAGS: 'ui.tags',
} as const;

/** UI 偏好配置键联合类型 */
export type UiPreferenceKey = (typeof UI_PREFERENCE_KEYS)[keyof typeof UI_PREFERENCE_KEYS];
