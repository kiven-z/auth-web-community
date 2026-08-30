import type { MessageTemplateRequireFieldRow } from '@/features/message/api/models/messageTemplate';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';

/**
 * 变量声明行
 */
export type EmailTemplateRequireFieldRow = MessageTemplateRequireFieldRow;

/**
 * 分页行
 */
export interface EmailTemplatePageRow extends BaseResponsePageRow {
  /** 场景编码 */
  templateCode: string;
  templateName: string;
  subject: string;
  priority: number;
  status: boolean;
  description?: string;
}

/**
 * 新增/编辑弹窗表单
 */
export interface EmailTemplateFormModel {
  id?: string;
  /** 场景编码 */
  templateCode?: string;
  templateName?: string;
  subject?: string;
  description?: string;
  status: boolean;
  priority: number;
  content: string;
}

/**
 * Monaco 模板编辑弹窗
 */
export interface EmailTemplateMonacoFormModel extends EmailTemplateFormModel {
  requireFields?: EmailTemplateRequireFieldRow[];
}

/**
 * 保存请求
 */
export type EmailTemplateSaveRequest = EmailTemplateFormModel;

/**
 * 新建邮件模板
 * @param data 新建邮件模板请求
 * @returns 新建邮件模板响应
 */
export function createEmailTemplate(data: EmailTemplateSaveRequest): Promise<string> {
  return http.post<string, EmailTemplateSaveRequest>('/system/message/email-template', { data });
}

/**
 * 更新邮件模板
 * @param data 保存请求
 * @returns 更新响应
 */
export function updateEmailTemplate(data: EmailTemplateSaveRequest): Promise<string> {
  return http.request<string>('put', '/system/message/email-template', { data });
}

/**
 * 正文对应库字段
 */
export interface EmailTemplateContentUpdateRequest {
  id: string;
  content: string;
}

/**
 * 仅更新正文
 * @param data 模板 ID 与正文
 * @returns 更新响应
 */
export function updateEmailTemplateContent(data: EmailTemplateContentUpdateRequest): Promise<string> {
  return http.request<string>('put', '/system/message/email-template/content', { data });
}

/**
 * 离线渲染
 */
export interface EmailTemplateRenderRequest {
  content: string;
  requireFields: EmailTemplateRequireFieldRow[];
}

/**
 * 离线渲染模板
 * @param data 内容与变量声明
 * @returns 离线渲染模板响应
 */
export function renderEmailTemplate(data: EmailTemplateRenderRequest): Promise<string> {
  return http.post<string, EmailTemplateRenderRequest>('/system/message/email-template/render', { data });
}
