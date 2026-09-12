import type { PermissionReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';

/**
 * 查询角色已分配权限
 * @param roleId 角色 ID
 * @returns 已分配权限列表
 */
export function getRolePermissions(roleId: string) {
  return http.get<PermissionReference[], unknown>(`/system/role/${roleId}/permissions`);
}

/**
 * 角色权限全量分配请求
 */
export interface SysRolePermissionAssignRequest {
  permissionIds: string[];
}

/**
 * 全量分配角色权限
 * @param roleId 角色 ID
 * @param data 权限 ID 列表
 */
export function assignRolePermissions(roleId: string, data: SysRolePermissionAssignRequest) {
  return http.post<void, SysRolePermissionAssignRequest>(`/system/role/${roleId}/permissions`, {
    data,
  });
}
