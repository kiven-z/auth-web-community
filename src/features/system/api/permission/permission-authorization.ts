import type { PageResponse } from '@/api/common/page';
import type { RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 权限已绑定角色分页查询
 */
export interface PermissionRolePageQuery {
  roleCode?: string;
  roleName?: string;
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询权限已绑定角色
 * @param permissionId 权限 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getPermissionRolesPage(
  permissionId: string,
  params: PermissionRolePageQuery
): Promise<PageResponse<RoleReference>> {
  return http.get<PageResponse<RoleReference>, AxiosRequestConfig<PermissionRolePageQuery>>(
    `/system/permission/${permissionId}/roles/page`,
    { params }
  );
}
