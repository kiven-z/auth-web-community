import type { UserProfileSnapshot } from '../types';

type UserProfileSyncHandler = (profile: UserProfileSnapshot) => void;

let userProfileSyncHandler: UserProfileSyncHandler | null = null;

/**
 * 注册用户资料同步处理器（由应用启动阶段注入，通常写入 Pinia）。
 * @param handler 同步处理器
 */
export function registerUserProfileSync(handler: UserProfileSyncHandler): void {
  userProfileSyncHandler = handler;
}

/**
 * 将用户资料同步到已注册的外部 Store（若已注册）。
 * @param profile 用户资料快照
 */
export function syncUserProfileToStore(profile: UserProfileSnapshot): void {
  userProfileSyncHandler?.(profile);
}
