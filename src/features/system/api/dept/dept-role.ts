import type { AssignRoleRequest, RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';

/**
 * 查询部门已分配角色
 * @param deptId 部门主键
 * @returns 已分配角色列表
 */
export function getDeptRoles(deptId: string): Promise<RoleReference[]> {
  return http.get<RoleReference[], unknown>(`/system/dept/${deptId}/roles`);
}

/**
 * 全量覆盖部门角色授权
 * @param deptId 部门主键
 * @param data 角色 ID 列表
 */
export function putDeptRoles(deptId: string, data: AssignRoleRequest): Promise<void> {
  return http.put<void, AssignRoleRequest>(`/system/dept/${deptId}/roles`, { data });
}
