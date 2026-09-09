import type { PageResponse } from '@/api/common/page';
import type { BoundUserReference, PostReference, RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 部门授权面摘要
 */
export interface DeptAuthorizationSummary {
  boundUserCount: number;
  boundPostCount: number;
  boundRoleCount: number;
}

/**
 * 查询部门授权面摘要
 * @param deptId 部门 ID
 * @returns 关联计数摘要
 */
export function getDeptAuthorizationSummary(deptId: string): Promise<DeptAuthorizationSummary> {
  return http.get<DeptAuthorizationSummary, unknown>(`/system/dept/${deptId}/authorization-summary`);
}

/**
 * 部门关联用户分页查询
 */
export interface DeptUserPageQuery {
  keyword?: string;
  status?: number;
  isPrimary?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询部门关联用户
 * @param deptId 部门 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getDeptUsersPage(deptId: string, params: DeptUserPageQuery): Promise<PageResponse<BoundUserReference>> {
  return http.get<PageResponse<BoundUserReference>, AxiosRequestConfig<DeptUserPageQuery>>(
    `/system/dept/${deptId}/users/page`,
    { params }
  );
}

/**
 * 部门下属岗位分页查询
 */
export interface DeptPostPageQuery {
  postCode?: string;
  postName?: string;
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询部门下属岗位
 * @param deptId 部门 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getDeptPostsPage(deptId: string, params: DeptPostPageQuery): Promise<PageResponse<PostReference>> {
  return http.get<PageResponse<PostReference>, AxiosRequestConfig<DeptPostPageQuery>>(
    `/system/dept/${deptId}/posts/page`,
    { params }
  );
}

/**
 * 部门已授角色分页查询
 */
export interface DeptRolePageQuery {
  roleCode?: string;
  roleName?: string;
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询部门已授角色
 * @param deptId 部门 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getDeptRolesPage(deptId: string, params: DeptRolePageQuery): Promise<PageResponse<RoleReference>> {
  return http.get<PageResponse<RoleReference>, AxiosRequestConfig<DeptRolePageQuery>>(
    `/system/dept/${deptId}/roles/page`,
    { params }
  );
}
