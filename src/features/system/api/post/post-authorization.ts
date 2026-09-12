import type { PageResponse } from '@/api/common/page';
import type { BoundUserReference, RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 岗位授权面摘要
 */
export interface PostAuthorizationSummary {
  boundUserCount: number;
  boundRoleCount: number;
}

/**
 * 查询岗位授权面摘要
 * @param postId 岗位 ID
 * @returns 关联计数摘要
 */
export function getPostAuthorizationSummary(postId: string) {
  return http.get<PostAuthorizationSummary, unknown>(`/system/post/${postId}/authorization-summary`);
}

/**
 * 岗位关联用户分页查询
 */
export interface PostUserPageQuery {
  keyword?: string;
  status?: number;
  isPrimary?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询岗位关联用户
 * @param postId 岗位 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getPostUsersPage(postId: string, params: PostUserPageQuery) {
  return http.get<PageResponse<BoundUserReference>, AxiosRequestConfig<PostUserPageQuery>>(
    `/system/post/${postId}/users/page`,
    { params }
  );
}

/**
 * 岗位已授角色分页查询
 */
export interface PostRolePageQuery {
  roleCode?: string;
  roleName?: string;
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询岗位已授角色
 * @param postId 岗位 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getPostRolesPage(postId: string, params: PostRolePageQuery) {
  return http.get<PageResponse<RoleReference>, AxiosRequestConfig<PostRolePageQuery>>(
    `/system/post/${postId}/roles/page`,
    { params }
  );
}
