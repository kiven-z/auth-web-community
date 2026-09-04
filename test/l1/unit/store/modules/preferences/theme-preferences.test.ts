import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/preferences/persistence/sync', () => ({
  schedulePreferenceSync: vi.fn(),
}));

vi.mock('@/core/preferences/persistence/device-storage', () => ({
  readDeviceUiPreferences: () => null,
  writeDeviceUiPreferences: vi.fn(),
}));

import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';

interface MockMediaQueryList {
  matches: boolean;
  addEventListener: (type: string, listener: (event: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: string, listener: (event: MediaQueryListEvent) => void) => void;
  dispatch: (matches: boolean) => void;
}

function mockMatchMedia(initial: boolean): MockMediaQueryList {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQueryList: MockMediaQueryList = {
    matches: initial,
    addEventListener(_type, listener) {
      listeners.add(listener);
    },
    removeEventListener(_type, listener) {
      listeners.delete(listener);
    },
    dispatch(matches) {
      this.matches = matches;
      for (const listener of listeners) {
        listener({ matches } as MediaQueryListEvent);
      }
    },
  };
  vi.stubGlobal('matchMedia', () => mediaQueryList);
  return mediaQueryList;
}

describe('isDarkMode × OS prefers-color-scheme', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('colorScheme=system 时 OS 明暗变化会使 isDarkMode 重算', () => {
    const store = useThemePreferencesStore();
    store.$patch({ colorScheme: 'system', osPrefersDark: false });
    expect(store.isDarkMode).toBe(false);

    store.$patch({ osPrefersDark: true });
    expect(store.isDarkMode).toBe(true);
  });

  it('colorScheme=light 时不受 OS 明暗影响', () => {
    const store = useThemePreferencesStore();
    store.$patch({ colorScheme: 'light', osPrefersDark: true });
    expect(store.isDarkMode).toBe(false);
  });
});

describe('$startSystemThemeWatch', () => {
  let stopWatch: (() => void) | undefined;

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    stopWatch?.();
    stopWatch = undefined;
    vi.unstubAllGlobals();
  });

  it('OS 主题变化时更新 osPrefersDark 并在 system 模式下 apply DOM', () => {
    const media = mockMatchMedia(false);
    const store = useThemePreferencesStore();
    store.$patch({ colorScheme: 'system' });
    const applyToDom = vi.spyOn(store, '$applyToDom').mockImplementation(() => undefined);

    stopWatch = store.$startSystemThemeWatch();
    expect(store.osPrefersDark).toBe(false);
    expect(store.isDarkMode).toBe(false);
    applyToDom.mockClear();

    media.dispatch(true);

    expect(store.osPrefersDark).toBe(true);
    expect(store.isDarkMode).toBe(true);
    expect(applyToDom).toHaveBeenCalledTimes(1);
  });

  it('非 system 时 OS 变化只更新 osPrefersDark，不 apply DOM', () => {
    const media = mockMatchMedia(false);
    const store = useThemePreferencesStore();
    store.$patch({ colorScheme: 'light' });
    const applyToDom = vi.spyOn(store, '$applyToDom').mockImplementation(() => undefined);

    stopWatch = store.$startSystemThemeWatch();
    applyToDom.mockClear();

    media.dispatch(true);

    expect(store.osPrefersDark).toBe(true);
    expect(store.isDarkMode).toBe(false);
    expect(applyToDom).not.toHaveBeenCalled();
  });
});
