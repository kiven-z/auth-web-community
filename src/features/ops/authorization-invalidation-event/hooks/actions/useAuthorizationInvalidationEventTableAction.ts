import {
  type AuthorizationInvalidationEventPageRow,
  getAuthorizationInvalidationEventDetail,
  releaseAuthorizationInvalidationEventClaim,
} from '@/features/ops/api/authorizationInvalidationEvent';
import { addDialog } from '@/components/ui/Dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import AuthorizationInvalidationEventDetailDialog from '@/features/ops/authorization-invalidation-event/components/AuthorizationInvalidationEventDetailDialog.vue';
import { useDebounceFn } from '@vueuse/core';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/** Event 表格操作依赖 */
export interface AuthorizationInvalidationEventTableActionDeps {
  /** 释放占位成功后刷新列表 */
  fetchTableData: () => Promise<void>;
}

/**
 * 授权失效幂等事件表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useAuthorizationInvalidationEventTableAction(deps: AuthorizationInvalidationEventTableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: AuthorizationInvalidationEventPageRow) => {
    try {
      const detailData = await getAuthorizationInvalidationEventDetail(row.id);

      addDialog({
        title: t('authorizationInvalidation.detailTitle'),
        width: '100%',
        fullscreenIcon: true,
        draggable: false,
        hideFooter: true,
        contentRenderer: () => h(AuthorizationInvalidationEventDetailDialog, { data: detailData }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  });

  /**
   * 释放 processing 占位
   * @param row 行数据
   */
  const releaseClaimRow = useDebounceFn(async (row: AuthorizationInvalidationEventPageRow) => {
    if (!row.processing) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await releaseAuthorizationInvalidationEventClaim(row.id);
      message(t('authorizationInvalidation.releaseClaimSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  });

  return {
    openDetailDialog,
    releaseClaimRow,
  };
}

export default useAuthorizationInvalidationEventTableAction;
