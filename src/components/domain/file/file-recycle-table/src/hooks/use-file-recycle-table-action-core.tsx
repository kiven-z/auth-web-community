import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import type { FileRecordDetail, FileRecordPageRow } from '@/features/file/api/models/file-record';
import { Description } from '@/components/ui/description';
import { addDialog } from '@/components/ui/dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/batch-delete-action';
import useFileRecycleDetailColumns from './use-file-recycle-detail-columns';
import { useI18n } from 'vue-i18n';

/** 文件回收站表格动作核心配置。 */
interface UseFileRecycleTableActionCoreOptions extends TableActionWithSelectionDeps {
  /** 批量恢复 API。 */
  restoreApi: (ids: string[]) => Promise<void>;
  /** 批量彻底删除 API。 */
  purgeApi: (ids: string[]) => Promise<void>;
  /** 详情查询 API。 */
  detailApi: (id: string) => Promise<FileRecordDetail>;
}

/**
 * 文件回收站表格动作核心逻辑（详情、恢复、彻底删除）。
 * @param options 表格动作依赖与角色 API
 * @returns 详情、恢复与删除相关方法
 */
function useFileRecycleTableActionCore(options: UseFileRecycleTableActionCoreOptions) {
  const { fetchTableData, selectedRows, restoreApi, purgeApi, detailApi } = options;
  const { t } = useI18n();
  const { detailColumns } = useFileRecycleDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: purgeApi,
    onSuccess: fetchTableData,
  });

  /**
   * 打开回收站文件详情弹窗。
   * @param row 回收站分页行
   * @returns 无返回值
   */
  const openDetailDialog = async (row: FileRecordPageRow): Promise<void> => {
    try {
      const detail = await detailApi(row.id);
      addDialog({
        title: t('fileRecycle.dialog.detailTitle'),
        width: '80%',
        draggable: false,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detail} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 批量恢复。
   * @param ids 目标主键列表
   * @returns 无返回值
   */
  const restoreBatchRows = async (ids?: unknown): Promise<void> => {
    const targetIds = Array.isArray(ids) ? ids : selectedRows.value;
    if (targetIds.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await restoreApi(targetIds);
      message(t('fileRecycle.messages.batchRestoreSuccess', { count: targetIds.length }), {
        type: 'success',
      });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openDetailDialog,
    restoreBatchRows,
    deleteBatchRows,
  };
}

export default useFileRecycleTableActionCore;
