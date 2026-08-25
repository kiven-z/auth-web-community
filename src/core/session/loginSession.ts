import type { UserLoginResponse } from '@/api/auth/models/auth';
import { hydrateAuthenticatedSessionSideEffects } from '@/core/session/sessionBootstrap';
import { applyRememberPreferencesFromResponse } from './remember/rememberPreferences';
import { setToken } from './token/sessionToken';
import type { SessionTokenPayload } from './types';

/**
 * 建立会话时的记住登录选项
 */
interface EstablishSessionRememberOptions {
  isRemembered: boolean;
}

/**
 * 执行登录请求并建立本地会话（供各登录表单复用）
 * 鉴权写入 setToken 后 await 会话副作用 hydrate，避免顶栏依赖登录体中的展示字段
 * @param fetchLogin 登录请求（请求体应含 rememberMe）
 * @param rememberOptions 记住登录选项
 * @returns 登录响应
 */
export async function establishSessionFromLogin(
  fetchLogin: () => Promise<UserLoginResponse>,
  rememberOptions: EstablishSessionRememberOptions
): Promise<UserLoginResponse> {
  const body = await fetchLogin();
  applyRememberPreferencesFromResponse(rememberOptions.isRemembered, body.readMeDay);

  const sessionPayload: SessionTokenPayload = {
    accessToken: body.accessToken,
    expires: body.expires,
    username: body.username,
    roles: body.roles,
    permissions: body.permissions,
    userId: body.id,
  };
  setToken(sessionPayload);

  await hydrateAuthenticatedSessionSideEffects();
  return body;
}
