import { useThemePreferencesStore } from '@/store/modules/preferences/themePreferences';

let stopWatch: (() => void) | null = null;

/**
 * 在 colorScheme 为 system 时按 OS 偏好刷新 DOM（不改写 navTheme 偏好）
 */
export function syncSystemThemeFromOs(): void {
  const themeStore = useThemePreferencesStore();
  if (themeStore.colorScheme !== 'system') {
    return;
  }
  themeStore.$applyToDom();
}

/**
 * 全局监听 prefers-color-scheme（幂等，重复调用不会叠加监听）
 * @returns 取消监听
 */
export function startSystemThemeWatch(): () => void {
  if (stopWatch) {
    return stopWatch;
  }

  const mediaQueryList = globalThis.matchMedia('(prefers-color-scheme: dark)');
  mediaQueryList.addEventListener('change', syncSystemThemeFromOs);

  stopWatch = () => {
    mediaQueryList.removeEventListener('change', syncSystemThemeFromOs);
    stopWatch = null;
  };
  return stopWatch;
}
