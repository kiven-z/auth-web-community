import { http } from '@/core/http/client';
import type { PageResponse } from '@/api/common/page';
import type { AxiosRequestConfig } from 'axios';
import type { FileRecordDetail, FileRecordPageQuery, FileRecordPageRow } from '@/features/file/api/models/file-record';

/**
 * 回收站分页查询
 */
export function getFileRecyclePage(params: FileRecordPageQuery): Promise<PageResponse<FileRecordPageRow>> {
  return http.get<PageResponse<FileRecordPageRow>, AxiosRequestConfig<FileRecordPageQuery>>(
    '/system/file/recycle/page',
    { params }
  );
}

/**
 * 回收站文件详情
 * @param id 文件记录ID
 * @returns 文件记录详情
 */
export function getFileRecycleDetail(id: string): Promise<FileRecordDetail> {
  return http.get<FileRecordDetail, AxiosRequestConfig>(`/system/file/recycle/${id}`);
}

/**
 * 回收站批量恢复
 */
export function restoreFileRecycle(ids: string[]): Promise<void> {
  return http.post<void, string[]>('/system/file/recycle/restore', { data: ids });
}

/**
 * 回收站批量彻底删除
 */
export function purgeFileRecycle(ids: string[]): Promise<void> {
  return http.request<void>('delete', '/system/file/recycle/purge', { data: ids });
}
