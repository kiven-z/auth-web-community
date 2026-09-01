import { DEVICE_UI_STORAGE_KEY } from '@/core/config/keys-config';
import { storageLocal } from '@/core/storage/storage-local';

/** 本机外观偏好（语言 + 主题；冷启动缓存） */
export interface DeviceUiPreferences {
  locale?: string;
  colorScheme?: string;
  navTheme?: string;
  primaryColor?: string;
}

/**
 * 读取本机外观偏好
 * @returns 已存对象；无缓存时为 null
 */
export function readDeviceUiPreferences(): DeviceUiPreferences | null {
  const raw = storageLocal().getItem<DeviceUiPreferences>(DEVICE_UI_STORAGE_KEY);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  return raw;
}

/**
 * 合并写入本机外观偏好
 * @param patch 待合并字段
 */
export function writeDeviceUiPreferences(patch: DeviceUiPreferences): void {
  storageLocal().setItem(DEVICE_UI_STORAGE_KEY, {
    ...readDeviceUiPreferences(),
    ...patch,
  });
}

/**
 * 清除本机外观偏好（显式「重置偏好」时调用）
 */
export function clearDeviceUiPreferences(): void {
  storageLocal().removeItem(DEVICE_UI_STORAGE_KEY);
}
