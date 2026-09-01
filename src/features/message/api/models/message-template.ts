/** 消息渠道 */
export type MessageChannelCode = 'EMAIL' | 'SMS' | 'DING_TALK' | 'IN_APP';

/**
 * 变量声明行
 */
export interface MessageTemplateRequireFieldRow {
  key: string;
  description?: string;
  exampleValue: unknown;
}
