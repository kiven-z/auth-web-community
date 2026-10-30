import type { PiniaPlugin } from 'pinia';
import { useDisplayPreferencesStore } from './display-preferences';
import { useLayoutPreferencesStore } from './layout-preferences';
import { useLocalePreferencesStore } from './locale-preferences';
import { type PersistedPreferences, writeSavedPreferences } from './preferences-storage';
import { toPersistedTag, useTagsPreferencesStore } from './tags/tags-preferences';
import { useThemePreferencesStore } from './theme-preferences';

const PERSISTED_STORE_IDS = new Set([
  'locale-preferences',
  'theme-preferences',
  'layout-preferences',
  'display-preferences',
  'tags-preferences',
]);

let persistPaused = false;
let lastPersisted = '';

/**
 * 暂停偏好落盘（退出登录清空缓存时使用）
 */
export function pausePreferencesPersistence(): void {
  persistPaused = true;
  lastPersisted = '';
}

/** 恢复偏好落盘 */
export function resumePreferencesPersistence(): void {
  persistPaused = false;
}

function collectPersistedPreferences(): PersistedPreferences {
  const localeStore = useLocalePreferencesStore();
  const themeStore = useThemePreferencesStore();
  const layoutStore = useLayoutPreferencesStore();
  const displayStore = useDisplayPreferencesStore();
  const tagsStore = useTagsPreferencesStore();
  const persisted: PersistedPreferences = {
    locale: localeStore.locale,
    colorScheme: themeStore.colorScheme,
    navTheme: themeStore.navTheme,
    primaryColor: themeStore.primaryColor,
    layout: layoutStore.layout,
    sidebarStatus: layoutStore.sidebarStatus,
    weak: displayStore.weak,
    hideFooter: displayStore.hideFooter,
  };
  if (tagsStore.hasSavedTags) {
    persisted.multiTags = tagsStore.multiTags.map(toPersistedTag);
  }
  return persisted;
}

function persistPreferences(): void {
  if (persistPaused) {
    return;
  }
  const snapshot = collectPersistedPreferences();
  const raw = JSON.stringify(snapshot);
  if (raw === lastPersisted) {
    return;
  }
  lastPersisted = raw;
  writeSavedPreferences(snapshot);
}

/**
 * 任一偏好 store 变更后，写入同一 localStorage 键。运行时字段不写入
 */
export const preferencesPersistencePlugin: PiniaPlugin = ({ store }) => {
  if (!PERSISTED_STORE_IDS.has(store.$id)) {
    return;
  }
  lastPersisted = '';
  store.$subscribe(persistPreferences, { flush: 'sync', detached: true });
};
