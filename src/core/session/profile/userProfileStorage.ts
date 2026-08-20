import { userKey } from '@/auth/config/auth/auth-config';
import { storageLocal } from '@/core/storage/storageLocal';
import type { DataInfo, UserProfileSnapshot } from '../types';

/**
 * 读取 localStorage 中的完整用户资料条目。
 * @returns 用户资料条目，不存在时返回 null
 */
export function readStoredUserProfileEntry(): DataInfo<number> | null {
  return storageLocal().getItem<DataInfo<number>>(userKey);
}

/**
 * 从 localStorage 读取已缓存的用户展示信息（单一读取入口，供 Pinia 初始化等使用）。
 * @returns 用户展示信息
 */
export function readUserProfileFromStorage(): Partial<DataInfo<number>> {
  return readStoredUserProfileEntry() ?? {};
}

/**
 * 将用户资料写入 localStorage（key 为 userKey）。
 * @param profile 用户资料快照
 * @param expires 过期时间（毫秒时间戳）
 */
export function writeUserProfileToStorage(profile: UserProfileSnapshot, expires: number): void {
  storageLocal().setItem(userKey, {
    expires,
    avatar: profile.avatar,
    username: profile.username,
    nickname: profile.nickname,
    primaryDeptId: profile.primaryDeptId,
    primaryDeptName: profile.primaryDeptName,
    roles: profile.roles,
    permissions: profile.permissions,
    userId: profile.userId,
  });
}

/**
 * 清除 localStorage 中的用户资料条目。
 */
export function clearUserProfileFromStorage(): void {
  storageLocal().removeItem(userKey);
}
