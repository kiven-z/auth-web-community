import { http } from '@/core/http/client';
import { AUTH_API_PATHS } from './paths';
import type {
  EmailLoginRequest,
  SmsLoginRequest,
  UserLoginResponse,
  UsernamePasswordLoginRequest,
} from './models/auth';

export { AUTH_API_PATHS, AUTH_PUBLIC_API_PATH_SUFFIXES } from './paths';
export type {
  EmailLoginRequest,
  RefreshTokenResponse,
  SmsLoginRequest,
  UserLoginResponse,
  UsernamePasswordLoginRequest,
} from './models/auth';

/**
 * 用户名密码登录
 * @param data 用户名密码登录请求
 * @returns 用户登录响应
 */
export const loginByUsernameApi = (data: UsernamePasswordLoginRequest) => {
  return http.request<UserLoginResponse>('post', AUTH_API_PATHS.LOGIN_USERNAME, { data });
};

/**
 * 邮箱登录
 * @param data 邮箱登录请求
 * @returns 用户登录响应
 */
export const loginByEmailApi = (data: EmailLoginRequest) => {
  return http.request<UserLoginResponse>('post', AUTH_API_PATHS.LOGIN_EMAIL, { data });
};

/**
 * 发送邮箱验证码
 * @param params 邮箱地址
 * @returns 发送结果
 */
export const sendEmailCodeApi = (params: { email: string }) => {
  return http.request<string>('post', AUTH_API_PATHS.EMAIL_SEND_CODE, { params });
};

/**
 * 短信登录
 * @param data 短信登录请求
 * @returns 用户登录响应
 */
export const loginBySmsApi = (data: SmsLoginRequest) => {
  return http.request<UserLoginResponse>('post', AUTH_API_PATHS.LOGIN_SMS, { data });
};

/**
 * 发送短信验证码
 * @param params 手机号
 * @returns 发送结果
 */
export const sendSmsCodeApi = (params: { phone: string }) => {
  return http.request<string>('post', AUTH_API_PATHS.SMS_SEND_CODE, { params });
};
/**
 * 退出登录
 * @returns 退出登录响应
 */
export const logoutApi = () => {
  return http.request<void>('post', AUTH_API_PATHS.LOGOUT);
};
