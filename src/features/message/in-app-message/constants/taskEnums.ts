import type { InAppMessageStatusCode } from '@/features/message/api/inAppMessage';

/** 可补发状态 */
export const IN_APP_MESSAGE_RETRYABLE_STATUS: ReadonlySet<InAppMessageStatusCode> = new Set<InAppMessageStatusCode>([
  'PENDING',
  'SENDING',
  'PARTIAL',
  'FAILED',
  'NO_RECIPIENTS',
]);

/** 可撤回状态 */
export const IN_APP_MESSAGE_RECALLABLE_STATUS: ReadonlySet<InAppMessageStatusCode> = new Set<InAppMessageStatusCode>([
  'SUCCESS',
  'PARTIAL',
  'NO_RECIPIENTS',
]);

/** 可删除状态 */
export const IN_APP_MESSAGE_DELETABLE_STATUS: ReadonlySet<InAppMessageStatusCode> = new Set<InAppMessageStatusCode>([
  'SUCCESS',
  'PARTIAL',
  'FAILED',
  'NO_RECIPIENTS',
  'RECALLED',
]);
