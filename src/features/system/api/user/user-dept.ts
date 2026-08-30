import type { PageResponse } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 用户部门关联分页查询
 */
export interface UserDeptPageQuery {
  deptName?: string;
  deptCode?: string;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 用户部门关联分页行
 */
export interface UserDeptPageRow extends BaseResponsePageRow {
  userId: string;
  deptId: string;
  deptName: string;
  deptCode: string;
  /** 部门本节点启用状态 */
  deptStatus: boolean;
  /** 部门计算有效 */
  deptEffective: boolean;
  isPrimary: boolean;
  remark?: string | null;
}

/**
 * 分页查询用户部门关联
 * @param userId 用户 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserDeptPage(userId: string, params: UserDeptPageQuery): Promise<PageResponse<UserDeptPageRow>> {
  return http.get<PageResponse<UserDeptPageRow>, AxiosRequestConfig<UserDeptPageQuery>>(
    `/system/user-dept/${userId}/page`,
    { params }
  );
}

/**
 * 用户部门关联表单
 */
export interface UserDeptAssignForm {
  deptId?: string;
  isPrimary: boolean;
  remark?: string | null;
}

/**
 * 新增用户部门关联
 * @param userId 用户 ID
 * @param form 关联表单
 */
export function createUserDept(userId: string, form: UserDeptAssignForm): Promise<void> {
  return http.post<void, UserDeptAssignForm>(`/system/user-dept/${userId}`, { data: form });
}

/**
 * 更新用户部门关联
 * @param userId 用户 ID
 * @param id 关联主键
 * @param form 关联表单
 */
export function updateUserDept(userId: string, id: string, form: UserDeptAssignForm): Promise<void> {
  return http.put<void, UserDeptAssignForm>(`/system/user-dept/${userId}/${id}`, { data: form });
}

/**
 * 批量删除用户部门关联
 * @param userId 用户 ID
 * @param ids 关联主键列表
 */
export function batchDeleteUserDepts(userId: string, ids: string[]): Promise<void> {
  return http.request<void>('delete', `/system/user-dept/${userId}`, { data: ids });
}

/**
 * 清空用户全部部门关联
 * @param userId 用户 ID
 */
export function clearUserDepts(userId: string): Promise<void> {
  return http.request<void>('delete', `/system/user-dept/${userId}/all`);
}
