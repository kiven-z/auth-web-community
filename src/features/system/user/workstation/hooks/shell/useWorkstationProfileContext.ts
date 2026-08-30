import type { SysUserProfileResponse } from '@/features/system/api/user/userBase';
import type { InjectionKey, Ref } from 'vue';

/** 工作台壳层档案上下文（侧栏头像/昵称与资料面板同步） */
export interface WorkstationProfileContext {
  /** 当前用户档案 */
  profile: Ref<SysUserProfileResponse | null>;
  /**
   * 合并更新壳层档案（资料保存、头像更新后调用）
   * @param patch 局部字段
   */
  patchProfile: (patch: Partial<SysUserProfileResponse>) => void;
}

/** 工作台档案上下文注入键 */
export const WORKSTATION_PROFILE_KEY: InjectionKey<WorkstationProfileContext> = Symbol('UserWorkstationProfile');
