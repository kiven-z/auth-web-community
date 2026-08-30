import type { InAppContentType } from '@/features/message/api/models/contentType';
import { http } from '@/core/http/client';

/**
 * 站内信模板新增/编辑表单
 */
export interface InAppTemplateFormModel {
  id?: string;
  /** 场景编码 */
  templateCode?: string;
  templateName?: string;
  subject?: string;
  /** 正文类型 */
  contentType: InAppContentType;
  content: string;
  description?: string;
  status: boolean;
  priority: number;
  /** 默认业务小类 ID */
  categoryId?: string;
  /** 默认跳转链接 */
  linkUrl?: string;
}

/**
 * 新建站内信模板请求
 */
export type InAppTemplateSaveRequest = InAppTemplateFormModel;

/**
 * 新建站内信模板
 * @param data 新建请求
 * @returns 新建响应
 */
export function createInAppTemplate(data: InAppTemplateSaveRequest): Promise<string> {
  return http.post<string, InAppTemplateSaveRequest>('/system/message/in-app-template', { data });
}

/**
 * 更新站内信模板
 * @param data 保存请求
 * @returns 更新响应
 */
export function updateInAppTemplate(data: InAppTemplateSaveRequest): Promise<string> {
  return http.request<string>('put', '/system/message/in-app-template', { data });
}
