import type { PageResponse } from '@/api/common/page';
import type { PermissionReference, RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 用户授权面摘要（关系计数）
 */
export interface UserAuthorizationSummary {
  deptCount: number;
  postCount: number;
  directRoleCount: number;
  effectiveRoleCount: number;
  effectivePermissionCount: number;
}

/**
 * 查询用户授权面摘要
 * @param userId 用户 ID
 * @returns 关系计数摘要
 */
export function getUserAuthorizationSummary(userId: string) {
  return http.get<UserAuthorizationSummary, AxiosRequestConfig>(`/system/user/${userId}/authorization-summary`);
}

/**
 * 用户生效角色分页查询
 */
export interface UserEffectiveRolePageQuery {
  roleCode?: string;
  roleName?: string;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询用户生效角色
 * @param userId 用户 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserEffectiveRolesPage(userId: string, params: UserEffectiveRolePageQuery) {
  return http.get<PageResponse<RoleReference>, AxiosRequestConfig<UserEffectiveRolePageQuery>>(
    `/system/user/${userId}/effective-roles/page`,
    { params }
  );
}

/**
 * 用户生效权限分页查询
 */
export interface UserEffectivePermissionPageQuery {
  permissionCode?: string;
  permissionName?: string;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询用户生效权限
 * @param userId 用户 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserEffectivePermissionsPage(userId: string, params: UserEffectivePermissionPageQuery) {
  return http.get<PageResponse<PermissionReference>, AxiosRequestConfig<UserEffectivePermissionPageQuery>>(
    `/system/user/${userId}/effective-permissions/page`,
    { params }
  );
}
