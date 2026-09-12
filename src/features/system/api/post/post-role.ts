import type { AssignRoleRequest, RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';

/**
 * 查询岗位已分配角色
 * @param postId 岗位主键
 * @returns 已分配角色列表
 */
export function getPostRoles(postId: string) {
  return http.get<RoleReference[], unknown>(`/system/post/${postId}/roles`);
}

/**
 * 全量覆盖岗位角色授权
 * @param postId 岗位主键
 * @param data 角色 ID 列表
 */
export function putPostRoles(postId: string, data: AssignRoleRequest) {
  return http.put<void, AssignRoleRequest>(`/system/post/${postId}/roles`, { data });
}
