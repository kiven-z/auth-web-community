import { API_SUCCESS_CODE } from '@/core/config/httpConfig';
import { ApiBusinessError } from '@/core/http/apiError';
import { createHttpAxiosInstance } from '@/core/http/axiosDefaults';
import { http } from '@/core/http/client';
import type { ApiResult } from '@/core/http/types';
import type { AxiosInstance } from 'axios';
import type {
  EmailLoginRequest,
  RefreshTokenResponse,
  SmsLoginRequest,
  UserLoginResponse,
  UsernamePasswordLoginRequest,
} from './models/auth';

export type {
  EmailLoginRequest,
  RefreshTokenResponse,
  SmsLoginRequest,
  UserLoginResponse,
  UsernamePasswordLoginRequest,
} from './models/auth';

/** 公开接口：不注入 Authorization，失败不走鉴权恢复登出 */
const SKIP_AUTH = { skipAuth: true } as const;

/** 刷新专用裸客户端（无鉴权/恢复拦截器），禁止改用 {@link http} */
let refreshAxiosClient: AxiosInstance | null = null;

function getRefreshAxiosClient(): AxiosInstance {
  refreshAxiosClient ??= createHttpAxiosInstance();
  return refreshAxiosClient;
}

/**
 * 用户名密码登录
 * @see auth-server AuthController — `POST /api/auth/login/username`
 */
export const loginByUsernameApi = (data: UsernamePasswordLoginRequest) => {
  return http.request<UserLoginResponse>('post', 'auth/login/username', { data }, SKIP_AUTH);
};

/**
 * 邮箱登录
 * @see auth-server AuthController — `POST /api/auth/login/email`
 */
export const loginByEmailApi = (data: EmailLoginRequest) => {
  return http.request<UserLoginResponse>('post', 'auth/login/email', { data }, SKIP_AUTH);
};

/**
 * 发送邮箱验证码
 * @see auth-server AuthController — `POST /api/auth/message/login/email/send-code`
 */
export const sendEmailCodeApi = (params: { email: string }) => {
  return http.request<string>('post', 'auth/message/login/email/send-code', { params }, SKIP_AUTH);
};

/**
 * 短信登录
 * @see auth-server AuthController — `POST /api/auth/login/sms`
 */
export const loginBySmsApi = (data: SmsLoginRequest) => {
  return http.request<UserLoginResponse>('post', 'auth/login/sms', { data }, SKIP_AUTH);
};

/**
 * 发送短信验证码
 * @see auth-server AuthController — `POST /api/auth/message/login/sms/send-code`
 */
export const sendSmsCodeApi = (params: { phone: string }) => {
  return http.request<string>('post', 'auth/message/login/sms/send-code', { params }, SKIP_AUTH);
};

/**
 * 退出登录（需携带 Authorization）
 * @see auth-server AuthController — `POST /api/auth/logout`
 */
export const logoutApi = () => {
  return http.request<void>('post', 'auth/logout');
};

/**
 * 刷新 accessToken（裸客户端，不经 http 拦截器）。
 * 仅返回载荷；写入会话由 `accessTokenRefresh`（单飞刷新）负责。
 *
 * @see auth-server AuthController — `POST /api/auth/refresh-token`
 */
export async function refreshTokenApi(): Promise<RefreshTokenResponse> {
  const response = await getRefreshAxiosClient().post('auth/refresh-token');
  const raw = response.data as ApiResult<RefreshTokenResponse>;

  if (raw.code !== API_SUCCESS_CODE) {
    throw new ApiBusinessError(raw, response.status);
  }

  const body = raw.data;
  if (!body?.accessToken || !body.username || !body.id || !body.roles || !body.permissions) {
    throw new Error('Refresh token response is missing required session fields.');
  }
  return body;
}
