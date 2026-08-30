import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';

/**
 * 文件记录分页查询参数
 */
export interface FileRecordPageQuery {
  pageIndex?: number;
  pageSize?: number;
  ownerUserId?: string;
  bizType?: string;
  bizId?: string;
  contentType?: string;
  originalName?: string;
  startTime?: string;
  endTime?: string;
  isPrivate?: boolean;
}

/**
 * 文件记录分页行
 */
export interface FileRecordPageRow extends BaseResponsePageRow {
  storagePlatform?: string;
  uploadMode?: string;
  originalName?: string;
  contentType?: string;
  size?: number;
  isPrivate?: boolean;
  bizType?: string;
  bizId?: string;
}

/**
 * 文件记录详情
 */
export interface FileRecordDetail extends BaseResponseDetail {
  storagePlatform?: string;
  uploadMode?: string;
  bucket?: string;
  objectKey?: string;
  url?: string;
  accessUrl?: string;
  originalName?: string;
  extension?: string;
  contentType?: string;
  size?: number;
  isPrivate?: boolean;
  etag?: string;
  bizType?: string;
  bizId?: string;
  remark?: string;
  deleteSource?: string;
  deletedBy?: string;
  deletedAt?: string;
}
