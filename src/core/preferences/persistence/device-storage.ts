import { responsiveStorageNameSpace } from '@/auth/config';
import { storageLocal } from '@/core/storage/storageLocal';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';

/** 本机外观偏好（语言 + 主题；不经服务端） */
export interface DeviceUiPreferences {
  locale?: string;
  colorScheme?: string;
  navTheme?: string;
  primaryColor?: string;
}

/** layout 中归属本机的主题字段 */
const DEVICE_LAYOUT_KEYS = ['colorScheme', 'navTheme', 'primaryColor'] as const;

/**
 * Device 偏好 localStorage 键
 * @returns 命名空间后缀后的键名
 */
function deviceStorageKey(): string {
  return `${responsiveStorageNameSpace()}device`;
}

/**
 * 读取本机外观偏好
 * @returns 已存对象；无缓存时为 null
 */
export function readDeviceUiPreferences(): DeviceUiPreferences | null {
  const raw = storageLocal().getItem<DeviceUiPreferences>(deviceStorageKey());
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
  storageLocal().setItem(deviceStorageKey(), {
    ...readDeviceUiPreferences(),
    ...patch,
  });
}

/**
 * 清除本机外观偏好（显式「重置偏好」时调用）
 */
export function clearDeviceUiPreferences(): void {
  storageLocal().removeItem(deviceStorageKey());
}

/**
 * 将 Device 偏好叠到出厂默认快照（启动注入用）
 * @param defaults 平台默认 locale / layout / configure / tags
 * @returns 叠合后的完整偏好快照
 */
export function mergeDeviceIntoUiPreferences(
  defaults: Pick<ResponsiveStorage, 'locale' | 'layout' | 'configure' | 'tags'>
): Pick<ResponsiveStorage, 'locale' | 'layout' | 'configure' | 'tags'> {
  const device = readDeviceUiPreferences();
  if (!device) {
    return {
      locale: { ...defaults.locale },
      layout: { ...defaults.layout },
      configure: { ...defaults.configure },
      tags: [...(defaults.tags ?? [])],
    };
  }

  return {
    locale: {
      ...defaults.locale,
      ...(device.locale !== undefined ? { locale: device.locale } : {}),
    },
    layout: {
      ...defaults.layout,
      ...omitBy(pick(device, DEVICE_LAYOUT_KEYS), isUndefined),
    },
    configure: { ...defaults.configure },
    tags: [...(defaults.tags ?? [])],
  };
}
