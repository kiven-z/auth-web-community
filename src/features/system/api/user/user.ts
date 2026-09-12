import type { PageResponse } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import type { SpreadsheetImportResult } from '@/api/common/import';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 用户分页查询条件
 */
export interface SysUserPageQuery {
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  employeeNo?: string;
  status?: number;
  deptId?: string;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 用户分页行
 */
export interface SysUserPageRow extends BaseResponsePageRow {
  username: string;
  nickname?: string | null;
  avatar?: string | null;
  phone?: string | null;
  email?: string | null;
  employeeNo?: string | null;
  status: number;
}

/**
 * 用户分页查询
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserPage(params: SysUserPageQuery) {
  return http.get<PageResponse<SysUserPageRow>, AxiosRequestConfig<SysUserPageQuery>>('/system/user/page', {
    params,
  });
}

/**
 * 上传用户 Excel 批量导入
 * @param file Excel 文件
 * @returns 导入结果
 */
export function importUserExcel(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return http.post<SpreadsheetImportResult, FormData>('/system/user/import', {
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 下载用户导入模板
 * @returns 模板 Blob
 */
export function downloadUserImportTemplate() {
  return http.get<Blob, unknown>('/system/user/import/template', { responseType: 'blob' });
}

/**
 * 用户新增表单
 */
export interface SysUserCreateForm {
  username: string;
  initialPassword?: string;
  nickname: string;
  email: string;
  phone: string;
  employeeNo?: string;
  status: number;
  gender?: number;
  birthday?: string;
  introduction?: string;
  remark?: string;
}

/**
 * 新增用户
 * @param data 用户表单
 */
export function createUser(data: SysUserCreateForm) {
  return http.post<void, SysUserCreateForm>('/system/user', { data });
}

/**
 * 用户更新表单（与新增字段一致，编辑弹层内部带 id）
 */
export interface SysUserUpdateForm extends SysUserCreateForm {
  id: string;
}

/**
 * 更新用户基础资料
 * @param data 用户更新表单
 */
export function updateUser(data: SysUserUpdateForm) {
  return http.request<void>('put', '/system/user', { data });
}

/**
 * 批量删除用户
 * @param ids 用户主键列表
 */
export function deleteUsers(ids: string[]) {
  return http.request<string>('delete', '/system/user', { data: ids });
}

/**
 * 批量更新用户状态（0=禁用，1=正常，2=锁定）
 */
export interface SysUserBatchStatusRequest {
  ids: string[];
  status: number;
}

/**
 * 批量更新用户状态
 * @param data 用户主键与目标状态
 */
export function batchUpdateUserStatus(data: SysUserBatchStatusRequest) {
  return http.request<string>('put', '/system/user/status', { data });
}

/**
 * 刷新用户授权画像缓存（重建 Redis AuthProfile）
 * @param ids 用户主键列表
 */
export function refreshUserAuthorization(ids: string[]) {
  return http.post<void, string[]>('auth/admin/users/authorization/refresh', { data: ids });
}

/**
 * 管理员更新用户头像
 */
export interface SysUserAvatarUpdateRequest {
  userId: string;
  avatar: string;
}

/**
 * 管理员更新用户头像
 * @param data 头像更新表单
 */
export function updateUserAvatar(data: SysUserAvatarUpdateRequest) {
  return http.request<string>('put', '/system/user/avatar', { data });
}

/**
 * 管理员重置用户密码
 */
export interface SysUserAdminResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

/**
 * 管理员重置用户密码
 * @param id 用户主键
 * @param data 新密码表单
 */
export function resetUserPassword(id: string, data: SysUserAdminResetPasswordRequest) {
  return http.request<string>('put', `/system/user/${id}/password`, { data });
}
