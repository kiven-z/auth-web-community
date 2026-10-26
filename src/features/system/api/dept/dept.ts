import type { PageResponse, SortSpec } from '@/api/models/page';
import type { BaseResponse, BaseResponseDetail } from '@/api/models/response';
import type { ExportPreCheckResult } from '@/features/file/api/models/export-precheck';
import { http } from '@/core/http/client';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import type { AxiosRequestConfig } from 'axios';
import type { SpreadsheetImportResult } from '@/api/models/import';

export type { SpreadsheetImportResult } from '@/api/models/import';

/**
 * 部门扁平列表查询
 */
export interface SysDeptListQuery {
  /** 部门名称或编码关键词 */
  keyword?: string;
}

/**
 * 部门列表行 / 扁平 VO
 */
export interface SysDeptListVO extends BaseResponse {
  id: string;
  parentId: string;
  deptName: string;
  deptCode: string;
  orderNum: number;
  remark?: string;
}

/** 前端树节点 */
export type SysDeptTreeNode = SysDeptListVO & { children?: SysDeptTreeNode[] };

/**
 * 查询部门扁平列表
 */
export function getDeptList(params?: SysDeptListQuery) {
  return http.get<SysDeptListVO[], AxiosRequestConfig<SysDeptListQuery>>('/system/dept/list', { params });
}

/**
 * 部门表格 / 导出筛选
 */
export interface SysDeptTableFilter {
  deptName?: string;
  deptCode?: string;
}

/**
 * 表格分页查询
 */
export interface SysDeptPageQuery extends SysDeptTableFilter {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
}

/**
 * 分页查询部门（表格视图）
 */
export function getDeptPage(params: SysDeptPageQuery) {
  return http.get<PageResponse<SysDeptListVO>, AxiosRequestConfig<SysDeptPageQuery>>('/system/dept/page', {
    params,
  });
}

/**
 * 导出部门前置检查（按当前筛选估算行数与产物格式）
 * @param filter 列表筛选（不含分页）
 * @returns 前置检查结果
 */
export function preCheckDeptExport(filter: SysDeptPageQuery) {
  return http.post<ExportPreCheckResult, SysDeptPageQuery>('/system/dept/export/pre-check', {
    data: filter,
  });
}

/**
 * 异步导出部门（按当前筛选）
 * @param filter 列表筛选（不含分页）
 * @param requestId 幂等请求 ID
 * @returns 异步任务创建结果
 */
export function exportDeptExcelAsync(filter: SysDeptPageQuery, requestId: string) {
  return http.post<{ taskId: string | number }, SysDeptPageQuery>('/system/dept/export/async', {
    data: filter,
    params: { requestId },
  });
}

/** 部门新增表单 */
export interface SysDeptCreateForm {
  /** 父部门 ID；空或未选=顶级 */
  parentId?: string;
  deptName: string;
  deptCode: string;
  orderNum?: number;
  remark?: string;
}

/**
 * 新增部门
 * @param data 部门表单
 */
export function createDept(data: SysDeptCreateForm) {
  const body = {
    ...data,
    parentId: data.parentId && data.parentId.length > 0 ? data.parentId : TREE_ROOT_PARENT_ID,
  };
  return http.post<void, SysDeptCreateForm>('/system/dept', { data: body });
}

/** 部门更新表单 */
export interface SysDeptUpdateForm extends SysDeptCreateForm {
  id: string;
}

/**
 * 更新部门
 * @param data 保存表单
 */
export function updateDept(data: SysDeptUpdateForm) {
  const body = {
    ...data,
    parentId: data.parentId && data.parentId.length > 0 ? data.parentId : TREE_ROOT_PARENT_ID,
  };
  return http.put<void, SysDeptUpdateForm>('/system/dept', { data: body });
}

/**
 * 部门详情（标量 + 授权关系计数）
 */
export interface SysDeptDetail extends BaseResponseDetail {
  parentId: string;
  deptName: string;
  deptCode: string;
  orderNum: number;
  remark?: string;
  boundUserCount: number;
  boundPostCount: number;
  boundRoleCount: number;
}

/**
 * 获取部门详情
 * @param id 部门主键
 */
export function getDeptDetail(id: string) {
  return http.get<SysDeptDetail, unknown>(`/system/dept/${id}`);
}

/**
 * 删除部门
 * @param id 部门主键
 */
export function deleteDept(id: string) {
  return http.request<void>('delete', `/system/dept/${id}`);
}

/** 部门移动表单 */
export interface SysDeptMoveForm {
  id: string;
  parentId: string;
}

/**
 * 移动部门
 * @param data 部门主键与新父部门
 */
export function moveDept(data: SysDeptMoveForm) {
  return http.put<void, SysDeptMoveForm>('/system/dept/move', { data });
}

/**
 * 批量删除部门
 * @param ids 部门主键列表
 */
export async function deleteDepts(ids: string[]) {
  await Promise.all(ids.map((id) => deleteDept(id)));
}

/**
 * 导入部门 Excel
 * @param file 上传的 Excel 文件
 * @returns 导入结果
 */
export function importDeptExcel(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return http.post<SpreadsheetImportResult, FormData>('/system/dept/import', {
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 下载部门导入模板
 * @returns 模板 Blob
 */
export function downloadDeptImportTemplate() {
  return http.get<Blob, unknown>('/system/dept/import/template', { responseType: 'blob' });
}
