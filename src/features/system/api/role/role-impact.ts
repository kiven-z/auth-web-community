import type { PageResponse } from '@/api/models/page';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';
import type { UserReference } from '@/features/system/api/models/grant-table';

/**
 * 角色影响用户分页查询
 */
export interface RoleImpactUserPageQuery {
  keyword?: string;
  /** 用户状态：0=禁用，1=正常，2=锁定 */
  status?: number;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询角色影响用户
 * @param roleId 角色 ID
 * @param params 关键词 / 状态 / 分页
 * @returns 影响用户分页
 */
export function getRoleImpactUsersPage(roleId: string, params: RoleImpactUserPageQuery) {
  return http.get<PageResponse<UserReference>, AxiosRequestConfig<RoleImpactUserPageQuery>>(
    `/system/role/${roleId}/impact/users/page`,
    { params }
  );
}

/**
 * 角色影响面刷新结果
 */
export interface RoleImpactRefreshResult {
  refreshedUserCount: number;
}

/**
 * 刷新角色受影响用户授权画像
 * @param roleId 角色 ID
 * @param userIds 指定用户；省略则刷新全部影响用户
 * @returns 已提交刷新的用户数
 */
export function refreshRoleImpactedProfiles(roleId: string, userIds?: string[]) {
  return http.post<RoleImpactRefreshResult, string[] | null>(`/system/role/${roleId}/impact/refresh`, {
    data: userIds ?? null,
  });
}
