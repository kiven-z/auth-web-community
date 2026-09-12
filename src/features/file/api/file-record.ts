import type { PageResponse } from '@/api/common/page';
import type { FileRecordDetail, FileRecordPageQuery, FileRecordPageRow } from '@/features/file/api/models/file-record';
import { http } from '@/core/http/client';
import type { BlobDownloadPayload } from '@/shared/utils/file/download';
import type { AxiosRequestConfig } from 'axios';

/**
 * 文件记录分页查询
 */
export function queryFileRecordPage(params: FileRecordPageQuery) {
  return http.get<PageResponse<FileRecordPageRow>, AxiosRequestConfig<FileRecordPageQuery>>('/system/file/page', {
    params,
  });
}

/**
 * 文件记录详情
 * @param id 文件记录ID
 * @returns 文件记录详情
 */
export function getFileRecordDetail(id: string) {
  return http.get<FileRecordDetail, AxiosRequestConfig>(`/system/file/${id}`);
}

/**
 * 批量删除文件记录
 * @param ids 文件记录ID数组
 * @returns 删除响应
 */
export function deleteFileRecord(ids: string[]) {
  return http.request<string>('delete', '/system/file', { data: ids });
}

/**
 * 批量下载文件记录（ZIP）。
 * @param ids 文件记录ID数组
 * @returns ZIP Blob 及服务端文件名
 */
export function downloadFileRecord(ids: string[]) {
  return http.post<BlobDownloadPayload, string[]>(
    '/system/file/download',
    { data: ids },
    { responseType: 'blob', blobWithFilename: true }
  );
}

/**
 * 文件隐私切换请求体
 */
export interface FilePrivacyUpdateForm {
  ids: string[];
  isPrivate: boolean;
}

/**
 * 批量切换文件隐私属性
 * @param ids 文件记录ID数组
 * @param isPrivate 目标是否私有
 * @returns 操作响应
 */
export function updateFileRecordPrivacy(ids: string[], isPrivate: boolean) {
  return http.post<string, FilePrivacyUpdateForm>('/system/file/privacy', { data: { ids, isPrivate } });
}
