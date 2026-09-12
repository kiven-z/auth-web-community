import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';
import type { InAppContentType } from '@/features/message/api/models/content-type';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/** 站内信接收范围类型 */
export type InAppRecipientScopeType = 'USER' | 'POST' | 'DEPT' | 'ALL';

/** 站内信发送来源 */
export type InAppMessageSourceType = 'ADMIN_COMPOSE' | 'TEMPLATE' | 'SYSTEM';

/** 站内信发送任务状态 */
export type InAppMessageStatusCode =
  | 'PENDING'
  | 'SENDING'
  | 'SUCCESS'
  | 'PARTIAL'
  | 'FAILED'
  | 'NO_RECIPIENTS'
  | 'RECALLED';

/**
 * 管理端站内信按范围发送请求
 */
export interface InAppComposeRequest {
  recipientScopeType: InAppRecipientScopeType;
  recipientScopeIds?: string[];
  includeChildren?: boolean;
  /** 起草来源模板 */
  templateCode?: string;
  title: string;
  body: string;
  contentType: InAppContentType;
  categoryId?: string;
  linkUrl?: string;
}

/**
 * 站内信发送结果
 */
export interface InAppComposeResult {
  taskId: string;
  totalCount: number;
  successCount: number;
  status: string;
}

/**
 * 管理端按范围发送站内信
 * @param data 发送请求
 * @returns 发送结果
 */
export function sendInAppMessage(data: InAppComposeRequest) {
  return http.post<InAppComposeResult, InAppComposeRequest>('/system/message/in-app/send', { data });
}

/**
 * 站内信发送任务分页查询参数
 */
export interface InAppSendTaskPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  status?: InAppMessageStatusCode;
  sourceType?: InAppMessageSourceType;
  recipientScopeType?: InAppRecipientScopeType;
  /** 业务小类 ID */
  categoryId?: string;
  /** 标题关键字 */
  title?: string;
}

/**
 * 站内信发送任务分页行
 */
export interface InAppSendTaskPageRow extends BaseResponsePageRow {
  sourceType: InAppMessageSourceType;
  sceneCode?: string | null;
  title: string;
  contentType: InAppContentType;
  /** 业务小类 ID */
  categoryId?: string | null;
  /** 业务小类名称 */
  categoryName?: string | null;
  /** 发起人用户 ID */
  senderUserId?: string | null;
  recipientScopeType: InAppRecipientScopeType;
  totalCount: number;
  successCount: number;
  failCount: number;
  status: InAppMessageStatusCode;
  recalledAt?: string | null;
}

/**
 * 分页查询站内信发送任务
 * @param params 查询参数
 * @returns 发送任务分页数据
 */
export function getInAppSendTaskPage(params: InAppSendTaskPageQuery) {
  return http.get<PageResponse<InAppSendTaskPageRow>, AxiosRequestConfig<InAppSendTaskPageQuery>>(
    '/system/message/in-app/tasks',
    { params }
  );
}

/**
 * 站内信发送任务详情
 */
export interface InAppSendTaskDetailVO extends BaseResponseDetail {
  sourceType: InAppMessageSourceType;
  sceneCode?: string | null;
  title: string;
  contentType: InAppContentType;
  /** 定稿正文 */
  content: string;
  /** 业务小类 ID */
  categoryId?: string | null;
  /** 业务小类名称 */
  categoryName?: string | null;
  linkUrl?: string | null;
  /** 发起人用户 ID */
  senderUserId?: string | null;
  recipientScopeType: InAppRecipientScopeType;
  /** 接收范围快照原始 JSON */
  recipientScopeJson?: string | null;
  /** 范围 ID 列表（由快照解析；ALL 为空） */
  recipientScopeIds?: string[] | null;
  /** 仅 DEPT 有值 */
  includeChildren?: boolean | null;
  totalCount: number;
  successCount: number;
  failCount: number;
  status: InAppMessageStatusCode;
  recalledAt?: string | null;
  /** 撤回操作人用户 ID */
  recallUserId?: string | null;
  remark?: string | null;
}

/**
 * 按任务 ID 查询站内信发送任务详情
 * @param taskId 任务 ID
 * @returns 发送任务详情
 */
export function getInAppSendTaskById(taskId: string) {
  return http.get<InAppSendTaskDetailVO, AxiosRequestConfig>(`/system/message/in-app/tasks/${taskId}`);
}

/**
 * 站内信发送任务收件人分页查询参数
 */
export interface InAppSendTaskRecipientPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 接收人用户 ID */
  userId?: string;
  /** 是否已读 */
  isRead?: boolean;
  /** 用户侧是否软删除 */
  isDeleted?: boolean;
}

/**
 * 站内信发送任务收件人/互动用户分页行
 */
export interface InAppSendTaskRecipientPageRow extends BaseResponsePageRow {
  /** 站内信任务 ID */
  messageId: string;
  /** 用户 ID */
  userId: string;
  /** 用户名 */
  username?: string | null;
  /** 是否已读 */
  isRead: boolean;
  /** 已读时间 */
  readTime?: string | null;
  /** 用户侧是否软删除 */
  isDeleted: boolean;
}

/**
 * 分页查询站内信任务收件人（写扩散）或互动用户（读扩散 ALL）
 * @param taskId 任务 ID
 * @param params 查询参数
 * @returns 收件人分页数据
 */
export function getInAppSendTaskRecipientPage(taskId: string, params: InAppSendTaskRecipientPageQuery) {
  return http.get<PageResponse<InAppSendTaskRecipientPageRow>, AxiosRequestConfig<InAppSendTaskRecipientPageQuery>>(
    `/system/message/in-app/tasks/${taskId}/recipients`,
    { params }
  );
}

/**
 * 补发站内信发送任务（仅 PUSH 定向任务）
 * @param taskId 任务 ID
 */
export function retryInAppSendTask(taskId: string) {
  return http.post<void, undefined>(`/system/message/in-app/tasks/${taskId}/retry`);
}

/**
 * 撤回站内信发送任务（SUCCESS / PARTIAL / NO_RECIPIENTS）
 * @param taskId 任务 ID
 */
export function recallInAppSendTask(taskId: string) {
  return http.post<void, undefined>(`/system/message/in-app/tasks/${taskId}/recall`);
}

/**
 * 批量删除站内信发送任务（仅终态可删）
 * @param ids 任务 ID 数组
 */
export function batchDeleteInAppSendTasks(ids: string[]) {
  return http.request<string>('delete', '/system/message/in-app/tasks', { data: ids });
}
