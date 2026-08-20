import type { MessageChannelCode } from '@/features/message/api/models/message-template';
import { testSendMessageTemplate } from '@/features/message/api/message-template';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import MessageTemplateTestSendDialog from '@/features/message/_shared/components/MessageTemplateTestSendDialog.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 测试发送表单（与弹窗字段一致；target 语义由渠道解释）
 */
interface MessageTemplateTestSendForm {
  id: string;
  target: string;
}

/**
 * 打开消息模板测试发送弹窗的参数
 */
export interface OpenMessageTemplateTestSendOptions {
  /** 模板主键 */
  id: string;
  /** 消息渠道 */
  channel: MessageChannelCode;
  /** 接收目标字段 label i18n key */
  targetLabelI18nKey?: string;
  /** 接收目标 placeholder i18n key */
  targetPlaceholderI18nKey?: string;
}

/**
 * 打开消息模板测试发送弹窗
 */
export function useOpenMessageTemplateTestSend() {
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开测试发送弹窗
   * @param options 打开参数
   */
  const openTestSend = (options: OpenMessageTemplateTestSendOptions) => {
    const {
      id,
      channel,
      targetLabelI18nKey = 'messageTemplate.testSendTarget',
      targetPlaceholderI18nKey = 'messageTemplate.placeholder.testSendTarget',
    } = options;

    const sendFormRef = ref<FormOverlayExpose<MessageTemplateTestSendForm> | null>(null);

    addDialog({
      title: t('messageTemplate.testSendDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      focusOnOpen: true,
      contentRenderer: () => (
        <MessageTemplateTestSendDialog
          ref={sendFormRef}
          form={{ id, target: '' }}
          targetLabelI18nKey={targetLabelI18nKey}
          targetPlaceholderI18nKey={targetPlaceholderI18nKey}
        />
      ),
      beforeSure: createFormBeforeSure<MessageTemplateTestSendForm>({
        formExposeRef: sendFormRef,
        successI18nKey: 'tips.operationSuccess',
        requireId: true,
        onSubmit: async (formData) => {
          await testSendMessageTemplate({ id: formData.id, channel, target: formData.target });
        },
      }),
    });
  };

  return { openTestSend };
}
