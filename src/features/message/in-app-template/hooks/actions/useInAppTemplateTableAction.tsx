import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import {
  createInAppTemplate,
  type InAppTemplateFormModel,
  updateInAppTemplate,
} from '@/features/message/api/in-app-template';
import {
  batchDeleteMessageTemplates,
  batchUpdateMessageTemplateStatus,
  getMessageTemplateById,
  type MessageTemplatePageRow,
} from '@/features/message/api/message-template';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/Overlay';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import MessageTemplateDetailView from '@/features/message/_shared/components/MessageTemplateDetailView.vue';
import InAppTemplateDrawer from '@/features/message/in-app-template/components/InAppTemplateDrawer.vue';
import { IN_APP_TEMPLATE_CHANNEL } from '@/features/message/_shared/constants/channel';
import useInAppTemplateDetailColumns from '@/features/message/_shared/columns/useInAppTemplateDetailColumns';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信模板表格操作
 * @param deps 表格操作依赖（含多选）
 * @returns 表格操作方法
 */
function useInAppTemplateTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const { detailColumns } = useInAppTemplateDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: (ids) => batchDeleteMessageTemplates(ids, IN_APP_TEMPLATE_CHANNEL),
    onSuccess: fetchTableData,
  });

  /**
   * 打开新增抽屉
   */
  const openCreateDrawer = () => {
    const drawerFormRef = ref<FormOverlayExpose<InAppTemplateFormModel> | null>(null);

    addDrawer({
      title: t('inAppTemplate.addDrawerTitle'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () => <InAppTemplateDrawer ref={drawerFormRef} />,
      beforeSure: createFormBeforeSure<InAppTemplateFormModel>({
        formExposeRef: drawerFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formData) => {
          await createInAppTemplate(formData);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开编辑抽屉
   * @param row 表格行数据
   */
  const openEditDrawer = async (row: MessageTemplatePageRow) => {
    try {
      const detail = await getMessageTemplateById(row.id, IN_APP_TEMPLATE_CHANNEL);
      const drawerFormRef = ref<FormOverlayExpose<InAppTemplateFormModel> | null>(null);

      addDrawer({
        title: t('inAppTemplate.editDrawerTitle'),
        size: '100%',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () => <InAppTemplateDrawer ref={drawerFormRef} form={detail as InAppTemplateFormModel} />,
        beforeSure: createFormBeforeSure<InAppTemplateFormModel>({
          formExposeRef: drawerFormRef,
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateInAppTemplate(formPayload);
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
      title: t('inAppTemplate.detailDialogTitle'),
      width: '80%',
      draggable: true,
      fullscreenIcon: true,
      hideFooter: true,
      contentRenderer: () => (
        <MessageTemplateDetailView
          id={row.id}
          channel={IN_APP_TEMPLATE_CHANNEL}
          columns={detailColumns.value}
          contentLabel={t('inAppTemplate.content')}
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
      await batchUpdateMessageTemplateStatus({ ids, status: enabled, channel: IN_APP_TEMPLATE_CHANNEL });
      message(t('tips.editSuccess'), { type: 'success' });

      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDrawer,
    openEditDrawer,
    openDetailDialog,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useInAppTemplateTableAction;
