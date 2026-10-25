import { APP_CONFIG } from '@/core/config/app-config';
import Cookies from 'js-cookie';
import { readStoredUserProfileEntry } from './profile/user-profile-storage';

/**
 * 是否已设置多标签页登录标志 Cookie。
 */
function hasMultipleTabsSession(): boolean {
  return Cookies.get(APP_CONFIG.storage.sessionCookie) !== undefined;
}

/**
 * localStorage 中是否存在已持久化的用户资料。
 */
function hasPersistedUserProfile(): boolean {
  return readStoredUserProfileEntry() !== null;
}

/**
 * 是否视为已登录。
 */
export function isLoggedIn(): boolean {
  return hasMultipleTabsSession() && hasPersistedUserProfile();
}
