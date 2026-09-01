import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import {
  batchDeleteChannelDeliveries,
  type ChannelDeliveryPageRow,
  getChannelDeliveryById,
} from '@/features/message/api/channel-delivery';
import { Description } from '@/components/ui/description';
import { addDialog } from '@/components/ui/dialog';
import { errorMessage } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/batch-delete-action';
import useSendRecordDetailColumns from '@/features/message/send-record/hooks/columns/use-send-record-detail-columns';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

/**
 * 发送记录表格操作（详情 / 批量删除）
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useSendRecordTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useSendRecordDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: batchDeleteChannelDeliveries,
    onSuccess: fetchTableData,
  });

  /**
   * 打开列表行详情
   * @param row 分页行
   */
  const openDetailDialog = useDebounceFn(async (row: ChannelDeliveryPageRow) => {
    try {
      const detailData = await getChannelDeliveryById(row.id);

      addDialog({
        title: t('sendRecord.title.detail'),
        draggable: false,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detailData ?? {}} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  });

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useSendRecordTableAction;
