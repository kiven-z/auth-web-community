import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 任务调度日志分页查询参数
 */
export interface JobLogPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 任务 ID（job.id） */
  jobId?: string;
  /** 任务名称 */
  jobName?: string;
  /** 任务分组 */
  jobGroup?: string;
  /** 调用目标 */
  invokeTarget?: string;
  /** 触发类型 */
  triggerType?: string;
  /** 耗时(ms) */
  elapsedTime?: number;
  /** 执行结果 */
  status?: boolean;
}

/**
 * 任务调度日志分页行
 */
export interface JobLogPageRow extends BaseResponsePageRow {
  jobId?: string | null;
  jobName?: string | null;
  /** 任务分组 */
  jobGroup?: string | null;
  /** 执行时调用目标 */
  invokeTarget?: string | null;
  triggerType?: string | null;
  status: boolean;
  /** 耗时（毫秒） */
  elapsedTime?: number | null;
  /** 执行报告 */
  jobMessage?: string | null;
}

/**
 * 分页查询任务调度日志
 * @param params 分页查询参数
 * @returns 任务调度日志分页行
 */
export function getJobLogPage(params: JobLogPageQuery): Promise<PageResponse<JobLogPageRow>> {
  return http.get<PageResponse<JobLogPageRow>, AxiosRequestConfig<JobLogPageQuery>>('/system/log/job/page', {
    params,
  });
}

/**
 * 任务调度日志详情
 */
export interface JobLogDetailRow extends BaseResponsePageRow {
  jobId?: string | null;
  jobName?: string | null;
  /** 任务分组 */
  jobGroup?: string | null;
  /** 执行时调用目标 */
  invokeTarget?: string | null;
  triggerType?: string | null;
  jobMessage?: string | null;
  /** 执行是否成功 */
  status: boolean;
  /** 异常信息 */
  exceptionInfo?: string | null;
  /** 耗时（毫秒） */
  elapsedTime?: number | null;
}

/**
 * 任务调度日志详情
 * @param id 日志 ID
 * @returns 任务调度日志详情
 */
export function getJobLogDetail(id: string): Promise<JobLogDetailRow> {
  return http.get<JobLogDetailRow, AxiosRequestConfig>(`/system/log/job/${id}`);
}

/**
 * 批量物理删除任务调度日志
 * @param ids 日志 ID 数组
 * @returns 删除结果
 */
export function deleteJobLog(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/log/job', { data: ids });
}
