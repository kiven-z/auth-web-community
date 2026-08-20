import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import {
  deleteFileRecord,
  downloadFileRecord,
  getFileRecordDetail,
  updateFileRecordPrivacy,
} from '@/features/file/api/file-record';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { useFileRecordTableActionCore } from '@/components/domain/file/FileRecordTable';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

type FileRecordTableActionDeps = TableActionWithSelectionDeps;

/**
 * 文件记录表格操作（详情、下载、删除与隐私切换）。
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useFileRecordTableAction(deps: FileRecordTableActionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const privacyUpdateLoading = ref(false);

  const core = useFileRecordTableActionCore({
    ...deps,
    deleteApi: deleteFileRecord,
    downloadApi: downloadFileRecord,
    detailApi: getFileRecordDetail,
  });

  /**
   * 切换文件隐私：工具栏 `updatePrivacyRows(true)` / `updatePrivacyRows(false)`；行内 `updatePrivacyRows(true, [row.id])`。
   * @param isPrivate 目标是否私有
   * @param ids 主键列表；不传或非数组时使用多选行
   */
  const updatePrivacyRows = async (isPrivate: boolean, ids?: unknown): Promise<void> => {
    const targetIds = Array.isArray(ids) ? ids : selectedRows.value;
    if (targetIds.length <= 0 || privacyUpdateLoading.value) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    privacyUpdateLoading.value = true;
    try {
      await updateFileRecordPrivacy(targetIds, isPrivate);
      message(t('fileRecord.messages.privacyUpdateSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      privacyUpdateLoading.value = false;
    }
  };

  return {
    ...core,
    updatePrivacyRows,
    privacyUpdateLoading,
  };
}

export default useFileRecordTableAction;
