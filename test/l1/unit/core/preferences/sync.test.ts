import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_PREFERENCE_KEYS } from '@/core/config/keysConfig';
import { hydrateFromServer, schedulePreferenceSync, startSync, stopSync } from '@/core/preferences/persistence/sync';

const localeState = { locale: 'zh' };
const localeStore = {
  get locale() {
    return localeState.locale;
  },
  $patch: vi.fn((patch: Partial<typeof localeState>) => {
    Object.assign(localeState, patch);
  }),
  $mirrorToDevice: vi.fn(),
};

const themeState = { colorScheme: 'light', navTheme: 'light', primaryColor: '#006eff' };
const themeStore = {
  get colorScheme() {
    return themeState.colorScheme;
  },
  get navTheme() {
    return themeState.navTheme;
  },
  get primaryColor() {
    return themeState.primaryColor;
  },
  $patch: vi.fn((patch: Partial<typeof themeState>) => {
    Object.assign(themeState, patch);
  }),
  $mirrorToDevice: vi.fn(),
};

const layoutState = {
  layout: 'vertical' as const,
  sidebarStatus: true,
};
const layoutStore = {
  $state: layoutState,
  $patch: vi.fn((patch: Partial<typeof layoutState>) => {
    Object.assign(layoutState, patch);
  }),
};

const displayState = {
  grey: false,
  weak: false,
  hideTabs: false,
  hideFooter: true,
  showLogo: true,
  showModel: 'smart',
  stretch: false as boolean | number,
};
const displayStore = {
  $state: displayState,
  $patch: vi.fn((patch: Partial<typeof displayState>) => {
    Object.assign(displayState, patch);
  }),
};

const tagsState = {
  multiTags: [] as unknown[],
  enabled: true,
};
const tagsStore = {
  get multiTags() {
    return tagsState.multiTags;
  },
  get enabled() {
    return tagsState.enabled;
  },
  setEnabled: vi.fn((value: boolean) => {
    tagsState.enabled = value;
  }),
  hydrateTags: vi.fn((enabled: boolean, tags?: unknown[]) => {
    tagsState.enabled = enabled;
    if (enabled && tags && tags.length > 0) {
      tagsState.multiTags = tags;
    }
  }),
};

const listMyPreferences = vi.fn();
const upsertMyPreference = vi.fn();

vi.mock('@/features/system/api/user/userPreferences', () => ({
  listMyPreferences: (...args: unknown[]) => listMyPreferences(...args),
  upsertMyPreference: (...args: unknown[]) => upsertMyPreference(...args),
}));

vi.mock('@/store/modules/preferences/localePreferences', () => ({
  useLocalePreferencesStore: () => localeStore,
}));

vi.mock('@/store/modules/preferences/themePreferences', () => ({
  useThemePreferencesStore: () => themeStore,
}));

vi.mock('@/store/modules/preferences/layoutPreferences', () => ({
  useLayoutPreferencesStore: () => layoutStore,
}));

vi.mock('@/store/modules/preferences/displayPreferences', () => ({
  useDisplayPreferencesStore: () => displayStore,
}));

vi.mock('@/store/modules/preferences/tags/tagsPreferences', () => ({
  useTagsPreferencesStore: () => tagsStore,
}));

vi.mock('@/core/preferences/persistence/tags', () => ({
  toPersistedTag: (tag: unknown) => tag,
  parseTagsPreferenceValue: (value: Record<string, unknown>) => (value.items as unknown[]) ?? [],
}));

