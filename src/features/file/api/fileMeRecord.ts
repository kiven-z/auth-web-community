import type { PageResponse } from '@/api/common/page';
import type { FileRecordDetail, FileRecordPageQuery, FileRecordPageRow } from '@/features/file/api/models/fileRecord';
import { http } from '@/core/http/client';
import type { BlobDownloadPayload } from '@/shared/utils/file/download';
import type { AxiosRequestConfig } from 'axios';

/**
 * 个人文件记录分页查询。
 * @param parameters 分页与筛选参数
 * @returns 文件记录分页数据
 */
export function queryPersonalFileRecordPage(parameters: FileRecordPageQuery): Promise<PageResponse<FileRecordPageRow>> {
  return http.get<PageResponse<FileRecordPageRow>, AxiosRequestConfig<FileRecordPageQuery>>('/system/me/file/page', {
    params: parameters,
  });
}

/**
 * 个人文件记录详情查询。
 * @param id 文件记录主键
 * @returns 文件记录详情
 */
export function getPersonalFileRecordDetail(id: string): Promise<FileRecordDetail> {
  return http.get<FileRecordDetail, AxiosRequestConfig>(`/system/me/file/${id}`);
}

/**
 * 个人文件记录批量删除。
 * @param ids 文件记录主键列表
 * @returns 删除响应
 */
export function deletePersonalFileRecord(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/me/file', { data: ids });
}

/**
 * 个人文件记录批量下载。
 * @param ids 文件记录主键列表
 * @returns ZIP Blob 及服务端文件名
 */
export function downloadPersonalFileRecord(ids: string[]): Promise<BlobDownloadPayload> {
  return http.post<BlobDownloadPayload, string[]>(
    '/system/me/file/download',
    { data: ids },
    { responseType: 'blob', blobWithFilename: true }
  );
}
