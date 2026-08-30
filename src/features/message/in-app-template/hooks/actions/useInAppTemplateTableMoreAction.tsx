import { type MessageTemplatePageRow, testSendMessageTemplate } from '@/features/message/api/message-template';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import { IN_APP_TEMPLATE_CHANNEL } from '@/features/message/_shared/constants/channel';
import InAppTemplateTestSendDialog from '@/features/message/in-app-template/components/InAppTemplateTestSendDialog.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信模板测试发送表单（target 为用户 ID）
 */
interface InAppTemplateTestSendForm {
  id: string;
  target: string;
}

/**
 * 站内信模板表格「更多」菜单相关操作
 * @returns 测试发送方法
 */
export function useInAppTemplateTableMoreAction() {
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开测试发送弹窗（远程选择接收用户）
   * @param row 站内信模板行数据
   */
  const openTestSend = (row: MessageTemplatePageRow) => {
    const sendFormRef = ref<FormOverlayExpose<InAppTemplateTestSendForm> | null>(null);

    addDialog({
      title: t('inAppTemplate.testSendDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => <InAppTemplateTestSendDialog ref={sendFormRef} form={{ id: row.id, target: '' }} />,
      beforeSure: createFormBeforeSure<InAppTemplateTestSendForm>({
        formExposeRef: sendFormRef,
        successI18nKey: 'tips.operationSuccess',
        requireId: true,
        onSubmit: async (formData) => {
          await testSendMessageTemplate({
            id: formData.id,
            channel: IN_APP_TEMPLATE_CHANNEL,
            target: formData.target,
          });
        },
      }),
    });
  };

  return {
    openTestSend,
  };
}
