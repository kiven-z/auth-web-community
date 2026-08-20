import { writeSessionPreferences } from './sessionPreferences';

// 未返回 readMeDay 时的兜底天数
const FALLBACK_REMEMBER_LOGIN_DAYS = 7;

/**
 * 根据登录/刷新响应写入
 * @param isRemembered 是否勾选记住登录
 * @param readMeDay 记住登录天数
 */
export function applyRememberPreferencesFromResponse(isRemembered: boolean, readMeDay?: number): void {
  const loginDay = isRemembered ? (readMeDay ?? FALLBACK_REMEMBER_LOGIN_DAYS) : 0;
  writeSessionPreferences({ isRemembered, loginDay });
}
