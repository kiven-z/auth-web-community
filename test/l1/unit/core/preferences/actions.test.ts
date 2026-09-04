import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';

const memory = new Map<string, unknown>();

vi.mock('@/core/config/app-config', () => ({
  APP_TITLE: 'BunnyAdmin',
  APP_STORAGE_PREFIX: 'test-',
  APP_MENU_SEARCH_HISTORY: 6,
}));

vi.mock('@/core/config/keys-config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/config/keys-config')>();
  return {
    ...actual,
    DEVICE_UI_STORAGE_KEY: 'test-device',
  };
});

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

const applyHydratedUiPreferencesMock = vi.fn();
const clearMyPreferences = vi.fn().mockResolvedValue(undefined);
const upsertMyPreference = vi.fn().mockResolvedValue(undefined);

const localePatch = vi.fn();
const localeMirror = vi.fn();
const themePatch = vi.fn();
const themeMirror = vi.fn();
const layoutReset = vi.fn();
const displayReset = vi.fn();
const tagsReset = vi.fn();

vi.mock('@/core/preferences/runtime/apply', () => ({
  applyLayoutPreferences: vi.fn(),
  applyHydratedUiPreferences: (...args: unknown[]) => applyHydratedUiPreferencesMock(...args),
}));

vi.mock('@/features/system/api/user/user-preferences', () => ({
  clearMyPreferences: (...args: unknown[]) => clearMyPreferences(...args),
  upsertMyPreference: (...args: unknown[]) => upsertMyPreference(...args),
  listMyPreferences: vi.fn(),
}));

vi.mock('@/core/preferences/persistence/sync', () => ({
  schedulePreferenceSync: vi.fn(),
  getIsHydrating: () => false,
}));

vi.mock('@/store/modules/preferences/locale-preferences', () => ({
  useLocalePreferencesStore: () => ({
    locale: 'zh-CN',
    $patch: localePatch,
    $mirrorToDevice: localeMirror,
  }),
}));

vi.mock('@/store/modules/preferences/theme-preferences', () => ({
  useThemePreferencesStore: () => ({
    colorScheme: 'light',
    navTheme: 'light',
    primaryColor: '#006eff',
    $patch: themePatch,
    $mirrorToDevice: themeMirror,
  }),
}));

vi.mock('@/store/modules/preferences/layout-preferences', () => ({
  useLayoutPreferencesStore: () => ({
    $state: { layout: 'vertical', sidebarStatus: true },
    $reset: layoutReset,
    setSidebarStatus: vi.fn(),
  }),
}));

vi.mock('@/store/modules/preferences/display-preferences', () => ({
  useDisplayPreferencesStore: () => ({
    $state: {
      grey: false,
      weak: false,
      hideTabs: false,
      hideFooter: true,
      showLogo: true,
      showModel: 'smart',
      stretch: false,
    },
    $reset: displayReset,
  }),
}));

vi.mock('@/store/modules/preferences/tags/tags-preferences', () => ({
  useTagsPreferencesStore: () => ({
    $reset: tagsReset,
    multiTags: [],
    enabled: true,
  }),
}));

vi.mock('@/store/modules/layout-shell-runtime', () => ({
  useLayoutShellRuntimeStore: () => ({
    layout: 'vertical',
    sidebar: { opened: true, withoutAnimation: false, isClickCollapse: false },
  }),
}));

import { resetAppearancePreferences } from '@/core/preferences/runtime/actions';
import { writeDeviceUiPreferences, readDeviceUiPreferences } from '@/core/preferences/persistence/device-storage';

describe('preferences actions（外观重置）', () => {
  beforeEach(() => {
    memory.clear();
    localePatch.mockClear();
    localeMirror.mockClear();
    themePatch.mockClear();
    themeMirror.mockClear();
    layoutReset.mockClear();
    displayReset.mockClear();
    tagsReset.mockClear();
    applyHydratedUiPreferencesMock.mockClear();
    clearMyPreferences.mockClear();
    upsertMyPreference.mockClear();
  });

  it('resetAppearancePreferences：出厂内存 + Device 回写 + 服务端写默认快照', async () => {
    writeDeviceUiPreferences({ locale: 'en', colorScheme: 'dark' });
    expect(readDeviceUiPreferences()).not.toBeNull();

    await resetAppearancePreferences();

    expect(localePatch).toHaveBeenCalled();
    expect(themePatch).toHaveBeenCalled();
    expect(layoutReset).toHaveBeenCalled();
    expect(displayReset).toHaveBeenCalled();
    expect(tagsReset).toHaveBeenCalled();
    expect(localeMirror).toHaveBeenCalled();
    expect(themeMirror).toHaveBeenCalled();
    expect(applyHydratedUiPreferencesMock).toHaveBeenCalled();
    expect(clearMyPreferences).toHaveBeenCalled();
    expect(upsertMyPreference).toHaveBeenCalledTimes(5);
    expect(upsertMyPreference).toHaveBeenCalledWith({
      configKey: UI_PREFERENCE_KEYS.LOCALE,
      configValue: { locale: 'zh-CN' },
    });
  });
});
