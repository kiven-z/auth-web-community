import type { PageResponse } from '@/api/common/page';
import type { BoundUserReference } from '@/features/system/api/models/grantTable';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 岗位授权面摘要
 */
export interface PostAuthorizationSummary {
  boundUserCount: number;
}

/**
 * 查询岗位授权面摘要
 * @param postId 岗位 ID
 * @returns 关联计数摘要
 */
export function getPostAuthorizationSummary(postId: string): Promise<PostAuthorizationSummary> {
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
export function getPostUsersPage(postId: string, params: PostUserPageQuery): Promise<PageResponse<BoundUserReference>> {
  return http.get<PageResponse<BoundUserReference>, AxiosRequestConfig<PostUserPageQuery>>(
    `/system/post/${postId}/users/page`,
    { params }
  );
}
