import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/preferences/persistence/sync', () => ({
  schedulePreferenceSync: vi.fn(),
  getIsHydrating: () => false,
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

import { displayModule } from '@/core/preferences/modules/display-module';
import { layoutModule } from '@/core/preferences/modules/layout-module';
import { localeModule } from '@/core/preferences/modules/locale-module';
import { tagsModule } from '@/core/preferences/modules/tags-module';
import { themeModule } from '@/core/preferences/modules/theme-module';
import type { PreferenceModule } from '@/core/preferences/registry';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { useLocalePreferencesStore } from '@/store/modules/preferences/locale-preferences';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';

/**
 * 用 setActivePinia 重建默认态后 hydrate 快照，再次 serialize 应与快照一致（互逆）
 */
function expectRoundtrip(module: PreferenceModule, snapshot: Record<string, unknown>): void {
  setActivePinia(createPinia());
  module.hydrate(snapshot);
  expect(module.serialize()).toEqual(snapshot);
}

describe('preferences module roundtrip（真实 store × 真实 module 互逆）', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('locale：serialize 仅含 locale，hydrate 后互逆', () => {
    useLocalePreferencesStore().$patch({ locale: 'en' });
    const snapshot = localeModule.serialize();

    expect(Object.keys(snapshot).sort()).toEqual(['locale']);
    expect(snapshot).toEqual({ locale: 'en' });
    expectRoundtrip(localeModule, snapshot);
  });

  it('theme：serialize 仅含颜色方案/侧栏皮肤/主色，hydrate 后互逆', () => {
    useThemePreferencesStore().$patch({ colorScheme: 'dark', navTheme: 'pink', primaryColor: '#eb2f96' });
    const snapshot = themeModule.serialize();

    expect(Object.keys(snapshot).sort()).toEqual(['colorScheme', 'navTheme', 'primaryColor']);
    expect(snapshot).toEqual({ colorScheme: 'dark', navTheme: 'pink', primaryColor: '#eb2f96' });
    expectRoundtrip(themeModule, snapshot);
  });

  it('layout：serialize 仅含布局模式/侧栏展开，hydrate 后互逆', () => {
    useLayoutPreferencesStore().$patch({ layout: 'horizontal', sidebarStatus: false });
    const snapshot = layoutModule.serialize();

    expect(Object.keys(snapshot).sort()).toEqual(['layout', 'sidebarStatus']);
    expect(snapshot).toEqual({ layout: 'horizontal', sidebarStatus: false });
    expectRoundtrip(layoutModule, snapshot);
  });

  it('display：serialize 含全部界面开关，hydrate 后互逆', () => {
    useDisplayPreferencesStore().$patch({
      grey: true,
      weak: true,
      hideTabs: true,
      hideFooter: false,
      showLogo: false,
      showModel: 'card',
      stretch: 1440,
    });
    const snapshot = displayModule.serialize();

    expect(Object.keys(snapshot).sort()).toEqual([
      'grey',
      'hideFooter',
      'hideTabs',
      'showLogo',
      'showModel',
      'stretch',
      'weak',
    ]);
    expect(snapshot).toEqual({
      grey: true,
      weak: true,
      hideTabs: true,
      hideFooter: false,
      showLogo: false,
      showModel: 'card',
      stretch: 1440,
    });
    expectRoundtrip(displayModule, snapshot);
  });

  it('tags：serialize 含 enabled + items，hydrate 后互逆', () => {
    useTagsPreferencesStore().$patch({
      enabled: true,
      multiTags: [{ path: '/welcome', name: 'Welcome' }],
    });
    const snapshot = tagsModule.serialize();

    expect(Object.keys(snapshot).sort()).toEqual(['enabled', 'items']);
    expect(snapshot).toEqual({
      enabled: true,
      items: [
        {
          path: '/welcome',
          name: 'Welcome',
          query: undefined,
          params: undefined,
          meta: undefined,
        },
      ],
    });
    expectRoundtrip(tagsModule, snapshot);
  });

  it('resetLocal 后 serialize 为出厂快照', () => {
    useLocalePreferencesStore().$patch({ locale: 'en' });
    useThemePreferencesStore().$patch({ colorScheme: 'dark', navTheme: 'pink', primaryColor: '#eb2f96' });
    useLayoutPreferencesStore().$patch({ layout: 'horizontal', sidebarStatus: false });
    useDisplayPreferencesStore().$patch({ grey: true, hideTabs: true });
    useTagsPreferencesStore().$patch({
      enabled: false,
      multiTags: [{ path: '/welcome', name: 'Welcome' }],
    });

    localeModule.resetLocal();
    themeModule.resetLocal();
    layoutModule.resetLocal();
    displayModule.resetLocal();
    tagsModule.resetLocal();

    expect(localeModule.serialize()).toEqual({ locale: 'zh' });
    expect(themeModule.serialize()).toEqual({
      colorScheme: 'light',
      navTheme: 'light',
      primaryColor: '#006eff',
    });
    expect(layoutModule.serialize()).toEqual({ layout: 'vertical', sidebarStatus: true });
    expect(displayModule.serialize()).toMatchObject({ grey: false, hideTabs: false, hideFooter: true });
    expect(tagsModule.serialize()).toMatchObject({ enabled: true });
  });
});
