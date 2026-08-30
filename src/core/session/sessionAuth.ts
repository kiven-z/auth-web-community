import { multipleTabsKey } from '@/auth/config/auth/auth-config';
import Cookies from 'js-cookie';
import { readStoredUserProfileEntry } from './profile/userProfileStorage';

/**
 * 是否已设置多标签页登录标志 Cookie。
 */
function hasMultipleTabsSession(): boolean {
  return Cookies.get(multipleTabsKey) !== undefined;
}

/**
 * localStorage 中是否存在已持久化的用户资料。
 */
function hasPersistedUserProfile(): boolean {
  return readStoredUserProfileEntry() !== null;
}

/**
 * 是否视为已登录（多标签 Cookie + 用户资料均存在）。
 * 与路由守卫判定逻辑一致，避免在 guard 中散落 storage 读取。
 */
export function isLoggedIn(): boolean {
  return hasMultipleTabsSession() && hasPersistedUserProfile();
}
