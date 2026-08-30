import type { SortSpec } from '@/api/common/page';
import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';
import type { IdsEnableStatusRequest } from '@/api/common/request';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 站内信业务分类查询参数
 */
export interface InAppMessageCategoryQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 分类码 */
  code?: string;
  /** 展示名 */
  name?: string;
  /** 父分类 ID */
  parentId?: string;
  /** true=仅大类；false=仅小类 */
  rootOnly?: boolean;
  /** 启用状态 */
  status?: boolean;
}

/**
 * 站内信业务分类行
 */
export interface InAppMessageCategoryPageRow extends BaseResponsePageRow {
  /** 父分类 ID；大类为 "0" */
  parentId: string;
  parentCode?: string | null;
  parentName?: string | null;
  code: string;
  name: string;
  sortOrder: number;
  status: boolean;
  remark?: string | null;
  children?: InAppMessageCategoryPageRow[];
}

/**
 * 全量扁平列表
 * @param params 筛选条件
 * @returns 分类列表
 */
export function getInAppMessageCategoryList(params?: InAppMessageCategoryQuery) {
  return http.get<InAppMessageCategoryPageRow[], AxiosRequestConfig<InAppMessageCategoryQuery>>(
    '/system/message/in-app/categories/list',
    { params }
  );
}

/**
 * 站内信业务分类详情
 */
export interface InAppMessageCategoryDetail extends BaseResponseDetail {
  parentId: string;
  parentCode?: string | null;
  parentName?: string | null;
  code: string;
  name: string;
  sortOrder: number;
  status: boolean;
  remark?: string | null;
}
/**
 * 按主键查业务分类详情
 * @param id 分类主键
 * @returns 详情
 */
export function getInAppMessageCategoryById(id: string): Promise<InAppMessageCategoryDetail> {
  return http.get<InAppMessageCategoryDetail, unknown>(`/system/message/in-app/categories/${id}`);
}

/**
 * 启用分类选项（全量列表，前端本地过滤）
 */
export interface InAppMessageCategoryOption {
  id: string;
  code: string;
  name: string;
  sortOrder?: number;
}

/**
 * 大类列表
 * @param status 启停状态
 * @returns 大类选项
 */
export function listInAppMessageCategoryMajors(status?: boolean): Promise<InAppMessageCategoryOption[]> {
  return http.get<InAppMessageCategoryOption[], AxiosRequestConfig<{ status?: boolean }>>(
    '/system/message/in-app/categories/majors',
    { params: status === undefined ? undefined : { status } }
  );
}

/**
 * 指定大类下小类列表
 * @param parentId 大类主键
 * @param status 启停状态
 * @returns 小类选项
 */
export function listInAppMessageCategoryChildren(
  parentId: string,
  status?: boolean
): Promise<InAppMessageCategoryOption[]> {
  return http.get<InAppMessageCategoryOption[], AxiosRequestConfig<{ parentId: string; status?: boolean }>>(
    '/system/message/in-app/categories/children',
    { params: status === undefined ? { parentId } : { parentId, status } }
  );
}

/**
 * 站内信业务分类新增/编辑表单
 */
export interface InAppMessageCategoryFormModel {
  id?: string;
  /** 父分类 ID；"0" 或空=大类 */
  parentId?: string;
  code: string;
  name: string;
  sortOrder?: number;
  status: boolean;
  remark?: string;
}
/**
 * 新增业务分类
 * @param data 新增表单
 * @returns 操作结果文案
 */
export function createInAppMessageCategory(data: InAppMessageCategoryFormModel): Promise<string> {
  return http.post<string, InAppMessageCategoryFormModel>('/system/message/in-app/categories', { data });
}

/**
 * 更新业务分类
 * @param data 更新表单（须含 id）
 * @returns 操作结果文案
 */
export function updateInAppMessageCategory(data: InAppMessageCategoryFormModel): Promise<string> {
  return http.put<string, InAppMessageCategoryFormModel>('/system/message/in-app/categories', { data });
}

/**
 * 批量启用/禁用业务分类
 * @param data ID 列表与目标状态
 * @returns 操作结果文案
 */
export function batchUpdateInAppMessageCategoryStatus(data: IdsEnableStatusRequest): Promise<string> {
  return http.request<string>('put', '/system/message/in-app/categories/status', { data });
}

/**
 * 批量删除业务分类
 * @param ids 分类主键列表
 * @returns 操作结果文案
 */
export function batchDeleteInAppMessageCategories(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/message/in-app/categories', { data: ids });
}
