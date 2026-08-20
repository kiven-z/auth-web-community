/** 刷新令牌响应 */
export interface RefreshTokenResponse {
  id: string;
  username: string;
  roles: string[];
  permissions: string[];
  accessToken: string;
  /** 令牌过期时间 */
  expires: string;
  readMeDay?: number;
}

/**
 * 用户登录响应（与刷新同形：仅鉴权会话字段；展示资料走 GET /system/me/profile）
 */
export type UserLoginResponse = RefreshTokenResponse;

/**
 * 用户名密码登录请求
 */
export interface UsernamePasswordLoginRequest {
  username: string;
  password: string;
  /** 是否记住登录 */
  rememberMe?: boolean;
}

/**
 * 邮箱登录请求
 */
export interface EmailLoginRequest {
  email: string;
  code: string;
  rememberMe?: boolean;
}

/**
 * 短信登录请求
 */
export interface SmsLoginRequest {
  phone: string;
  code: string;
  rememberMe?: boolean;
}
