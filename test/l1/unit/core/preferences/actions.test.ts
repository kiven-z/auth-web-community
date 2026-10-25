import { createPinia, setActivePinia } from 'pinia';
import { createApp } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_CONFIG } from '@/core/config/app-config';
import { resetAppearancePreferences } from '@/core/preferences/runtime/actions';
import { preferencesPersistencePlugin } from '@/store/modules/preferences/preferences-persistence';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { useLocalePreferencesStore } from '@/store/modules/preferences/locale-preferences';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';

const memory = new Map<string, unknown>();

vi.mock('@/core/preferences/runtime/apply', () => ({
  applyHydratedUiPreferences: vi.fn(),
}));

vi.mock('@/core/preferences/runtime/layout-override', () => ({
  applyEffectiveLayoutToShell: vi.fn(),
}));

vi.mock('@/app/plugins/i18n', () => ({
  i18n: { global: { locale: { value: '' } } },
}));

vi.mock('@/core/storage/storage-local', () => ({
  storageLocal: () => ({
    getItem: <T>(key: string): T | null => (memory.has(key) ? (memory.get(key) as T) : null),
    setItem: <T>(key: string, value: T): void => {
      memory.set(key, value);
    },
    removeItem: (key: string): void => {
      memory.delete(key);
    },
    clear: (): void => {
      memory.clear();
    },
  }),
}));

function bootPreferences() {
  const pinia = createPinia();
  pinia.use(preferencesPersistencePlugin);
  createApp({ render: () => null }).use(pinia);
  setActivePinia(pinia);
  return {
    locale: useLocalePreferencesStore(),
    theme: useThemePreferencesStore(),
    layout: useLayoutPreferencesStore(),
    display: useDisplayPreferencesStore(),
    tags: useTagsPreferencesStore(),
  };
}

describe('preferences actions（外观重置）', () => {
  beforeEach(() => {
    memory.clear();
  });

  it('resetAppearancePreferences 把本机偏好写回出厂，并清掉页签', () => {
    memory.set(APP_CONFIG.storage.preferences, {
      locale: 'en',
      colorScheme: 'dark',
      navTheme: 'saucePurple',
      primaryColor: '#722ed1',
      layout: 'mix',
      sidebarStatus: false,
      weak: true,
      hideFooter: false,
      multiTags: [{ path: '/a', name: 'A' }],
    });
    const stores = bootPreferences();
    expect(stores.tags.hasSavedTags).toBe(true);

    resetAppearancePreferences();

    expect(stores.locale.locale).toBe('zh-CN');
    expect(stores.theme.colorScheme).toBe('light');
    expect(stores.theme.navTheme).toBe('light');
    expect(stores.theme.primaryColor).toBe('#006eff');
    expect(stores.layout.layout).toBe('vertical');
    expect(stores.layout.sidebarStatus).toBe(true);
    expect(stores.display.weak).toBe(false);
    expect(stores.display.hideFooter).toBe(true);
    expect(stores.tags.hasSavedTags).toBe(false);
    expect(memory.get(APP_CONFIG.storage.preferences)).toMatchObject({
      locale: 'zh-CN',
      colorScheme: 'light',
      navTheme: 'light',
      primaryColor: '#006eff',
      layout: 'vertical',
      sidebarStatus: true,
      weak: false,
      hideFooter: true,
    });
    expect(memory.get(APP_CONFIG.storage.preferences)).not.toHaveProperty('multiTags');
  });
});
