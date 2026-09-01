import type { InAppContentType } from '@/features/message/api/models/content-type';

/** 写入撰写表单的定稿字段（模板 / 历史导入共用） */
export interface InAppComposeImportPayload {
  /** 来源模板/场景编码；模板导入有值，历史导入可无 */
  templateCode?: string;
  title: string;
  body: string;
  contentType: InAppContentType;
  /** 业务小类 ID */
  categoryId?: string;
  /** 默认跳转链接 */
  linkUrl?: string;
}

/** 模板导入结果 */
export type InAppTemplateImportPayload = InAppComposeImportPayload & {
  templateCode: string;
};

/** 历史发送导入结果（不覆盖接收范围） */
export type InAppHistoryImportPayload = InAppComposeImportPayload;
