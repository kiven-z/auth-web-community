import { MULTIPLE_TABS_COOKIE_KEY } from '@/core/config/keys-config';
import { getAccessTokenStore } from '@/core/session/token/access-token-read-writer';
import Cookies from 'js-cookie';
import { clearSessionPreferences, readSessionPreferences } from '../remember/session-preferences';
import { resolveSessionExpires } from '../session-time';
import type { DataInfo, SessionTokenPayload, UserProfileSnapshot } from '../types';
import {
  clearUserProfileFromStorage,
  readStoredUserProfileEntry,
  readUserProfileFromStorage,
  writeUserProfileToStorage,
} from '../profile/user-profile-storage';
import { syncUserProfileToStore } from '../profile/user-profile-sync';

/**
 * 格式化 token（JWT 格式，供 Authorization 头使用）
 * @param token token
 * @returns 格式化后的 token
 */
export function formatToken(token: string): string {
  return `Bearer ${token}`;
}

/**
 * 是否存在可用 accessToken（开发环境由 DevLocalStorageAccessTokenStore 提供持久化）
 * @returns 是否存在可用 accessToken
 */
export function hasAccessToken(): boolean {
  return getAccessTokenStore().has();
}

/**
 * 获取 token
 * @returns 用户信息
 */
export function getToken(): DataInfo<number> {
  const profile = readUserProfileFromStorage();
  const accessToken = getAccessTokenStore().get();
  return {
    ...profile,
    accessToken,
  };
}

/**
 * 设置 token 以及一些必要信息并采用无感刷新 token 方案
 * 无感刷新：后端返回 accessToken（访问接口使用的 token）与 expires（accessToken 过期时间）
 * accessToken 的存放介质由 `getAccessTokenStore()` 按环境决定（生产内存 / 开发 localStorage）
 * 用户资料与过期时间保存在 key 为 USER_INFO_STORAGE_KEY 的 localStorage 里
 * @param data 会话所需载荷
 */
export function setToken(data: SessionTokenPayload): void {
  const { isRemembered, loginDay } = readSessionPreferences();
  const expires = resolveSessionExpires(data.expires);

  getAccessTokenStore().set({
    accessToken: data.accessToken,
    expires,
  });

  setMultipleTabsCookie(isRemembered, loginDay);

  const profile = resolveProfileForSetToken(data);
  syncUserProfileToStore(profile);
  writeUserProfileToStorage(profile, expires);
}

/**
 * 删除`token`以及key值为`user-info`的localStorage信息
 */
export function removeToken(): void {
  getAccessTokenStore().clear();
  Cookies.remove(MULTIPLE_TABS_COOKIE_KEY);
  clearUserProfileFromStorage();
  clearSessionPreferences();
}

/**
 * 设置多标签页 Cookie 标志
 * @param isRemembered 是否记住登录
 * @param loginDay 记住登录天数
 */
function setMultipleTabsCookie(isRemembered: boolean, loginDay: number): void {
  Cookies.set(MULTIPLE_TABS_COOKIE_KEY, 'true', isRemembered ? { expires: loginDay } : {});
}

/**
 * 根据 setToken 载荷解析待写入的用户资料。
 * 授权字段一律以本次载荷为准；展示字段仅在同一用户刷新时沿用本地缓存，否则留空待 profile hydrate。
 * @param data 会话所需载荷
 * @returns 用户资料快照
 */
function resolveProfileForSetToken(data: SessionTokenPayload): UserProfileSnapshot {
  const previous = readStoredUserProfileEntry();
  const sameUser = previous?.userId === data.userId;
  const display = sameUser
    ? {
        avatar: previous?.avatar ?? '',
        nickname: previous?.nickname ?? '',
        primaryDeptId: previous?.primaryDeptId ?? '',
        primaryDeptName: previous?.primaryDeptName ?? '',
      }
    : { avatar: '', nickname: '', primaryDeptId: '', primaryDeptName: '' };

  return {
    ...display,
    username: data.username,
    roles: data.roles,
    permissions: data.permissions,
    userId: data.userId,
  };
}
