import { useRoute, useRouter } from 'vue-router';

/** 个人空间入口路由 name */
export type PersonalWorkspaceRouteName =
  | 'PersonalProfile'
  | 'PersonalSecurity'
  | 'PersonalLoginLog'
  | 'PersonalInbox'
  | 'PersonalFiles'
  | 'PersonalFileRecycle';

/**
 * 打开个人空间（全页壳），并记录返回来源
 * @returns 打开方法
 */
export function useOpenPersonalWorkspace() {
  const router = useRouter();
  const route = useRoute();

  /**
   * 打开个人空间指定分区
   * @param routeName 目标子路由 name
   */
  function openPersonalWorkspace(routeName: PersonalWorkspaceRouteName = 'PersonalProfile') {
    void router.push({
      name: routeName,
      state: { Personal: route.fullPath },
    });
  }

  return { openPersonalWorkspace };
}
