import type { PageResponse } from '@/api/common/page';
import type { PermissionReference } from '@/features/system/api/models/grantTable';
import type { RoleBoundMenuItem } from '@/features/system/api/models/role';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 角色已绑定权限分页查询
 */
export interface RolePermissionPageQuery {
  permissionCode?: string;
  permissionName?: string;
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询角色已绑定权限
 * @param roleId 角色 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getRolePermissionsPage(
  roleId: string,
  params: RolePermissionPageQuery
): Promise<PageResponse<PermissionReference>> {
  return http.get<PageResponse<PermissionReference>, AxiosRequestConfig<RolePermissionPageQuery>>(
    `/system/role/${roleId}/permissions/page`,
    { params }
  );
}

/**
 * 角色已绑定菜单分页查询
 */
export interface RoleMenuPageQuery {
  title?: string;
  name?: string;
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询角色已绑定菜单
 * @param roleId 角色 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getRoleMenusPage(roleId: string, params: RoleMenuPageQuery): Promise<PageResponse<RoleBoundMenuItem>> {
  return http.get<PageResponse<RoleBoundMenuItem>, AxiosRequestConfig<RoleMenuPageQuery>>(
    `/system/role/${roleId}/menus/page`,
    { params }
  );
}

/**
 * 角色授权面摘要（关系计数）
 */
export interface RoleAuthorizationSummary {
  permissionCount: number;
  menuCount: number;
}

/**
 * 查询角色授权面摘要
 * @param roleId 角色 ID
 * @returns 关系计数摘要
 */
export function getRoleAuthorizationSummary(roleId: string): Promise<RoleAuthorizationSummary> {
  return http.get<RoleAuthorizationSummary, AxiosRequestConfig>(`/system/role/${roleId}/authorization-summary`);
}
