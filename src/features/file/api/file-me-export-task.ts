import type { PageResponse } from '@/api/models/page';
import type {
  FileExportTaskDetail,
  FileExportTaskDownloadLink,
  FileExportTaskPageQuery,
  FileExportTaskPageRow,
} from '@/features/file/api/models/file-export-task';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 个人异步导出任务分页查询
 * @param parameters 分页与筛选参数
 * @returns 导出任务分页数据
 */
export function queryPersonalFileExportTaskPage(parameters: FileExportTaskPageQuery) {
  return http.get<PageResponse<FileExportTaskPageRow>, AxiosRequestConfig<FileExportTaskPageQuery>>(
    '/system/me/file-export-tasks/page',
    {
      params: parameters,
    }
  );
}

/**
 * 个人异步导出任务详情查询
 * @param id 导出任务主键
 * @returns 导出任务详情
 */
export function getPersonalFileExportTaskDetail(id: string) {
  return http.get<FileExportTaskDetail, AxiosRequestConfig>(`/system/me/file-export-tasks/${id}`);
}

/**
 * 取消个人异步导出任务。
 * @param id 导出任务主键
 * @returns 无返回值
 */
export function cancelPersonalFileExportTask(id: string) {
  return http.post<void, undefined>(`/system/me/file-export-tasks/${id}/cancel`);
}

/**
 * 重试个人异步导出任务。
 * @param id 导出任务主键
 * @returns 无返回值
 */
export function retryPersonalFileExportTask(id: string) {
  return http.post<void, undefined>(`/system/me/file-export-tasks/${id}/retry`);
}

/**
 * 获取个人异步导出任务下载链接。
 * @param id 导出任务主键
 * @returns 临时下载链接
 */
export function getPersonalFileExportTaskDownloadLink(id: string) {
  return http.get<FileExportTaskDownloadLink, AxiosRequestConfig>(`/system/me/file-export-tasks/${id}/download-link`);
}
