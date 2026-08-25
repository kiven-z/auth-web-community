import { i18n } from '@/app/plugins/i18n';
import type { LocaleType } from '@/auth/config/locales';
import { buildPrimaryColorInlineStyle } from '@/shared/utils/color/primaryColorInline';
import { useAppStore } from '@/store/modules/app/app';
import { useEpThemeStore } from '@/store/modules/app/epTheme';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { DEFAULT_LOCALE, DEFAULT_MULTI_TAGS_CACHE } from '../defaults/preference-defaults';
import { resolveEffectiveLayout } from '../defaults/runtime-layout';
import { getConfigureSnapshot, getLayoutSnapshot, getLocaleSnapshot, getTagsSnapshot } from '../persistence/storage';
import { getIsHydrating } from '../persistence/sync';
import {
  DEFAULT_COLOR_SCHEME,
  DEFAULT_NAV_THEME,
  DEFAULT_PRIMARY_COLOR,
  resolveEffectiveNavTheme,
} from './theme-defaults';

/**
 * 根据 colorScheme 与 OS 偏好解析是否深色
 * @param layout layout 快照
 * @returns 是否深色
 */
function resolveEffectiveDarkMode(layout: ResponsiveStorage['layout']): boolean {
  const scheme = layout.colorScheme ?? DEFAULT_COLOR_SCHEME;
  if (scheme === 'system') {
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return scheme === 'dark';
}

/**
 * 将主色写入 DOM 与 epTheme store（仅 brand-6 / brand / primary；阶梯交给 CSS）
 * @param color 主色
 * @param navTheme 生效侧栏皮肤
 */
function applyPrimaryColorToDom(color: string, navTheme: string): void {
  const epThemeStore = useEpThemeStore();
  epThemeStore.primaryColor = color;
  epThemeStore.navTheme = navTheme;

  const root = document.documentElement;
  const inlineStyle = buildPrimaryColorInlineStyle(color);
  for (const [cssVar, value] of Object.entries(inlineStyle)) {
    root.style.setProperty(cssVar, value);
  }
}

/**
 * 将 locale 偏好应用到 i18n（无需组件实例）
 */
function applyLocalePreferences(): void {
  const localeValue = (getLocaleSnapshot().locale ?? DEFAULT_LOCALE) as LocaleType;
  if (typeof i18n.global.locale === 'string') {
    i18n.global.locale = localeValue;
  } else {
    i18n.global.locale.value = localeValue;
  }
}

/**
 * 将 layout 偏好应用到 DOM 与 app store（无需组件实例）
 */
export function applyLayoutPreferences(): void {
  const snapshot = getLayoutSnapshot();
  const layoutModel = resolveEffectiveLayout(snapshot.layout);
  globalThis.document.body.setAttribute('layout', layoutModel);
  useAppStore().setLayout(layoutModel);
  if (snapshot.sidebarStatus !== undefined) {
    useAppStore().sidebar.opened = snapshot.sidebarStatus;
  }
}

/**
 * 将主题偏好应用到 DOM 与 epTheme store（无需组件实例）
 */
export function applyThemePreferences(): void {
  const snapshot = getLayoutSnapshot();
  const darkMode = resolveEffectiveDarkMode(snapshot);
  const preferredNavTheme = snapshot.navTheme ?? DEFAULT_NAV_THEME;
  const effectiveNavTheme = resolveEffectiveNavTheme(preferredNavTheme, darkMode);
  const primaryColor = snapshot.primaryColor ?? DEFAULT_PRIMARY_COLOR;

  document.documentElement.dataset.theme = effectiveNavTheme;
  applyPrimaryColorToDom(primaryColor, effectiveNavTheme);

  if (darkMode) {
    document.documentElement.classList.add('dark');
    return;
  }
  document.documentElement.classList.remove('dark');
}

/**
 * 将 configure 字段子集应用到 DOM / store。
 * hideTabs / showModel / showLogo 由组件读 getUiPreferenceState().configure，无需事件总线。
 * @param patch 待应用字段（仅处理 patch 中出现的键）
 */
export function applyConfigureSideEffects(patch: Partial<ResponsiveStorage['configure']>): void {
  const html = document.querySelector('html');

  if ('grey' in patch && patch.grey !== undefined) {
    html?.classList.toggle('html-grey', Boolean(patch.grey));
  }
  if ('weak' in patch && patch.weak !== undefined) {
    html?.classList.toggle('html-weakness', Boolean(patch.weak));
  }
  if ('multiTagsCache' in patch && patch.multiTagsCache !== undefined) {
    const enabled = Boolean(patch.multiTagsCache);
    const tagsStore = useMultiTagsStore();
    tagsStore.multiTagsCache = enabled;
    // hydrate 期间勿用当前（可能仍是首页）标签覆盖刚灌入的服务端快照
    if (enabled && !getIsHydrating()) {
      tagsStore.persistTagsCache();
    }
  }
}

/**
 * 将 configure 偏好应用到 DOM / store（无需组件实例）
 */
function applyConfigurePreferences(): void {
  applyConfigureSideEffects(getConfigureSnapshot());
}

/**
 * 将服务端多标签快照灌入 multiTags store（须在 configure 应用之后）
 */
function applyTagsPreferences(): void {
  const enabled = getConfigureSnapshot().multiTagsCache ?? DEFAULT_MULTI_TAGS_CACHE;
  useMultiTagsStore().hydrateTags(enabled, getTagsSnapshot());
}

/**
 * hydrate 完成后将 storage 中的 UI 偏好应用到 DOM、i18n 与 store
 */
export function applyHydratedUiPreferences(): void {
  applyLocalePreferences();
  applyThemePreferences();
  applyLayoutPreferences();
  applyConfigurePreferences();
  applyTagsPreferences();
}