describe('preferences sync（按域拆键往返）', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stopSync();
    localeState.locale = 'zh';
    Object.assign(themeState, { colorScheme: 'light', navTheme: 'light', primaryColor: '#006eff' });
    Object.assign(layoutState, { layout: 'vertical', sidebarStatus: true });
    Object.assign(displayState, {
      grey: false,
      weak: false,
      hideTabs: false,
      hideFooter: true,
      showLogo: true,
      showModel: 'smart',
      stretch: false,
    });
    tagsState.multiTags = [];
    tagsState.enabled = true;
    tagsStore.setEnabled.mockClear();
    localeStore.$patch.mockClear();
    localeStore.$mirrorToDevice.mockClear();
    themeStore.$patch.mockClear();
    themeStore.$mirrorToDevice.mockClear();
    layoutStore.$patch.mockClear();
    displayStore.$patch.mockClear();
    tagsStore.hydrateTags.mockClear();
    listMyPreferences.mockReset();
    upsertMyPreference.mockReset();
    upsertMyPreference.mockResolvedValue(undefined);
  });

  afterEach(() => {
    stopSync();
    vi.useRealTimers();
  });

  it('hydrateFromServer 分别灌入 locale / theme / layout / interface 并回写 Device LS', async () => {
    listMyPreferences.mockResolvedValue({
      items: [
        { configKey: UI_PREFERENCE_KEYS.LOCALE, configValue: { locale: 'en' } },
        {
          configKey: UI_PREFERENCE_KEYS.THEME,
          configValue: { colorScheme: 'dark', navTheme: 'default', primaryColor: '#1b2a47' },
        },
        { configKey: UI_PREFERENCE_KEYS.LAYOUT, configValue: { layout: 'mix', sidebarStatus: false } },
        { configKey: UI_PREFERENCE_KEYS.DISPLAY, configValue: { grey: true, hideTabs: true } },
      ],
    });

    await hydrateFromServer();

    expect(localeStore.$patch).toHaveBeenCalledWith({ locale: 'en' });
    expect(themeStore.$patch).toHaveBeenCalledWith({
      colorScheme: 'dark',
      navTheme: 'default',
      primaryColor: '#1b2a47',
    });
    expect(layoutStore.$patch).toHaveBeenCalledWith({ layout: 'mix', sidebarStatus: false });
    expect(displayStore.$patch).toHaveBeenCalledWith({ grey: true, hideTabs: true });
    expect(localeStore.$mirrorToDevice).toHaveBeenCalled();
    expect(themeStore.$mirrorToDevice).toHaveBeenCalled();
  });

  it('hydrateFromServer 从 ui.tags 读 enabled + items 灌入 multiTags', async () => {
    const tags = [{ path: '/welcome', name: 'Welcome' }];
    listMyPreferences.mockResolvedValue({
      items: [{ configKey: UI_PREFERENCE_KEYS.TAGS, configValue: { enabled: false, items: tags } }],
    });

    await hydrateFromServer();

    expect(tagsStore.hydrateTags).toHaveBeenCalledWith(false, tags);
  });

  it('schedulePreferenceSync(LOCALE) upsert 仅含 locale', async () => {
    localeState.locale = 'en';
    startSync();
    schedulePreferenceSync(UI_PREFERENCE_KEYS.LOCALE);

    await vi.advanceTimersByTimeAsync(700);

    expect(upsertMyPreference).toHaveBeenCalledWith({
      configKey: UI_PREFERENCE_KEYS.LOCALE,
      configValue: { locale: 'en' },
    });
  });

  it('schedulePreferenceSync(THEME) upsert 仅含主题字段', async () => {
    Object.assign(themeState, { colorScheme: 'dark', navTheme: 'pink', primaryColor: '#eb2f96' });
    startSync();
    schedulePreferenceSync(UI_PREFERENCE_KEYS.THEME);

    await vi.advanceTimersByTimeAsync(700);

    expect(upsertMyPreference).toHaveBeenCalledWith({
      configKey: UI_PREFERENCE_KEYS.THEME,
      configValue: { colorScheme: 'dark', navTheme: 'pink', primaryColor: '#eb2f96' },
    });
  });

  it('schedulePreferenceSync(LAYOUT) upsert 仅含布局壳字段', async () => {
    Object.assign(layoutState, { layout: 'horizontal', sidebarStatus: false });
    startSync();
    schedulePreferenceSync(UI_PREFERENCE_KEYS.LAYOUT);

    await vi.advanceTimersByTimeAsync(700);

    expect(upsertMyPreference).toHaveBeenCalledWith({
      configKey: UI_PREFERENCE_KEYS.LAYOUT,
      configValue: { layout: 'horizontal', sidebarStatus: false },
    });
  });

  it('schedulePreferenceSync(DISPLAY) upsert 仅含界面开关字段', async () => {
    Object.assign(displayState, { grey: true, hideTabs: true, showModel: 'card', stretch: 1440 });
    startSync();
    schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);

    await vi.advanceTimersByTimeAsync(700);

    expect(upsertMyPreference).toHaveBeenCalledWith({
      configKey: UI_PREFERENCE_KEYS.DISPLAY,
      configValue: {
        grey: true,
        weak: false,
        hideTabs: true,
        hideFooter: true,
        showLogo: true,
        showModel: 'card',
        stretch: 1440,
      },
    });
  });

  it('schedulePreferenceSync(TAGS) 组装 enabled + items', async () => {
    tagsState.multiTags = [{ path: '/welcome' }];
    tagsState.enabled = true;
    startSync();
    schedulePreferenceSync(UI_PREFERENCE_KEYS.TAGS);

    await vi.advanceTimersByTimeAsync(700);

    expect(upsertMyPreference).toHaveBeenCalledWith({
      configKey: UI_PREFERENCE_KEYS.TAGS,
      configValue: { enabled: true, items: [{ path: '/welcome' }] },
    });
  });
});
