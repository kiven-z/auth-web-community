import { http } from '@/core/http/client';

/**
 * 短信模板新增/编辑弹窗表单
 */
export interface SmsTemplateFormModel {
  id?: string;
  /** 场景编码 */
  templateCode?: string;
  templateName?: string;
  /** 厂商模板编码 */
  providerTemplateCode?: string;
  description?: string;
  status: boolean;
  priority: number;
  /** 正文备注（发送以厂商模板为准） */
  content?: string;
}

/**
 * 新建短信模板请求
 */
export type SmsTemplateSaveRequest = SmsTemplateFormModel;

/**
 * 新建短信模板
 * @param data 新建请求
 * @returns 新建响应
 */
export function createSmsTemplate(data: SmsTemplateSaveRequest): Promise<string> {
  return http.post<string, SmsTemplateSaveRequest>('/system/message/sms-template', { data });
}

/** 更新短信模板 */
export function updateSmsTemplate(data: SmsTemplateSaveRequest): Promise<string> {
  return http.request<string>('put', '/system/message/sms-template', { data });
}
