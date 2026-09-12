import type { PageResponse } from '@/api/common/page';
import type { BaseResponsePageRow } from '@/api/common/response';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/** 我的站内信分页查询参数 */
export interface InAppInboxPageQuery {
  pageIndex?: number;
  pageSize?: number;
  /** 业务大类 ID（Tab） */
  majorCategoryId?: string;
  /** 业务小类 ID */
  categoryId?: string;
  isRead?: boolean;
  /** 标题关键字 */
  title?: string;
}

/** 我的站内信分页行 */
export interface InAppInboxPageRow extends BaseResponsePageRow {
  sceneCode?: string | null;
  title: string;
  contentType: string;
  categoryId?: string | null;
  categoryName?: string | null;
  linkUrl?: string | null;
  /** 发起人用户 ID */
  senderUserId?: string | null;
  isRead: boolean;
  readTime?: string | null;
}

/**
 * 分页查询我的站内信。
 * @param params 分页与筛选参数
 * @returns 收件箱分页数据
 */
export function getInAppInboxPage(params: InAppInboxPageQuery) {
  return http.get<PageResponse<InAppInboxPageRow>, AxiosRequestConfig<InAppInboxPageQuery>>(
    '/system/me/message/in-app/inbox',
    { params }
  );
}

/** 大类 Tab / 未读项 */
export interface InAppInboxMajorUnread {
  majorCategoryId: string;
  majorCategoryName: string;
  majorCategoryCode: string;
  unreadCount: number;
}

/** 我的站内信未读角标 */
export interface InAppInboxUnreadCount {
  totalUnreadCount: number;
  /** 启用大类全量 */
  majors: InAppInboxMajorUnread[];
}

/**
 * 查询我的站内信未读角标
 * @returns 未读统计
 */
export function getInAppInboxUnreadCount() {
  return http.get<InAppInboxUnreadCount, AxiosRequestConfig>('/system/me/message/in-app/inbox/unread-count');
}

/**
 * 批量标已读
 * @param ids 站内信 ID 数组
 */
export function markInAppInboxRead(ids: string[]) {
  return http.post<string, string[]>('/system/me/message/in-app/inbox/read', { data: ids });
}

/**
 * 批量删除我的站内信（用户侧逻辑删除）
 * @param ids 站内信 ID 数组
 */
export function batchDeleteInAppInbox(ids: string[]) {
  return http.request<string>('delete', '/system/me/message/in-app/inbox', { data: ids });
}

/**
 * 当前大类全部已读
 * @param majorCategoryId 业务大类 ID
 */
export function markAllInAppInboxRead(majorCategoryId: string) {
  return http.post<string, never>('/system/me/message/in-app/inbox/read-all', {
    params: { majorCategoryId },
  });
}

/**
 * 当前大类全部删除（用户侧软删除）
 * @param majorCategoryId 业务大类 ID
 */
export function deleteAllInAppInbox(majorCategoryId: string) {
  return http.request<string>('delete', '/system/me/message/in-app/inbox/all', {
    params: { majorCategoryId },
  });
}

/** 我的站内信详情 */
export interface InAppInboxDetail extends InAppInboxPageRow {
  content: string;
}

/**
 * 查询站内信详情（打开即标已读）
 * @param messageId 站内信 ID
 * @returns 详情
 */
export function getInAppInboxDetail(messageId: string) {
  return http.get<InAppInboxDetail, AxiosRequestConfig>(`/system/me/message/in-app/inbox/${messageId}`);
}
