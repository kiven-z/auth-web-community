import { http } from '@/core/http/client';

/**
 * 文件上传请求参数（multipart/form-data）
 */
export interface FileUploadRequest {
  /** 上传文件 */
  file: File;
  /** 业务类型 */
  bizType: string;
  /** 存储平台 */
  storagePlatform?: string;
}

/**
 * 文件上传响应
 */
export interface FileUploadResponse {
  /** 文件访问地址 */
  url: string;
}

/**
 * 上传文件
 * @param payload 上传参数
 * @returns 上传结果（包含文件 URL）
 */
export function uploadFile(payload: FileUploadRequest) {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('bizType', payload.bizType);
  if (payload.storagePlatform) {
    formData.append('storagePlatform', payload.storagePlatform);
  }

  return http.post<FileUploadResponse, unknown>('/system/file/upload', {
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
