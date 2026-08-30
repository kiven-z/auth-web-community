import type { AxiosRequestConfig } from 'axios';

import type { PageResponse } from '@/api/common/page';
import { http } from '@/core/http/client';
import type { DeptReference, PostReference } from '@/features/system/api/models/grant-table';

/**
 * 当前用户展示资料（顶栏 / 会话校准）
 */
export interface MeProfileResponse {
  username: string;
  nickname?: string | null;
  avatar?: string | null;
  /** 主部门 ID（Long 字符串化） */
  primaryDeptId?: string | null;
  /** 主部门名称 */
  primaryDeptName?: string | null;
}

/**
 * 查询当前用户展示资料
 */
export function getMyProfile(): Promise<MeProfileResponse> {
  return http.get<MeProfileResponse, AxiosRequestConfig>('/system/me/profile');
}

/**
 * 当前用户有效任职部门
 */
export type MeOrgDeptBinding = DeptReference & {
  isPrimary: boolean;
};

/**
 * 当前用户有效任职岗位
 */
export type MeOrgPostBinding = PostReference & {
  isPrimary: boolean;
};

/**
 * 当前用户组织任职（有效部门与岗位）
 */
export interface MeOrgBindingsResponse {
  depts: MeOrgDeptBinding[];
  posts: MeOrgPostBinding[];
}

/**
 * 查询当前用户组织任职
 */
export function getMyOrgBindings(): Promise<MeOrgBindingsResponse> {
  return http.get<MeOrgBindingsResponse, AxiosRequestConfig>('/system/me/org-bindings');
}

/**
 * 当前用户资料更新请求
 */
export interface MeProfileUpdateRequest {
  nickname: string;
  email: string;
  phone: string;
  gender?: number | null;
  birthday?: string | null;
  introduction?: string | null;
}

/**
 * 更新当前用户个人资料
 * @param data 资料更新表单
 */
export function updateMyProfile(data: MeProfileUpdateRequest): Promise<string> {
  return http.request<string>('put', '/system/me/profile', { data });
}

/**
 * 当前用户头像更新请求
 */
export interface MeAvatarUpdateRequest {
  avatar: string;
}

/**
 * 更新当前用户头像
 * @param data 头像更新表单
 */
export function updateMyAvatar(data: MeAvatarUpdateRequest): Promise<string> {
  return http.request<string>('put', '/system/me/avatar', { data });
}

/**
 * 个人中心活跃会话
 */
export interface MeUserSession {
  sessionId: string;
  ipAddress?: string | null;
  ipRegion?: string | null;
  deviceType?: string | null;
  browserType?: string | null;
  osType?: string | null;
  rememberMe?: boolean | null;
  refreshTokenExpiresAt?: number | null;
  /** 登录时间戳（毫秒） */
  loginAt?: number | null;
  /** 是否为当前请求所在会话 */
  current?: boolean | null;
}

/**
 * 查询当前用户活跃会话列表
 */
export function listMySessions(): Promise<MeUserSession[]> {
  return http.get<MeUserSession[], AxiosRequestConfig>('/system/me/sessions');
}

/**
 * 踢出当前用户指定会话
 * @param sessionId 会话 ID（jti）
 */
export function kickMySession(sessionId: string): Promise<void> {
  return http.post<void, unknown>(`/system/me/sessions/${sessionId}/kick`);
}

/**
 * 个人中心登录日志分页查询参数
 */
export interface MeLoginLogPageQuery {
  pageIndex?: number;
  pageSize?: number;
  loginResult?: number;
  loginType?: string;
}

/**
 * 个人中心登录日志分页行
 */
export interface MeLoginLogPageRow {
  loginTime: string;
  loginRegion?: string | null;
  loginResult: number;
  loginType?: string | null;
}

/**
 * 分页查询当前用户登录日志（最近 180 天）
 * @param params 查询参数
 */
export function getMyLoginLogPage(params: MeLoginLogPageQuery): Promise<PageResponse<MeLoginLogPageRow>> {
  return http.get<PageResponse<MeLoginLogPageRow>, AxiosRequestConfig<MeLoginLogPageQuery>>(
    '/system/me/login-logs/page',
    { params }
  );
}

/**
 * 当前用户修改密码
 */
export interface SysUserChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 当前用户修改自己的密码
 * @param data 密码表单
 */
export function changeOwnPassword(data: SysUserChangePasswordRequest): Promise<string> {
  return http.request<string>('put', '/system/me/password', { data });
}
