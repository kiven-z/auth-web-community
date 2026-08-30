import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import { deleteOperationLog, getOperationLogDetail, type OperationLogPageRow } from '@/features/log/api/operation-log';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import useOperationLogDetailColumns from '@/features/log/operation-log/hooks/useOperationLogDetailColumns';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

/**
 * 操作日志表格操作
 * @param deps 选中行与刷新回调
 * @returns 批量删除与打开详情
 */
function useOperationLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useOperationLogDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteOperationLog,
    onSuccess: fetchTableData,
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: OperationLogPageRow) => {
    try {
      const detailData = await getOperationLogDetail(row.id);

      addDialog({
        title: t('operationLog.detailTitle'),
        width: '100%',
        fullscreenIcon: true,
        draggable: false,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detailData ?? {}} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
      return;
    }
  });

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useOperationLogTableAction;
