import { describe, expect, it } from 'vitest';
import {
  createDefaultConfigure,
  createDefaultLayout,
  createDefaultLocale,
  createDefaultUiPreferences,
  DEFAULT_LAYOUT,
  DEFAULT_LOCALE,
  DEFAULT_MULTI_TAGS_CACHE,
  DEFAULT_SIDEBAR_OPENED,
} from '@/core/preferences/defaults/preference-defaults';
import {
  DEFAULT_COLOR_SCHEME,
  DEFAULT_NAV_THEME,
  DEFAULT_PRIMARY_COLOR,
} from '@/core/preferences/runtime/theme-defaults';

describe('preference-defaults', () => {
  it('locale / layout / configure 出厂值稳定', () => {
    expect(createDefaultLocale()).toEqual({ locale: DEFAULT_LOCALE });
    expect(createDefaultLayout()).toMatchObject({
      layout: DEFAULT_LAYOUT,
      sidebarStatus: DEFAULT_SIDEBAR_OPENED,
      colorScheme: DEFAULT_COLOR_SCHEME,
      navTheme: DEFAULT_NAV_THEME,
      primaryColor: DEFAULT_PRIMARY_COLOR,
    });
    expect(createDefaultConfigure()).toMatchObject({
      multiTagsCache: DEFAULT_MULTI_TAGS_CACHE,
      hideFooter: true,
      showLogo: true,
    });
  });

  it('createDefaultUiPreferences 聚合三块', () => {
    const snapshot = createDefaultUiPreferences();
    expect(snapshot.locale.locale).toBe(DEFAULT_LOCALE);
    expect(snapshot.layout.layout).toBe(DEFAULT_LAYOUT);
    expect(snapshot.configure.showModel).toBe('smart');
  });
});
