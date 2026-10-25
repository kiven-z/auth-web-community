import { APP_CONFIG } from '@/core/config/app-config';
import { storageLocal } from '@/core/storage/storage-local';

/**
 * 会话偏好。
 */
interface SessionPreferences {
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
  const raw = storageLocal().getItem<Partial<SessionPreferences>>(APP_CONFIG.storage.sessionPreferences);
  if (!raw) {
    return { ...DEFAULT_SESSION_PREFERENCES };
  }
  return {
    isRemembered: raw.isRemembered ?? DEFAULT_SESSION_PREFERENCES.isRemembered,
    loginDay: raw.loginDay ?? DEFAULT_SESSION_PREFERENCES.loginDay,
  };
}

/**
 * 写入会话偏好。
 * @param preferences 待合并的偏好字段
 */
export function writeSessionPreferences(preferences: Partial<SessionPreferences>): void {
  const merged = {
    ...readSessionPreferences(),
    ...preferences,
  };
  storageLocal().setItem(APP_CONFIG.storage.sessionPreferences, merged);
}

/**
 * 清除会话偏好。
 */
export function clearSessionPreferences(): void {
  storageLocal().removeItem(APP_CONFIG.storage.sessionPreferences);
}
