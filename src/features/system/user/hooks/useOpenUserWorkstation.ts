import { useRoute, useRouter } from 'vue-router';

/**
 * 从用户列表打开工作台，并记录返回来源。
 * @returns 打开方法
 */
export function useOpenUserWorkstation() {
  const router = useRouter();
  const route = useRoute();

  /**
   * 打开指定用户的工作台
   * @param userId 用户主键
   */
  function openUserWorkstation(userId: string) {
    void router.push({
      name: 'UserWorkstationOverview',
      params: { userId },
      state: { UserWorkstation: route.fullPath },
    });
  }

  return { openUserWorkstation };
}
