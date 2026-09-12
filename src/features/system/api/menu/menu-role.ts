import type { AssignRoleRequest, MenuAssignedRoleRow } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 查询菜单已分配角色
 * @param id 菜单主键
 * @returns 已分配角色回显行
 */
export function getMenuRoles(id: string) {
  return http.get<MenuAssignedRoleRow[], AxiosRequestConfig>(`/system/menu/${id}/roles`);
}

/**
 * 全量覆盖菜单角色授权
 * @param id 菜单主键
 * @param data 角色 ID 列表
 * @returns 操作结果文案
 */
export function putMenuRoles(id: string, data: AssignRoleRequest) {
  return http.request<string>('put', `/system/menu/${id}/roles`, { data });
}
