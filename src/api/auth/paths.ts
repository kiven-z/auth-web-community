/**
 * 认证相关 URL 路径（相对 Axios baseURL `/api`，无首尾斜杠）。
 * 不引用 http，供 `http-config` 白名单与 API 层共用，避免循环依赖。
 *
 * @see auth-server AuthController — `@RequestMapping("/api/auth")`
 */
export const AUTH_API_PATHS = {
  LOGIN_USERNAME: 'auth/login/username',
  LOGIN_EMAIL: 'auth/login/email',
  LOGIN_SMS: 'auth/login/sms',
  EMAIL_SEND_CODE: 'auth/message/login/email/send-code',
  SMS_SEND_CODE: 'auth/message/login/sms/send-code',
  REFRESH_TOKEN: 'auth/refresh-token',
  LOGOUT: 'auth/logout',
  /** 管理端：查询用户活跃会话 */
  ADMIN_USER_SESSIONS: 'auth/admin/users',
} as const;

/**
 * 无需携带 Access Token 的路径后缀（与 {@link AUTH_API_PATHS} 中公开接口一致）。
 * refresh-token 仅依赖 refreshToken，不再要求携带 access token。
 */
export const AUTH_PUBLIC_API_PATH_SUFFIXES: readonly string[] = [
  AUTH_API_PATHS.LOGIN_USERNAME,
  AUTH_API_PATHS.LOGIN_EMAIL,
  AUTH_API_PATHS.LOGIN_SMS,
  AUTH_API_PATHS.EMAIL_SEND_CODE,
  AUTH_API_PATHS.SMS_SEND_CODE,
  AUTH_API_PATHS.REFRESH_TOKEN,
];
