import type { TableActionWithSelectionDeps } from '@/shared/types/tableAction';
import {
  createEmailTemplate,
  type EmailTemplateFormModel,
  type EmailTemplatePageRow,
  updateEmailTemplate,
} from '@/features/message/api/emailTemplate';
import {
  batchDeleteMessageTemplates,
  batchUpdateMessageTemplateStatus,
  getMessageTemplateById,
} from '@/features/message/api/messageTemplate';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import MessageTemplateDetailView from '@/features/message/_shared/components/MessageTemplateDetailView.vue';
import EmailTemplateDrawer from '@/features/message/email-template/components/EmailTemplateDrawer.vue';
import { EMAIL_TEMPLATE_CHANNEL } from '@/features/message/_shared/constants/channel';
import useEmailTemplateDetailColumns from '@/features/message/email-template/hooks/columns/useEmailTemplateDetailColumns';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 邮件模板表格操作：弹窗与写接口
 * @param deps 选中行与刷新回调
 * @returns 增删改、详情与批量启停
 */
function useEmailTemplateTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useEmailTemplateDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: (ids) => batchDeleteMessageTemplates(ids, EMAIL_TEMPLATE_CHANNEL),
    onSuccess: fetchTableData,
  });

  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<EmailTemplateFormModel> | null>(null);

    addDrawer({
      title: t('emailTemplate.addDialogTitle'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () => <EmailTemplateDrawer ref={dialogFormRef} />,
      beforeSure: createFormBeforeSure<EmailTemplateFormModel>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formData) => {
          await createEmailTemplate(formData);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行数据
   */
  const openEditDialog = async (row: EmailTemplatePageRow) => {
    try {
      const detail = await getMessageTemplateById(row.id, EMAIL_TEMPLATE_CHANNEL);
      const dialogFormRef = ref<FormOverlayExpose<EmailTemplateFormModel> | null>(null);

      addDrawer({
        title: t('emailTemplate.editDialogTitle'),
        size: '100%',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () => (
          <EmailTemplateDrawer
            ref={dialogFormRef}
            form={detail as EmailTemplateFormModel}
            requireFields={detail.requireFields ?? []}
          />
        ),
        beforeSure: createFormBeforeSure<EmailTemplateFormModel>({
          formExposeRef: dialogFormRef,
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateEmailTemplate(formPayload);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开详情弹窗
   * @param row 表格行数据
   */
  const openDetailDialog = (row: EmailTemplatePageRow) => {
    addDialog({
      title: t('emailTemplate.detailDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      hideFooter: true,
      contentRenderer: () => (
        <MessageTemplateDetailView
          id={row.id}
          channel={EMAIL_TEMPLATE_CHANNEL}
          columns={detailColumns.value}
          contentLabel={t('emailTemplate.content')}
        />
      ),
    });
  };

  /**
   * 批量启用或停用当前多选行
   * @param enabled 是否启用
   */
  const batchUpdateStatus = async (enabled: boolean) => {
    const ids = selectedRows.value;
    if (ids.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await batchUpdateMessageTemplateStatus({
        ids,
        status: enabled,
        channel: EMAIL_TEMPLATE_CHANNEL,
      });
      message(t('tips.editSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useEmailTemplateTableAction;
