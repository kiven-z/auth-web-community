import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import {
  batchDeleteInAppSendTasks,
  type InAppSendTaskPageRow,
  recallInAppSendTask,
  retryInAppSendTask,
} from '@/features/message/api/in-app-message';
import { addDialog } from '@/components/ui/dialog';
import { addDrawer } from '@/components/ui/drawer';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/batch-delete-action';
import InAppSendTaskDetailView from '@/features/message/_shared/components/InAppSendTaskDetailView.vue';
import useInAppMessageDetailColumns from '@/features/message/_shared/columns/use-in-app-message-detail-columns';
import InAppSendTaskRecipientDrawer from '@/features/message/in-app-message/components/InAppSendTaskRecipientDrawer.vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信发送任务表格操作
 * @param deps 表格操作依赖（含多选）
 * @returns 表格操作方法
 */
function useInAppMessageTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useInAppMessageDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: batchDeleteInAppSendTasks,
    onSuccess: fetchTableData,
  });

  /**
   * 打开列表行详情
   * @param row 分页行
   */
  const openDetailDialog = (row: InAppSendTaskPageRow) => {
    addDialog({
      title: t('inAppMessage.title.detail'),
      draggable: true,
      fullscreenIcon: true,
      hideFooter: true,
      contentRenderer: () => (
        <InAppSendTaskDetailView
          taskId={row.id}
          columns={detailColumns.value}
          contentLabel={t('inAppMessage.field.content')}
        />
      ),
    });
  };

  /**
   * 打开任务收件人/互动明细抽屉
   * @param row 分页行
   */
  const openRecipientsDrawer = (row: InAppSendTaskPageRow) => {
    addDrawer({
      title: t('inAppMessage.title.recipients'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => (
        <InAppSendTaskRecipientDrawer taskId={row.id} title={row.title} recipientScopeType={row.recipientScopeType} />
      ),
    });
  };

  /**
   * 补发列表行对应的发送任务
   * @param row 分页行
   */
  const retryTask = async (row: InAppSendTaskPageRow) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await retryInAppSendTask(row.id);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 撤回列表行对应的发送任务
   * @param row 分页行
   */
  const recallTask = async (row: InAppSendTaskPageRow) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await recallInAppSendTask(row.id);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openDetailDialog,
    openRecipientsDrawer,
    retryTask,
    recallTask,
    deleteBatchRows,
  };
}

export default useInAppMessageTableAction;
