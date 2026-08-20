import { getMyProfile, type MeProfileResponse } from '@/features/system/api/user/user-me';
import { readStoredUserProfileEntry, writeUserProfileToStorage } from './userProfileStorage';
import { syncUserProfileToStore } from './userProfileSync';
import type { UserProfileSnapshot } from '../types';

let displayProfileHydrated = false;

/**
 * 将会话展示资料写入 Store 与本地缓存（保留授权字段与 expires）。
 * @param display 服务端展示资料
 */
export function applyUserDisplayProfile(display: MeProfileResponse): void {
  const previous = readStoredUserProfileEntry();
  if (!previous?.userId || !previous.username || !previous.roles || !previous.permissions) {
    return;
  }

  const profile: UserProfileSnapshot = {
    avatar: display.avatar ?? '',
    username: display.username,
    nickname: display.nickname ?? '',
    primaryDeptId: display.primaryDeptId ?? '',
    primaryDeptName: display.primaryDeptName ?? '',
    roles: previous.roles,
    permissions: previous.permissions,
    userId: previous.userId,
  };
  syncUserProfileToStore(profile);
  writeUserProfileToStorage(profile, previous.expires ?? 0);
}

/**
 * 登录或会话恢复后拉取服务端展示资料（含主部门），幂等。
 */
export async function hydrateUserDisplayProfileOnSession(): Promise<void> {
  if (displayProfileHydrated) {
    return;
  }
  const profile = await getMyProfile();
  applyUserDisplayProfile(profile);
  displayProfileHydrated = true;
}

/**
 * 重置展示资料水合标记（登出时调用）。
 */
export function resetUserDisplayProfileHydration(): void {
  displayProfileHydrated = false;
}
