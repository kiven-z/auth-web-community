import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import {
  deletePasswordHistory,
  getPasswordHistoryDetail,
  type PasswordHistoryPageRow,
} from '@/features/log/api/password-history';
import { Description } from '@/components/ui/description';
import { addDialog } from '@/components/ui/dialog';
import { errorMessage } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/batch-delete-action';
import usePasswordHistoryDetailColumns from '@/features/log/password-history/hooks/use-password-history-detail-columns';
import { useI18n } from 'vue-i18n';

/**
 * 密码历史日志表格操作
 * @param deps 选中行与刷新回调
 * @returns 批量删除与打开详情
 */
function usePasswordHistoryTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = usePasswordHistoryDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deletePasswordHistory,
    onSuccess: fetchTableData,
  });

  /**
   * 打开密码历史日志详情对话框
   * @param row 密码历史日志数据
   */
  const openDetailDialog = async (row: PasswordHistoryPageRow) => {
    try {
      const detailData = await getPasswordHistoryDetail(row.id);

      addDialog({
        title: t('passwordHistory.detailTitle'),
        width: '100%',
        draggable: false,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detailData ?? {}} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
      return;
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default usePasswordHistoryTableAction;
