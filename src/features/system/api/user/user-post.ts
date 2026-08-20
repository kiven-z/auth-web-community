import type { PageResponse } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 用户岗位关联分页查询
 */
export interface UserPostPageQuery {
  postCode?: string;
  postName?: string;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 用户岗位关联分页行
 */
export interface UserPostPageRow extends BaseResponsePageRow {
  userId: string;
  postId: string;
  postCode: string;
  postName: string;
  /** 岗位本节点启用状态 */
  postStatus: boolean;
  /** 岗位计算有效 */
  postEffective: boolean;
  isPrimary: boolean;
  remark?: string | null;
}

/**
 * 分页查询用户岗位关联
 * @param userId 用户 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserPostPage(userId: string, params: UserPostPageQuery): Promise<PageResponse<UserPostPageRow>> {
  return http.get<PageResponse<UserPostPageRow>, AxiosRequestConfig<UserPostPageQuery>>(
    `/system/user-post/${userId}/page`,
    { params }
  );
}

/**
 * 用户岗位关联新增表单
 */
export interface UserPostAssignForm {
  postId?: string;
  isPrimary: boolean;
  remark?: string | null;
}

/**
 * 新增用户岗位关联
 * @param userId 用户 ID
 * @param form 关联表单
 */
export function createUserPost(userId: string, form: UserPostAssignForm): Promise<void> {
  return http.post<void, UserPostAssignForm>(`/system/user-post/${userId}`, { data: form });
}

/**
 * 用户岗位关联更新表单
 */
export interface UserPostRelationUpdateForm {
  isPrimary: boolean;
  remark?: string | null;
}

/**
 * 更新用户岗位关联
 * @param userId 用户 ID
 * @param id 关联主键
 * @param form 更新表单
 */
export function updateUserPost(userId: string, id: string, form: UserPostRelationUpdateForm): Promise<void> {
  return http.put<void, UserPostRelationUpdateForm>(`/system/user-post/${userId}/${id}`, { data: form });
}

/**
 * 批量删除用户岗位关联
 * @param userId 用户 ID
 * @param ids 关联主键列表
 */
export function batchDeleteUserPosts(userId: string, ids: string[]): Promise<void> {
  return http.request<void>('delete', `/system/user-post/${userId}`, { data: ids });
}

/**
 * 清空用户全部岗位关联
 * @param userId 用户 ID
 */
export function clearUserPosts(userId: string): Promise<void> {
  return http.request<void>('delete', `/system/user-post/${userId}/all`);
}
