import type { UserProfileSnapshot } from '../types';

type UserProfileSyncHandler = (profile: UserProfileSnapshot) => void;

let userProfileSyncHandler: UserProfileSyncHandler | null = null;

/**
 * 注册用户资料同步处理器。
 * @param handler 同步处理器
 */
export function registerUserProfileSync(handler: UserProfileSyncHandler): void {
  userProfileSyncHandler = handler;
}

/**
 * 将用户资料同步到已注册的外部 Store。
 * @param profile 用户资料快照
 */
export function syncUserProfileToStore(profile: UserProfileSnapshot): void {
  userProfileSyncHandler?.(profile);
}
