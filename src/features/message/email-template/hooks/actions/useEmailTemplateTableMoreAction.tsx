import type { TableActionDeps } from '@/shared/types/tableAction';
import {
  type EmailTemplateMonacoFormModel,
  type EmailTemplatePageRow,
  updateEmailTemplateContent,
} from '@/features/message/api/emailTemplate';
import { getMessageTemplateById } from '@/features/message/api/messageTemplate';
import { addDrawer } from '@/components/ui/Drawer';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import { errorMessage } from '@/services/feedback/message';
import EmailTemplateMonacoOnlyDrawer from '@/features/message/email-template/components/EmailTemplateMonacoOnlyDrawer.vue';
import { EMAIL_TEMPLATE_CHANNEL } from '@/features/message/_shared/constants/channel';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 邮件模板表格「更多」菜单相关操作
 * @param options 表格操作依赖
 * @returns 更多操作方法
 */
export function useEmailTemplateTableMoreAction(options: TableActionDeps) {
  const { fetchTableData } = options;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开 Monaco 正文编辑弹窗
   * @param row 邮件模板行数据
   */
  const openTemplateContentEdit = async (row: EmailTemplatePageRow) => {
    try {
      const detail = await getMessageTemplateById(row.id, EMAIL_TEMPLATE_CHANNEL);
      const dialogFormRef = ref<FormOverlayExpose<EmailTemplateMonacoFormModel> | null>(null);

      addDrawer({
        title: t('emailTemplate.templateEditDialogTitle'),
        size: '100%',
        direction: 'rtl',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () => (
          <EmailTemplateMonacoOnlyDrawer ref={dialogFormRef} form={detail as EmailTemplateMonacoFormModel} />
        ),
        beforeSure: createFormBeforeSure<EmailTemplateMonacoFormModel>({
          formExposeRef: dialogFormRef,
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateEmailTemplateContent({ id: formPayload.id, content: formPayload.content ?? '' });
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openTemplateContentEdit,
  };
}
