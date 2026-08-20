import type { PageResponse } from '@/api/common/page';
import type { FileRecordDetail, FileRecordPageQuery, FileRecordPageRow } from '@/features/file/api/models/file-record';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 个人回收站分页查询。
 * @param parameters 分页与筛选参数
 * @returns 回收站分页数据
 */
export function queryPersonalFileRecyclePage(
  parameters: FileRecordPageQuery
): Promise<PageResponse<FileRecordPageRow>> {
  return http.get<PageResponse<FileRecordPageRow>, AxiosRequestConfig<FileRecordPageQuery>>(
    '/system/me/file/recycle/page',
    {
      params: parameters,
    }
  );
}

/**
 * 个人回收站文件详情查询。
 * @param id 文件记录主键
 * @returns 文件记录详情
 */
export function getPersonalFileRecycleDetail(id: string): Promise<FileRecordDetail> {
  return http.get<FileRecordDetail, AxiosRequestConfig>(`/system/me/file/recycle/${id}`);
}

/**
 * 个人回收站批量恢复。
 * @param ids 回收站主键列表
 * @returns 无返回值
 */
export function restorePersonalFileRecycle(ids: string[]): Promise<void> {
  return http.post<void, string[]>('/system/me/file/recycle/restore', { data: ids });
}

/**
 * 个人回收站批量彻底删除。
 * @param ids 回收站主键列表
 * @returns 无返回值
 */
export function purgePersonalFileRecycle(ids: string[]): Promise<void> {
  return http.request<void>('delete', '/system/me/file/recycle/purge', { data: ids });
}
