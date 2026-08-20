import { applyThemePreferences } from './apply';
import { getLayoutSnapshot } from '../persistence/storage';

let stopWatch: (() => void) | null = null;

function onSystemThemeChange() {
  syncSystemThemeFromOs();
}

/**
 * 在 colorScheme 为 system 时按 OS 偏好刷新 DOM（不改写 navTheme 偏好）
 */
export function syncSystemThemeFromOs(): void {
  const snapshot = getLayoutSnapshot();
  if (snapshot.colorScheme !== 'system') {
    return;
  }
  applyThemePreferences();
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
  mediaQueryList.addEventListener('change', onSystemThemeChange);

  stopWatch = () => {
    mediaQueryList.removeEventListener('change', onSystemThemeChange);
    stopWatch = null;
  };
  return stopWatch;
}
