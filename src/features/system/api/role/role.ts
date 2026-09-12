import type { AxiosRequestConfig } from 'axios';

import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponse, BaseResponsePageRow } from '@/api/common/response';
import type { IdsEnableStatusRequest } from '@/api/common/request';
import { http } from '@/core/http/client';
import type { SpreadsheetImportResult } from '@/api/common/import';

export type { SpreadsheetImportResult } from '@/api/common/import';

/**
 * 角色分页查询参数
 */
export interface SysRolePageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  roleCode?: string;
  roleName?: string;
  status?: boolean;
}

/**
 * 分页行
 */
export interface SysRolePageRow extends BaseResponsePageRow {
  roleCode: string;
  roleName: string;
  status: boolean;
  orderNum: number;
  remark?: string;
}

/**
 * 分页查询角色列表
 * @param params 角色分页查询参数
 * @returns 角色分页行
 */
export function getRolePage(params: SysRolePageQuery) {
  return http.get<PageResponse<SysRolePageRow>, AxiosRequestConfig<SysRolePageQuery>>('/system/role/page', {
    params,
  });
}

/**
 * 角色详情（标量 + 授权关系计数）
 */
export interface SysRoleDetail extends BaseResponse {
  roleCode: string;
  roleName: string;
  status: boolean;
  orderNum: number;
  remark?: string;
  permissionCount: number;
  menuCount: number;
}

/**
 * 获取角色详情
 * @param id 角色主键
 * @returns 角色详情
 */
export function getRoleDetail(id: string) {
  return http.get<SysRoleDetail, unknown>(`/system/role/${id}`);
}

/**
 * 角色新增表单
 */
export interface SysRoleCreateForm {
  roleCode: string;
  roleName: string;
  status: boolean;
  orderNum?: number;
  remark?: string;
}

/**
 * 新增角色
 * @param data 角色新增表单
 */
export function createRole(data: SysRoleCreateForm) {
  return http.post<void, SysRoleCreateForm>('/system/role', { data });
}

/**
 * 角色更新表单
 */
export interface SysRoleUpdateForm {
  id: string;
  roleCode: string;
  roleName: string;
  status: boolean;
  orderNum?: number;
  remark?: string;
}

/**
 * 更新角色
 * @param data 角色更新表单
 */
export function updateRole(data: SysRoleUpdateForm) {
  return http.put<void, SysRoleUpdateForm>('/system/role', { data });
}

/**
 * 删除角色（物理删除）
 * @param id 角色主键
 */
export function deleteRole(id: string) {
  return http.request<void>('delete', `/system/role/${id}`);
}

/**
 * 批量启停角色
 */
export function batchUpdateRoleStatus(data: IdsEnableStatusRequest) {
  return http.request('put', '/system/role/status', { data });
}

/**
 * 导入角色 Excel（multipart/form-data）
 * @param file 上传的 Excel 文件
 * @returns 导入结果
 */
export function importRoleExcel(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return http.post<SpreadsheetImportResult, FormData>('/system/role/import', {
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 下载角色导入模板
 * @returns 模板 Blob
 */
export function downloadRoleImportTemplate() {
  return http.get<Blob, unknown>('/system/role/import/template', { responseType: 'blob' });
}
