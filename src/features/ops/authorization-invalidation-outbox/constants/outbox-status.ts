/** 允许人工重试的 Outbox 状态（不含 SUCCESS） */
export const OUTBOX_RETRYABLE_STATUSES = ['PENDING', 'PROCESSING', 'FAILED', 'DEAD'] as const;

/**
 * Outbox 是否可展示人工重试按钮
 * @param status 投递状态
 * @returns 是否可重试
 */
export function isOutboxRetryable(status: string): boolean {
  return OUTBOX_RETRYABLE_STATUSES.includes(status as (typeof OUTBOX_RETRYABLE_STATUSES)[number]);
}
