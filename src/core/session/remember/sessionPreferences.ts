import { storageLocal } from '@/core/storage/storageLocal';

/** localStorage 中「记住登录」相关偏好键名 */
const SESSION_PREFERENCES_KEY = 'session-preferences';

/**
 * 会话偏好（记住登录天数等，供多标签 Cookie 过期策略使用）。
 */
export interface SessionPreferences {
  isRemembered: boolean;
  loginDay: number;
}

const DEFAULT_SESSION_PREFERENCES: SessionPreferences = {
  isRemembered: false,
  loginDay: 7,
};

/**
 * 读取会话偏好；无缓存时返回默认值。
 */
export function readSessionPreferences(): SessionPreferences {
  const raw = storageLocal().getItem<Partial<SessionPreferences>>(SESSION_PREFERENCES_KEY);
  if (!raw) {
    return { ...DEFAULT_SESSION_PREFERENCES };
  }
  return {
    isRemembered: raw.isRemembered ?? DEFAULT_SESSION_PREFERENCES.isRemembered,
    loginDay: raw.loginDay ?? DEFAULT_SESSION_PREFERENCES.loginDay,
  };
}

/**
 * 写入会话偏好（局部更新）。
 * @param preferences 待合并的偏好字段
 */
export function writeSessionPreferences(preferences: Partial<SessionPreferences>): void {
  const merged = {
    ...readSessionPreferences(),
    ...preferences,
  };
  storageLocal().setItem(SESSION_PREFERENCES_KEY, merged);
}

/**
 * 清除会话偏好（登出时调用）。
 */
export function clearSessionPreferences(): void {
  storageLocal().removeItem(SESSION_PREFERENCES_KEY);
}
