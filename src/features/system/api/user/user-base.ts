import type { AxiosRequestConfig } from 'axios';

import type { BaseResponse } from '@/api/common/response';
import { http } from '@/core/http/client';

/**
 * 用户详情
 */
export interface SysUserDetail extends BaseResponse {
  username: string;
  nickname?: string | null;
  email?: string | null;
  phone?: string | null;
  employeeNo?: string | null;
  avatar?: string | null;
  status: number;
  primaryDeptId?: string | null;
  primaryDeptName?: string | null;
  gender?: number | null;
  birthday?: string | null;
  introduction?: string | null;
  remark?: string | null;
  deptCount: number;
  postCount: number;
  directRoleCount: number;
  effectiveRoleCount: number;
  effectivePermissionCount: number;
}

/**
 * 查询用户详情
 * @param userId 用户 ID（字符串化 Long）
 * @returns 用户详情
 */
export function getUserDetail(userId: string) {
  return http.get<SysUserDetail, AxiosRequestConfig>(`/system/user/${userId}/detail`);
}

/**
 * 用户远程搜索选项
 */
export interface UserSearchOption {
  id: string;
  username: string;
  nickname?: string | null;
}

/**
 * 远程搜索用户
 * @param keyword 搜索关键字
 * @param limit 返回条数上限
 * @returns 用户远程搜索选项
 */
export function searchUserByKeyword(keyword: string, limit?: number) {
  return http.get<UserSearchOption[], AxiosRequestConfig>('/system/user/search', {
    params: { keyword, limit },
  });
}
