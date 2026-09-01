import { beforeEach, describe, expect, it, vi } from 'vitest';

const memory = new Map<string, unknown>();

vi.mock('@/core/config/keys-config', () => ({
  DEVICE_UI_STORAGE_KEY: 'test-device',
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

import {
  clearDeviceUiPreferences,
  readDeviceUiPreferences,
  writeDeviceUiPreferences,
} from '@/core/preferences/persistence/device-storage';

describe('deviceStorage', () => {
  beforeEach(() => {
    memory.clear();
  });

  it('write / read 本机语言与主题', () => {
    writeDeviceUiPreferences({ locale: 'en', colorScheme: 'dark' });
    expect(readDeviceUiPreferences()).toMatchObject({ locale: 'en', colorScheme: 'dark' });

    writeDeviceUiPreferences({ primaryColor: '#409eff' });
    expect(readDeviceUiPreferences()).toMatchObject({
      locale: 'en',
      colorScheme: 'dark',
      primaryColor: '#409eff',
    });
  });

  it('clear 后读不到本机外观', () => {
    writeDeviceUiPreferences({ locale: 'en' });
    clearDeviceUiPreferences();
    expect(readDeviceUiPreferences()).toBeNull();
  });
});
