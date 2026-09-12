import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 任务分组分页查询参数
 */
export interface SysJobGroupPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  groupCode?: string;
  groupName?: string;
  status?: boolean;
}

/**
 * 任务分组分页行
 */
export interface SysJobGroupPageRow extends BaseResponsePageRow {
  groupCode: string;
  groupName: string;
  description?: string;
  status: boolean;
  isSystem: boolean;
  orderNum: number;
}

/**
 * 分页查询任务分组
 * @param params 任务分组分页查询参数
 * @returns 任务分组分页行
 */
export function getJobGroupPage(params: SysJobGroupPageQuery) {
  return http.get<PageResponse<SysJobGroupPageRow>, AxiosRequestConfig<SysJobGroupPageQuery>>('/system/job-group', {
    params,
  });
}

/**
 * 任务分组远程搜索参数
 */
export interface SysJobGroupSearchQuery {
  keyword?: string;
  limit?: number;
}

/**
 * 远程搜索任务分组选项
 * @param params 搜索参数
 * @returns 分组选项列表
 */
export function searchJobGroupOptions(params: SysJobGroupSearchQuery) {
  return http.get<SysJobGroupPageRow[], AxiosRequestConfig<SysJobGroupSearchQuery>>('/system/job-group/options', {
    params,
  });
}

/**
 * 任务分组详情
 */
export interface SysJobGroupDetailRow extends BaseResponseDetail {
  groupCode: string;
  groupName: string;
  description?: string;
  status: boolean;
  isSystem: boolean;
  orderNum: number;
}

/**
 * 任务分组详情
 * @param id 分组主键
 * @returns 任务分组详情
 */
export function getJobGroupDetail(id: string) {
  return http.get<SysJobGroupDetailRow, AxiosRequestConfig>(`/system/job-group/${id}`);
}

/**
 * 新增任务分组请求体
 */
export interface CreateJobGroupRequest {
  groupCode: string;
  groupName: string;
  description?: string;
  status: boolean;
  orderNum?: number;
}

/**
 * 新增任务分组
 * @param data 新增表单数据
 * @returns 新增任务分组响应
 */
export function createJobGroup(data: CreateJobGroupRequest) {
  return http.post<string, CreateJobGroupRequest>('/system/job-group', { data });
}

/**
 * 修改任务分组请求体（不含 groupCode）
 */
export interface UpdateJobGroupRequest {
  id: string;
  groupName: string;
  description?: string;
  status: boolean;
  orderNum: number;
}

/**
 * 修改任务分组
 * @param data 修改表单数据
 */
export function updateJobGroup(data: UpdateJobGroupRequest) {
  return http.request<string>('put', '/system/job-group', { data });
}

/**
 * 删除任务分组
 * @param id 分组主键
 */
export function deleteJobGroup(id: string) {
  return http.request<string>('delete', `/system/job-group/${id}`);
}
/**
 * 批量启停分组下全部任务
 * @param groupCode 分组编码
 * @param status 目标运行状态
 */
export function updateJobGroupJobsStatus(groupCode: string, status: boolean) {
  return http.request<string>('put', `/system/job-group/${groupCode}/jobs/status`, { params: { status } });
}
