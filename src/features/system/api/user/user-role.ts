import type { AssignRoleRequest, RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';
import type { PageResponse } from '@/api/common/page';

/**
 * 用户直连角色分页查询
 */
export interface UserRolePageQuery {
  roleCode?: string;
  roleName?: string;
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询用户直连角色
 * @param userId 用户 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserRolePage(userId: string, params: UserRolePageQuery): Promise<PageResponse<RoleReference>> {
  return http.get<PageResponse<RoleReference>, AxiosRequestConfig<UserRolePageQuery>>(
    `/system/user-role/${userId}/page`,
    { params }
  );
}

/**
 * 查询用户已分配角色（Assign 灌种：全量 id + 名称）
 * @param userId 用户 ID
 * @returns 已分配角色列表；无授权时为空数组
 */
export function getUserRoles(userId: string): Promise<RoleReference[]> {
  return http.get<RoleReference[], unknown>(`/system/user-role/${userId}/roles`);
}

/**
 * 全量覆盖用户角色授权
 * @param userId 用户 ID
 * @param data 角色 ID 列表
 */
export function putUserRoles(userId: string, data: AssignRoleRequest): Promise<void> {
  return http.put<void, AssignRoleRequest>(`/system/user-role/${userId}`, { data });
}
