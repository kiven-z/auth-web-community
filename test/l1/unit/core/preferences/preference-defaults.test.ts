import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LAYOUT_DEFAULT_MODE,
  THEME_DEFAULT_COLOR_SCHEME,
  THEME_DEFAULT_NAV_THEME,
  THEME_DEFAULT_PRIMARY_COLOR,
} from '@/core/config/ui-config';
import { DEFAULT_LOCALE } from '@/core/config/locale-config';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { useLocalePreferencesStore } from '@/store/modules/preferences/locale-preferences';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';

vi.mock('@/core/preferences/persistence/sync', () => ({
  schedulePreferenceSync: vi.fn(),
}));

vi.mock('@/core/preferences/runtime/layout-override', () => ({
  applyEffectiveLayoutToShell: vi.fn(),
}));

vi.mock('@/core/preferences/runtime/locale-effect', () => ({
  applyLocaleToI18n: vi.fn(),
}));

vi.mock('@/core/preferences/persistence/device-storage', () => ({
  readDeviceUiPreferences: () => null,
  writeDeviceUiPreferences: vi.fn(),
}));

describe('preferenceDefaults（按域出厂值）', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('localePreferences 在 Device LS 为空时出厂为默认语言', () => {
    expect(useLocalePreferencesStore().locale).toBe(DEFAULT_LOCALE);
  });

  it('themePreferences 在 Device LS 为空时出厂为主题默认', () => {
    expect(useThemePreferencesStore().$state).toEqual({
      colorScheme: THEME_DEFAULT_COLOR_SCHEME,
      navTheme: THEME_DEFAULT_NAV_THEME,
      primaryColor: THEME_DEFAULT_PRIMARY_COLOR,
    });
  });

  it('layoutPreferences 出厂值为布局壳默认', () => {
    expect(useLayoutPreferencesStore().$state).toEqual({
      layout: LAYOUT_DEFAULT_MODE,
      sidebarStatus: true,
    });
  });

  it('displayPreferences 出厂值含界面开关默认', () => {
    expect(useDisplayPreferencesStore().$state).toEqual({
      grey: false,
      weak: false,
      hideTabs: false,
      hideFooter: true,
      showLogo: true,
      showModel: 'smart',
      stretch: false,
    });
  });

  it('tagsPreferences 出厂 enabled 为记住页签默认', () => {
    expect(useTagsPreferencesStore().enabled).toBe(true);
  });
});
