import type { PageResponse } from '@/api/models/page';
import type { PermissionReference, RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

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
