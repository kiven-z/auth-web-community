import useBatchDeleteAction from '@/components/table/batch-delete-action';
import {
  batchDeleteInAppInbox,
  deleteAllInAppInbox,
  markAllInAppInboxRead,
  markInAppInboxRead,
} from '@/features/message/api/in-app-inbox';
import { deleteConfirm, multiConfirm, operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import { useInAppInboxStore } from '@/store/modules/message/in-app-inbox';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 收件箱表格写操作依赖 */
interface InboxTableActionDeps extends TableActionWithSelectionDeps {
  /** 当前大类 ID（Tab）；全部已读 / 全部删除必填 */
  majorCategoryId: Ref<string | undefined>;
}

/**
 * 我的消息（收件箱）表格写操作
 * @param deps 表格操作依赖
 * @returns 删除、标已读及全部操作方法
 */
function useInboxTableAction(deps: InboxTableActionDeps) {
  const { fetchTableData, selectedRows, majorCategoryId } = deps;
  const { t } = useI18n();
  const inboxStore = useInAppInboxStore();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: batchDeleteInAppInbox,
    onSuccess: async () => {
      await Promise.all([fetchTableData(), inboxStore.refreshUnreadCount()]);
    },
  });

  /**
   * 批量标已读
   * @param ids 主键列表；不传则使用当前多选
   */
  async function markReadBatchRows(ids?: unknown) {
    const targetIds = Array.isArray(ids) ? (ids as string[]) : selectedRows.value;
    if (targetIds.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await markInAppInboxRead(targetIds);
      message(t('tips.operationSuccess'), { type: 'success' });
      selectedRows.value = [];
      await Promise.all([fetchTableData(), inboxStore.refreshUnreadCount()]);
    } catch (error: unknown) {
      errorMessage(error);
    }
  }

  /**
   * 当前大类全部已读
   */
  async function markAllRead() {
    const currentMajorCategoryId = majorCategoryId.value;
    if (!currentMajorCategoryId) {
      return;
    }

    const confirmed = await multiConfirm([
      {
        title: t('inAppInbox.action.markAllRead'),
        message: t('inAppInbox.confirm.markAllRead'),
      },
    ]);
    if (!confirmed) {
      return;
    }

    try {
      await markAllInAppInboxRead(currentMajorCategoryId);
      message(t('tips.operationSuccess'), { type: 'success' });
      selectedRows.value = [];
      await Promise.all([fetchTableData(), inboxStore.refreshUnreadCount()]);
    } catch (error: unknown) {
      errorMessage(error);
    }
  }

  /**
   * 当前大类全部删除
   */
  async function deleteAll() {
    const currentMajorCategoryId = majorCategoryId.value;
    if (!currentMajorCategoryId) {
      return;
    }

    const confirmed = await deleteConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await deleteAllInAppInbox(currentMajorCategoryId);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await Promise.all([fetchTableData(), inboxStore.refreshUnreadCount()]);
    } catch (error: unknown) {
      errorMessage(error);
    }
  }

  return {
    deleteBatchRows,
    markReadBatchRows,
    markAllRead,
    deleteAll,
  };
}

export default useInboxTableAction;
