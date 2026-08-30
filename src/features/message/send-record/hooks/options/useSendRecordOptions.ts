import type { MessageDeliveryStatusCode } from '@/features/message/api/channel-delivery';
import type { MessageChannelCode } from '@/features/message/api/models/message-template';
import type { SelectOption, TagSelectOption } from '@/shared/types/select-option';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 发送记录枚举选项（文案随 locale 更新）
 * @returns 渠道 / 投递状态
 */
function useSendRecordOptions() {
  const { t } = useI18n();

  const channelOptions = computed<SelectOption<MessageChannelCode>[]>(() => [
    { value: 'EMAIL', label: t('sendRecord.channel.EMAIL') },
    { value: 'SMS', label: t('sendRecord.channel.SMS') },
    { value: 'DING_TALK', label: t('sendRecord.channel.DING_TALK') },
  ]);

  const statusOptions = computed<TagSelectOption<MessageDeliveryStatusCode>[]>(() => [
    { value: 'PENDING', label: t('sendRecord.status.PENDING'), tagType: 'info' },
    { value: 'SUCCESS', label: t('sendRecord.status.SUCCESS'), tagType: 'success' },
    { value: 'FAILED', label: t('sendRecord.status.FAILED'), tagType: 'danger' },
    { value: 'SKIPPED', label: t('sendRecord.status.SKIPPED'), tagType: 'warning' },
  ]);

  return {
    channelOptions,
    statusOptions,
  };
}

export default useSendRecordOptions;
