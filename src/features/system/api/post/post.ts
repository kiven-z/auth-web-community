import type { AxiosRequestConfig } from 'axios';

import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';
import type { IdsEnableStatusRequest } from '@/api/common/request';
import type { DeptReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { SpreadsheetImportResult } from '@/api/common/import';

export type { SpreadsheetImportResult } from '@/api/common/import';

/**
 * 岗位关键词搜索参数
 */
export interface SysPostSearchQuery {
  keyword?: string;
  status?: boolean;
  limit?: number;
}

/**
 * 岗位远程搜索项
 */
export interface SysPostSearchOption {
  id: string;
  deptId: string;
  deptName: string;
  postCode: string;
  postName: string;
  status: boolean;
}

/**
 * 岗位关键词搜索
 * @param params 搜索条件
 * @returns 岗位搜索项列表
 */
export function searchPostByKeyword(params: SysPostSearchQuery): Promise<SysPostSearchOption[]> {
  return http.get<SysPostSearchOption[], AxiosRequestConfig<SysPostSearchQuery>>('/system/post/search', {
    params,
  });
}

/**
 * 岗位分页查询参数
 */
export interface SysPostPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  postCode?: string;
  postName?: string;
  deptName?: string;
  status?: boolean;
}

/**
 * 分页行
 */
export interface SysPostPageRow extends BaseResponsePageRow {
  deptId: string;
  deptName: string;
  postCode: string;
  postName: string;
  status: boolean;
  /** 计算有效（本节点启用且所属部门有效） */
  effective: boolean;
  orderNum: number;
}

/**
 * 分页查询岗位列表
 * @param params 岗位分页查询参数
 * @returns 岗位分页行
 */
export function getPostPage(params: SysPostPageQuery): Promise<PageResponse<SysPostPageRow>> {
  return http.get<PageResponse<SysPostPageRow>, AxiosRequestConfig<SysPostPageQuery>>('/system/post/page', {
    params,
  });
}

/**
 * 岗位详情
 */
export interface SysPostDetail extends BaseResponseDetail {
  deptId: string;
  postCode: string;
  postName: string;
  status: boolean;
  /** 计算有效（本节点启用且所属部门有效） */
  effective: boolean;
  orderNum: number;
  remark?: string;
  boundDept?: DeptReference | null;
  boundUserCount: number;
}

/**
 * 获取岗位详情
 * @param id 岗位主键
 * @returns 岗位详情
 */
export function getPostDetail(id: string): Promise<SysPostDetail> {
  return http.get<SysPostDetail, unknown>(`/system/post/${id}`);
}

/**
 * 岗位保存表单
 */
export interface SysPostCreateForm {
  deptId: string;
  postCode: string;
  postName: string;
  status: boolean;
  orderNum?: number;
  remark?: string;
}

/**
 * 新增岗位
 * @param data 岗位新增表单
 */
export function createPost(data: SysPostCreateForm): Promise<void> {
  return http.post<void, SysPostCreateForm>('/system/post', { data });
}

/**
 * 岗位更新表单（与新增字段一致，编辑弹层内部带 id）
 */
export interface SysPostUpdateForm extends SysPostCreateForm {
  id: string;
}

/** 岗位新增/编辑弹层共用表单模型 */
export type SysPostFormModel = SysPostCreateForm | SysPostUpdateForm;

/**
 * 更新岗位
 * @param data 岗位更新表单
 */
export function updatePost(data: SysPostUpdateForm): Promise<void> {
  return http.put<void, SysPostUpdateForm>('/system/post', { data });
}

/**
 * 删除岗位
 * @param id 岗位主键
 */
export function deletePost(id: string): Promise<void> {
  return http.request('delete', `/system/post/${id}`);
}

/**
 * 批量启停岗位
 */
export function batchUpdatePostStatus(data: IdsEnableStatusRequest): Promise<void> {
  return http.request('put', '/system/post/status', { data });
}

/**
 * 导入岗位 Excel（multipart/form-data）
 * @param file 上传的 Excel 文件
 * @returns 导入结果
 */
export function importPostExcel(file: File): Promise<SpreadsheetImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  return http.post<SpreadsheetImportResult, FormData>('/system/post/import', {
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 下载岗位导入模板
 * @returns 模板 Blob
 */
export function downloadPostImportTemplate(): Promise<Blob> {
  return http.get<Blob, unknown>('/system/post/import/template', { responseType: 'blob' });
}
