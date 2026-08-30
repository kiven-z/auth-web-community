import {
  type AuthorizationInvalidationOutboxPageRow,
  getAuthorizationInvalidationOutboxDetail,
  retryAuthorizationInvalidationOutbox,
} from '@/features/ops/api/authorizationInvalidationOutbox';
import { addDialog } from '@/components/ui/Dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import AuthorizationInvalidationOutboxDetailDialog from '@/features/ops/_shared/components/AuthorizationInvalidationOutboxDetailDialog.vue';
import { isOutboxRetryable } from '@/features/ops/authorization-invalidation-outbox/constants/outboxStatus';
import { useDebounceFn } from '@vueuse/core';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/** Outbox 表格操作依赖 */
export interface AuthorizationInvalidationOutboxTableActionDeps {
  /** 重试成功后刷新列表 */
  fetchTableData: () => Promise<void>;
}

/**
 * 授权失效 Outbox 表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useAuthorizationInvalidationOutboxTableAction(deps: AuthorizationInvalidationOutboxTableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: AuthorizationInvalidationOutboxPageRow) => {
    try {
      const detailData = await getAuthorizationInvalidationOutboxDetail(row.id);

      addDialog({
        title: t('authorizationInvalidation.outboxDetailTitle'),
        width: '100%',
        fullscreenIcon: true,
        draggable: false,
        hideFooter: true,
        contentRenderer: () => h(AuthorizationInvalidationOutboxDetailDialog, { data: detailData }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  });

  /**
   * 人工重试投递
   * @param row 行数据
   */
  const retryOutboxRow = useDebounceFn(async (row: AuthorizationInvalidationOutboxPageRow) => {
    if (!isOutboxRetryable(row.status)) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      const result = await retryAuthorizationInvalidationOutbox(row.id, {
        force: row.status === 'PROCESSING',
      });
      if (result.dispatched) {
        message(t('authorizationInvalidation.retrySuccess'), { type: 'success' });
      } else {
        message(t('authorizationInvalidation.retryFailed'), { type: 'warning' });
      }
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  });

  return {
    openDetailDialog,
    retryOutboxRow,
  };
}

export default useAuthorizationInvalidationOutboxTableAction;
