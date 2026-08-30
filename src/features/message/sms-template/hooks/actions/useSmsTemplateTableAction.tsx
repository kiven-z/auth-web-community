import type { TableActionWithSelectionDeps } from '@/shared/types/tableAction';
import {
  batchDeleteMessageTemplates,
  batchUpdateMessageTemplateStatus,
  getMessageTemplateById,
  type MessageTemplatePageRow,
} from '@/features/message/api/messageTemplate';
import { createSmsTemplate, type SmsTemplateFormModel, updateSmsTemplate } from '@/features/message/api/smsTemplate';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import MessageTemplateDetailView from '@/features/message/_shared/components/MessageTemplateDetailView.vue';
import SmsTemplateDialog from '@/features/message/sms-template/components/SmsTemplateDialog.vue';
import { SMS_TEMPLATE_CHANNEL } from '@/features/message/_shared/constants/channel';
import useSmsTemplateDetailColumns from '@/features/message/sms-template/hooks/columns/useSmsTemplateDetailColumns';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 短信模板表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useSmsTemplateTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const { detailColumns } = useSmsTemplateDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: (ids) => batchDeleteMessageTemplates(ids, SMS_TEMPLATE_CHANNEL),
    onSuccess: fetchTableData,
  });

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SmsTemplateFormModel> | null>(null);

    addDialog({
      title: t('smsTemplate.addDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => <SmsTemplateDialog ref={dialogFormRef} />,
      beforeSure: createFormBeforeSure<SmsTemplateFormModel>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formData) => {
          await createSmsTemplate(formData);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行数据
   */
  const openEditDialog = async (row: MessageTemplatePageRow) => {
    try {
      const detail = await getMessageTemplateById(row.id, SMS_TEMPLATE_CHANNEL);
      const dialogFormRef = ref<FormOverlayExpose<SmsTemplateFormModel> | null>(null);

      addDialog({
        title: t('smsTemplate.editDialogTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => <SmsTemplateDialog ref={dialogFormRef} form={detail} />,
        beforeSure: createFormBeforeSure<SmsTemplateFormModel>({
          formExposeRef: dialogFormRef,
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateSmsTemplate(formPayload);
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
  const openDetailDialog = (row: MessageTemplatePageRow) => {
    addDialog({
      title: t('smsTemplate.detailDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      hideFooter: true,
      contentRenderer: () => (
        <MessageTemplateDetailView
          id={row.id}
          channel={SMS_TEMPLATE_CHANNEL}
          columns={detailColumns.value}
          contentLabel={t('smsTemplate.content')}
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
        channel: SMS_TEMPLATE_CHANNEL,
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

export default useSmsTemplateTableAction;
