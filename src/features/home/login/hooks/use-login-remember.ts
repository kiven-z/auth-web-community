import type { UserLoginResponse } from '@/api/auth/models/auth';
import { establishSessionFromLogin } from '@/core/session/login-session';
import { readSessionPreferences } from '@/core/session/remember/session-preferences';
import { useUserStore } from '@/store/modules/auth/user';
import { ref } from 'vue';

/**
 * 登录页「记住登录」：请求传 rememberMe，登录成功后用响应 readMeDay 写 session 偏好。
 * @returns 记住登录相关状态与方法
 */
export function useLoginRemember() {
  const preferences = readSessionPreferences();
  const isRemembered = ref(preferences.isRemembered);

  /**
   * 将 session 中的记住登录偏好同步到 Pinia
   */
  function syncRememberToStore(): void {
    const prefs = readSessionPreferences();
    useUserStore().SET_LOGIN_PREFERENCES(prefs.isRemembered, prefs.loginDay);
  }

  /**
   * 执行登录、写入 remember 偏好、建立会话并同步 Store。
   * @param fetchLogin 须携带 rememberMe 的登录请求
   */
  async function loginAndEstablishSession(fetchLogin: () => Promise<UserLoginResponse>): Promise<UserLoginResponse> {
    const body = await establishSessionFromLogin(fetchLogin, { isRemembered: isRemembered.value });
    syncRememberToStore();
    return body;
  }

  return {
    isRemembered,
    syncRememberToStore,
    loginAndEstablishSession,
  };
}
