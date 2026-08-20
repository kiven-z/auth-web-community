import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';
import type { IdsEnableStatusRequest } from '@/api/common/request';
import { http } from '@/core/http/client';
import type {
  SysJobLastExecutionStatus,
  SysJobQuartzRuntimeStatus,
} from '@/features/schedule/api/models/job-runtime-status';
import type { AxiosRequestConfig } from 'axios';

/**
 * 定时任务分页查询参数
 */
export interface SysJobPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  jobName?: string;
  jobGroup?: string;
  status?: boolean;
}

/**
 * 定时任务分页行
 */
export interface SysJobPageRow extends BaseResponsePageRow {
  jobName: string;
  jobGroup: string;
  jobClass?: string;
  taskType?: string;
  handlerCode?: string;
  invokeTarget?: string;
  cronExpression?: string;
  timeZone?: string;
  misfirePolicy?: number;
  concurrent?: boolean;
  startTime?: string;
  endTime?: string;
  status?: boolean;
  jobParams?: string;
  payloadJson?: string;
  remark?: string;
  lastExecutionStatus?: SysJobLastExecutionStatus;
  lastExecutionTime?: string;
}

/**
 * 分页查询定时任务
 * @param params 定时任务分页查询参数
 * @returns 定时任务分页行
 */
export function getJobPage(params: SysJobPageQuery): Promise<PageResponse<SysJobPageRow>> {
  return http.get<PageResponse<SysJobPageRow>, AxiosRequestConfig<SysJobPageQuery>>('/system/job', {
    params,
  });
}

/**
 * 定时任务详情
 */
export interface SysJobDetailRow extends BaseResponseDetail {
  jobName: string;
  jobGroup: string;
  jobGroupName?: string;
  jobClass?: string;
  taskType?: string;
  handlerCode?: string;
  invokeTarget?: string;
  cronExpression?: string;
  timeZone?: string;
  misfirePolicy?: number;
  concurrent?: boolean;
  startTime?: string;
  endTime?: string;
  status?: boolean;
  jobParams?: string;
  payloadJson?: string;
  remark?: string;
  previousFireTime?: string;
  nextFireTime?: string;
  quartzRuntimeStatus?: SysJobQuartzRuntimeStatus;
  quartzFireTime?: string;
  lastExecutionStatus?: SysJobLastExecutionStatus;
  lastExecutionTime?: string;
}

/**
 * 定时任务详情
 * @param id 任务主键
 * @returns 任务详情
 */
export function getJobDetail(id: string): Promise<SysJobDetailRow> {
  return http.get<SysJobDetailRow, AxiosRequestConfig>(`/system/job/${id}`);
}

/**
 * 新增定时任务请求体
 */
export interface SysJobCreateForm {
  jobName: string;
  jobGroup: string;
  jobClass?: string;
  taskType: string;
  handlerCode?: string;
  invokeTarget?: string;
  cronExpression: string;
  timeZone?: string;
  misfirePolicy: number;
  concurrent: boolean;
  startTime?: string;
  endTime?: string;
  status: boolean;
  jobParams?: string;
  payloadJson?: string;
  remark?: string;
}

/**
 * 新增定时任务
 * @param data 新增表单数据
 */
export function createJob(data: SysJobCreateForm): Promise<string> {
  return http.post<string, SysJobCreateForm>('/system/job', { data });
}

/**
 * 修改定时任务请求体
 */
export interface SysJobUpdateForm {
  id: string;
  taskType: string;
  cronExpression: string;
  timeZone?: string;
  misfirePolicy: number;
  concurrent: boolean;
  startTime?: string;
  endTime?: string;
  status: boolean;
  jobParams?: string;
  handlerCode?: string;
  payloadJson?: string;
  invokeTarget?: string;
  remark?: string;
}

/**
 * 修改定时任务
 * @param data 修改表单数据
 */
export function updateJob(data: SysJobUpdateForm): Promise<string> {
  return http.request<string>('put', '/system/job', { data });
}

/**
 * 批量启停任务
 * @param data 任务 ID 列表与目标状态
 */
export function batchUpdateJobStatus(data: IdsEnableStatusRequest): Promise<string> {
  return http.request<string>('put', '/system/job/status', { data });
}

/**
 * 立即执行一次
 * @param id 任务主键
 */
export function runJobOnce(id: string): Promise<string> {
  return http.post<string, undefined>(`/system/job/${id}/run`);
}

/**
 * 删除定时任务
 * @param id 任务主键
 */
export function deleteJob(id: string): Promise<string> {
  return http.request<string>('delete', `/system/job/${id}`);
}

/** 白名单任务类 */
export interface QuartzTaskClassRow {
  className: string;
  name: string;
  description?: string;
  invokeModes?: string[];
  jobParamsExample?: string;
}

/**
 * 白名单任务类列表
 */
export function getJobCatalogClasses(): Promise<QuartzTaskClassRow[]> {
  return http.get<QuartzTaskClassRow[], AxiosRequestConfig>('/system/job/catalog/classes');
}

/** 白名单任务类可选方法 */
export interface QuartzTaskMethodRow {
  methodName: string;
  parameterSignature: string;
  returnType: string;
  invokeTargetExample: string;
}

/**
 * 白名单任务类可调用方法列表
 * @param className 类全限定名
 */
export function getJobCatalogMethods(className: string): Promise<QuartzTaskMethodRow[]> {
  return http.get<QuartzTaskMethodRow[], AxiosRequestConfig>('/system/job/catalog/methods', {
    params: { className },
  });
}
