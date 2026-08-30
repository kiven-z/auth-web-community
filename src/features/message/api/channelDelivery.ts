import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';
import type { MessageChannelCode } from '@/features/message/api/models/messageTemplate';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/** 渠道投递状态 */
export type MessageDeliveryStatusCode = 'PENDING' | 'SUCCESS' | 'FAILED' | 'SKIPPED';

/**
 * 渠道投递记录分页查询参数
 */
export interface ChannelDeliveryPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 任务/批次 ID */
  taskId?: string;
  channel?: MessageChannelCode;
  status?: MessageDeliveryStatusCode;
}

/**
 * 渠道投递记录分页行
 */
export interface ChannelDeliveryPageRow extends BaseResponsePageRow {
  /** 任务/批次 ID */
  taskId: string;
  channel: MessageChannelCode;
  status: MessageDeliveryStatusCode;
  providerMsgId?: string | null;
  errorCode?: string | null;
  sentAt?: string | null;
}

/**
 * 分页查询渠道投递记录
 * @param params 查询参数
 * @returns 投递记录分页数据
 */
export function getChannelDeliveryPage(params: ChannelDeliveryPageQuery) {
  return http.get<PageResponse<ChannelDeliveryPageRow>, AxiosRequestConfig<ChannelDeliveryPageQuery>>(
    '/system/message/channel-delivery',
    { params }
  );
}

/**
 * 渠道投递记录详情
 */
export interface ChannelDeliveryDetailVO extends BaseResponseDetail {
  /** 任务/批次 ID */
  taskId: string;
  channel: MessageChannelCode;
  /** 投递目标 */
  targetValue?: string | null;
  status: MessageDeliveryStatusCode;
  providerMsgId?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  sentAt?: string | null;
  retryCount?: number | null;
  remark?: string | null;
}

/**
 * 按主键查询渠道投递记录详情
 * @param id 投递记录主键
 * @returns 投递记录详情
 */
export function getChannelDeliveryById(id: string) {
  return http.get<ChannelDeliveryDetailVO, AxiosRequestConfig>(`/system/message/channel-delivery/${id}`);
}

/**
 * 批量删除渠道投递记录
 * @param ids 投递记录主键数组
 * @returns 删除结果
 */
export function batchDeleteChannelDeliveries(ids: string[]) {
  return http.request<string>('delete', '/system/message/channel-delivery', { data: ids });
}
