import { DEFAULT_LAYOUT_MODE, type LayoutMode } from '@/shared/utils/layout/layout-mode';
import { createDefaultThemeLayoutFields } from '../runtime/theme-defaults';

/** 默认语言 */
export const DEFAULT_LOCALE = 'zh';

/** 默认布局模式 */
export const DEFAULT_LAYOUT: LayoutMode = DEFAULT_LAYOUT_MODE;

/** 默认侧栏展开 */
export const DEFAULT_SIDEBAR_OPENED = true;

/** 默认是否将打开的标签同步到服务端（跨浏览器恢复） */
export const DEFAULT_MULTI_TAGS_CACHE = true;

/**
 * 用户偏好出厂默认（locale / layout 壳字段 / configure）
 * 主题字段见 theme-defaults；platform-config 只保留部署项，不读作偏好默认
 */

/** 组装默认 locale 片段 */
export function createDefaultLocale(): ResponsiveStorage['locale'] {
  return { locale: DEFAULT_LOCALE };
}

/**
 * 组装默认 layout 片段（含主题三字段）
 * @returns layout 出厂值
 */
export function createDefaultLayout(): ResponsiveStorage['layout'] {
  return {
    layout: DEFAULT_LAYOUT,
    sidebarStatus: DEFAULT_SIDEBAR_OPENED,
    ...createDefaultThemeLayoutFields(),
  };
}

/** 组装默认 configure 片段 */
export function createDefaultConfigure(): ResponsiveStorage['configure'] {
  return {
    grey: false,
    weak: false,
    hideTabs: false,
    hideFooter: true,
    showLogo: true,
    showModel: 'smart',
    multiTagsCache: DEFAULT_MULTI_TAGS_CACHE,
    stretch: false,
  };
}

/**
 * 组装完整 UI 偏好出厂快照（首启内存默认 / 登出重置）
 * @returns locale + layout + configure + tags
 */
export function createDefaultUiPreferences(): Pick<ResponsiveStorage, 'locale' | 'layout' | 'configure' | 'tags'> {
  return {
    locale: createDefaultLocale(),
    layout: createDefaultLayout(),
    configure: createDefaultConfigure(),
    tags: [],
  };
}
