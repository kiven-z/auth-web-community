import { http } from '@/core/http/client';

/** 个人中心 UI 偏好列表项 */
export interface MeUserPreferenceItem {
  /** 配置键 */
  configKey: string;
  /** 配置值 JSON 对象 */
  configValue: Record<string, unknown>;
}

/** 个人中心 UI 偏好列表 */
export interface MeUserPreferenceListVO {
  /** 偏好项列表 */
  items: MeUserPreferenceItem[];
}

/**
 * 查询当前用户 UI 偏好配置
 * @returns 偏好列表
 */
export function listMyPreferences() {
  return http.request<MeUserPreferenceListVO>('get', '/system/me/preferences');
}

/** 个人中心 UI 偏好 upsert 请求体 */
export interface MeUserPreferenceUpsertRequest {
  /** 配置键 */
  configKey: string;
  /** 非空 JSON 对象 */
  configValue: Record<string, unknown>;
}

/**
 * 新增或更新当前用户单条 UI 偏好
 * @param data upsert 请求体
 */
export function upsertMyPreference(data: MeUserPreferenceUpsertRequest) {
  return http.request<void>('put', '/system/me/preferences', { data });
}

/**
 * 清空当前用户 UI 偏好配置（不影响登录记住等会话偏好）
 */
export function clearMyPreferences() {
  return http.request<void>('delete', '/system/me/preferences');
}
