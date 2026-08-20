import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponse, BaseResponseDetail } from '@/api/common/response';
import type { IdsEnableStatusRequest } from '@/api/common/request';
import { http } from '@/core/http/client';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import type { AxiosRequestConfig } from 'axios';
import type { SpreadsheetImportResult } from '@/api/common/import';

export type { SpreadsheetImportResult } from '@/api/common/import';

/**
 * 部门扁平列表查询
 */
export interface SysDeptListQuery {
  /** 部门名称或编码关键词 */
  keyword?: string;
  status?: boolean;
}

/**
 * 部门列表行 / 扁平 VO
 */
export interface SysDeptListVO extends BaseResponse {
  id: string;
  parentId: string;
  deptName: string;
  deptCode: string;
  status: boolean;
  /** 计算有效：本节点及全部祖先均启用（后端投影） */
  effective: boolean;
  orderNum: number;
  remark?: string;
}

/** 前端树节点 */
export type SysDeptTreeNode = SysDeptListVO & { children?: SysDeptTreeNode[] };

/**
 * 查询部门扁平列表
 */
export function getDeptList(params?: SysDeptListQuery): Promise<SysDeptListVO[]> {
  return http.get<SysDeptListVO[], AxiosRequestConfig<SysDeptListQuery>>('/system/dept/list', { params });
}

/**
 * 部门表格筛选
 */
export interface SysDeptTableFilter {
  deptName?: string;
  deptCode?: string;
  status?: boolean;
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
export function getDeptPage(params: SysDeptPageQuery): Promise<PageResponse<SysDeptListVO>> {
  return http.get<PageResponse<SysDeptListVO>, AxiosRequestConfig<SysDeptPageQuery>>('/system/dept/page', {
    params,
  });
}

/** 部门新增表单 */
export interface SysDeptCreateForm {
  /** 父部门 ID；空或未选=顶级 */
  parentId?: string;
  deptName: string;
  deptCode: string;
  status: boolean;
  orderNum?: number;
  remark?: string;
}

/**
 * 新增部门
 * @param data 部门表单
 */
export function createDept(data: SysDeptCreateForm): Promise<void> {
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
export function updateDept(data: SysDeptUpdateForm): Promise<void> {
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
  status: boolean;
  /** 计算有效：本节点及全部祖先均启用（后端投影） */
  effective: boolean;
  orderNum: number;
  remark?: string;
  boundUserCount: number;
  boundPostCount: number;
}

/**
 * 获取部门详情
 * @param id 部门主键
 */
export function getDeptDetail(id: string): Promise<SysDeptDetail> {
  return http.get<SysDeptDetail, unknown>(`/system/dept/${id}`);
}

/**
 * 删除部门
 * @param id 部门主键
 */
export function deleteDept(id: string): Promise<void> {
  return http.request<void>('delete', `/system/dept/${id}`);
}

/**
 * 批量启停部门（不级联）
 */
export function batchUpdateDeptStatus(data: IdsEnableStatusRequest): Promise<void> {
  return http.request('put', '/system/dept/status', { data });
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
export function moveDept(data: SysDeptMoveForm): Promise<void> {
  return http.put<void, SysDeptMoveForm>('/system/dept/move', { data });
}

/**
 * 批量删除部门
 * @param ids 部门主键列表
 */
export async function deleteDepts(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteDept(id)));
}

/**
 * 导入部门 Excel
 * @param file 上传的 Excel 文件
 * @returns 导入结果
 */
export function importDeptExcel(file: File): Promise<SpreadsheetImportResult> {
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
export function downloadDeptImportTemplate(): Promise<Blob> {
  return http.get<Blob, unknown>('/system/dept/import/template', { responseType: 'blob' });
}
