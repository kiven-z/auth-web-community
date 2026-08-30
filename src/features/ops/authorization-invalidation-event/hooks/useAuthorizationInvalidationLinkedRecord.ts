import {
  getAuthorizationInvalidationOutboxDetail,
  getAuthorizationInvalidationOutboxPage,
} from '@/features/ops/api/authorizationInvalidationOutbox';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage, message } from '@/services/feedback/message';
import AuthorizationInvalidationOutboxDetailDialog from '@/features/ops/_shared/components/AuthorizationInvalidationOutboxDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效运维：按 eventId 打开关联 Outbox 详情
 * @returns 关联记录跳转方法
 */
function useAuthorizationInvalidationLinkedRecord() {
  const { t } = useI18n();

  /**
   * 按 eventId 打开 Outbox 详情
   * @param eventId 业务事件 ID
   */
  const openLinkedOutboxByEventId = async (eventId: string) => {
    try {
      const page = await getAuthorizationInvalidationOutboxPage({
        eventId,
        pageIndex: 1,
        pageSize: 1,
      });
      const row = page.list?.[0];
      if (!row?.id) {
        message(t('authorizationInvalidation.linkedOutboxNotFound'), { type: 'warning' });
        return;
      }
      const detail = await getAuthorizationInvalidationOutboxDetail(row.id);
      addDialog({
        title: t('authorizationInvalidation.outboxDetailTitle'),
        width: '100%',
        fullscreenIcon: true,
        draggable: false,
        hideFooter: true,
        contentRenderer: () => h(AuthorizationInvalidationOutboxDetailDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openLinkedOutboxByEventId,
  };
}

export default useAuthorizationInvalidationLinkedRecord;
