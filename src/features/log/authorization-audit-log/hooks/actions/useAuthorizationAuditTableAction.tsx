import type { TableActionWithSelectionDeps } from '@/shared/types/tableAction';
import {
  type AuthorizationAuditPageRow,
  deleteAuthorizationAudit,
  getAuthorizationAuditDetail,
} from '@/features/log/api/authorizationAudit';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import useAuthorizationAuditDetailColumns from '@/features/log/authorization-audit-log/hooks/columns/useAuthorizationAuditDetailColumns';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

/**
 * 权限决策审计日志表格操作
 * @param deps 选中行与刷新回调
 * @returns 批量删除与打开详情
 */
function useAuthorizationAuditTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useAuthorizationAuditDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteAuthorizationAudit,
    onSuccess: fetchTableData,
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: AuthorizationAuditPageRow) => {
    try {
      const detailData = await getAuthorizationAuditDetail(row.id);

      addDialog({
        title: t('authorizationAudit.detailTitle'),
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

export default useAuthorizationAuditTableAction;
