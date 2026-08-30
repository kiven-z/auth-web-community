import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultUiPreferences } from '@/core/preferences/defaults/preference-defaults';

const memory = new Map<string, unknown>();

vi.mock('@/auth/config', () => ({
  responsiveStorageNameSpace: () => 'test-',
}));

vi.mock('@/core/storage/storageLocal', () => ({
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

import {
  clearDeviceUiPreferences,
  mergeDeviceIntoUiPreferences,
  readDeviceUiPreferences,
  writeDeviceUiPreferences,
} from '@/core/preferences/persistence/device-storage';

describe('device-storage', () => {
  beforeEach(() => {
    memory.clear();
  });

  it('write / read / merge 本机语言与主题', () => {
    writeDeviceUiPreferences({ locale: 'en', colorScheme: 'dark' });
    expect(readDeviceUiPreferences()).toMatchObject({ locale: 'en', colorScheme: 'dark' });

    writeDeviceUiPreferences({ primaryColor: '#409eff' });
    expect(readDeviceUiPreferences()).toMatchObject({
      locale: 'en',
      colorScheme: 'dark',
      primaryColor: '#409eff',
    });

    const merged = mergeDeviceIntoUiPreferences(createDefaultUiPreferences());
    expect(merged.locale.locale).toBe('en');
    expect(merged.layout.colorScheme).toBe('dark');
    expect(merged.layout.primaryColor).toBe('#409eff');
  });

  it('clear 后 merge 回落出厂默认', () => {
    writeDeviceUiPreferences({ locale: 'en' });
    clearDeviceUiPreferences();
    expect(readDeviceUiPreferences()).toBeNull();

    const defaults = createDefaultUiPreferences();
    expect(mergeDeviceIntoUiPreferences(defaults)).toEqual({
      locale: { ...defaults.locale },
      layout: { ...defaults.layout },
      configure: { ...defaults.configure },
      tags: [...(defaults.tags ?? [])],
    });
  });
});
