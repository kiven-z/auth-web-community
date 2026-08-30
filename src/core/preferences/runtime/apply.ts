import { useLayoutShellRuntimeStore } from '@/store/modules/layoutShellRuntime';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/displayPreferences';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layoutPreferences';
import { useLocalePreferencesStore } from '@/store/modules/preferences/localePreferences';
import { useThemePreferencesStore } from '@/store/modules/preferences/themePreferences';
import { applyEffectiveLayoutToShell } from './layoutOverride';
import { applyLocaleToI18n } from './localeEffect';

/**
 * 将 layout 偏好应用到 DOM 与布局壳运行时（无需组件实例）
 */
export function applyLayoutPreferences(): void {
  const layoutStore = useLayoutPreferencesStore();
  applyEffectiveLayoutToShell(layoutStore.layout);
  useLayoutShellRuntimeStore().sidebar.opened = layoutStore.sidebarStatus;
}
/**
 * hydrate 完成后将 UI 偏好应用到 DOM、i18n 与 store
 */
export function applyHydratedUiPreferences(): void {
  applyLocaleToI18n(useLocalePreferencesStore().locale);

  useThemePreferencesStore().$applyToDom();
  applyLayoutPreferences();

  useDisplayPreferencesStore().$applyToDom();
}
