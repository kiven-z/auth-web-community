import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import { deleteLoginLog, getLoginLogDetail, type LoginLogPageRow } from '@/features/log/api/login-log';
import { Description } from '@/components/ui/description';
import { addDialog } from '@/components/ui/dialog';
import { errorMessage } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/batch-delete-action';
import useLoginLogDetailColumns from '@/features/log/login-log/hooks/use-login-log-detail-columns';
import { useI18n } from 'vue-i18n';

/**
 * 登录日志表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useLoginLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useLoginLogDetailColumns();
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteLoginLog,
    onSuccess: fetchTableData,
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: LoginLogPageRow) => {
    try {
      const detailData = await getLoginLogDetail(row.id);

      addDialog({
        title: t('loginLog.title.detail'),
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

export default useLoginLogTableAction;
