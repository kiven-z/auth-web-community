import type { TableActionWithSelectionDeps } from '@/shared/types/tableAction';
import { deleteJobLog, getJobLogDetail, type JobLogPageRow } from '@/features/log/api/jobLog';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import useJobLogDetailColumns from '@/features/schedule/schedule-log/hooks/columns/useJobLogDetailColumns';
import { useI18n } from 'vue-i18n';

/**
 * 任务调度日志表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useJobLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useJobLogDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteJobLog,
    onSuccess: fetchTableData,
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: JobLogPageRow) => {
    try {
      const detailData = await getJobLogDetail(row.id);

      addDialog({
        title: t('logJob.title.detail'),
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

export default useJobLogTableAction;
