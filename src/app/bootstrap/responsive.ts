import type { App } from 'vue';
import { reactive } from 'vue';
import { responsiveStorageNameSpace } from '@/auth/config';
import { createDefaultUiPreferences } from '@/core/preferences/defaults/preference-defaults';
import { mergeDeviceIntoUiPreferences } from '@/core/preferences/persistence/device-storage';
import { storageLocal } from '@/core/storage/storageLocal';

/** UI 偏好内存态（语言/主题由 Device LS 注入；其余登录后可 hydrate） */
let uiPreferenceState: ResponsiveStorage | null = null;

/** 历史分 key UI 偏好落盘键（迁移期清除） */
const LEGACY_UI_PREFERENCE_STORAGE_SUFFIXES = ['locale', 'layout', 'configure', 'tags'] as const;

/**
 * 清除历史 UI 偏好 localStorage（locale / layout / configure / tags 分 key）
 */
function clearLegacyUiPreferenceLocalStorage(): void {
  const nameSpace = responsiveStorageNameSpace();
  const local = storageLocal();
  for (const suffix of LEGACY_UI_PREFERENCE_STORAGE_SUFFIXES) {
    local.removeItem(`${nameSpace}${suffix}`);
  }
}

/**
 * 获取已注入的 UI 偏好内存态（须先 {@link injectResponsiveStorage}）
 * @returns locale / layout / configure 响应式对象
 */
export function getResponsiveStorage(): ResponsiveStorage {
  if (!uiPreferenceState) {
    throw new Error('UI preference state is not injected');
  }
  return uiPreferenceState;
}

/**
 * 注入 UI 偏好内存态：出厂默认 ⊕ Device LS（语言 / 主题）。
 * 须在 setupStore / router 之前调用；登录后服务端 hydrate 不覆盖语言/主题。
 * @param app Vue 应用实例
 */
export function injectResponsiveStorage(app: App): void {
  if (uiPreferenceState) {
    return;
  }

  clearLegacyUiPreferenceLocalStorage();
  uiPreferenceState = reactive(mergeDeviceIntoUiPreferences(createDefaultUiPreferences()));
  app.config.globalProperties.$storage = uiPreferenceState;
}
