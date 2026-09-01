import type { OnlineUserPageRow } from '@/api/auth/online-user';
import { kickAllUserSessions } from '@/api/auth/session';
import { addDialog } from '@/components/ui/dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import UserSessionDialog from '@/features/system/online-user/components/UserSessionDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface OnlineUserTableActionDeps {
  /** 踢人后刷新列表 */
  fetchTableData: () => Promise<void>;
}

/**
 * 在线用户表格操作：查看会话、踢出全部会话
 * @param deps 操作依赖
 * @returns 表格操作方法
 */
function useOnlineUserTableAction(deps: OnlineUserTableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const kickingUserId = ref<string | null>(null);

  /**
   * 踢出用户全部会话
   * @param userId 用户 ID
   */
  async function kickAllForUser(userId: string) {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await kickAllUserSessions(userId);
      message(t('onlineUser.message.kickAllSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  }

  /**
   * 打开查看会话弹窗
   * @param row 在线用户行
   */
  function openViewSessionsDialog(row: OnlineUserPageRow) {
    const userId = row.userId;
    if (!userId) {
      return;
    }

    addDialog({
      title: t('onlineUser.action.viewSessions'),
      draggable: false,
      hideFooter: true,
      contentRenderer: () =>
        h(UserSessionDialog, {
          userId,
          username: row.username ?? '',
          kickAllForUser: async (id: string, kickOptions?: { onSuccess?: () => Promise<void> }) => {
            await kickAllForUser(id);
            await kickOptions?.onSuccess?.();
          },
        }),
    });
  }

  /**
   * 踢出该用户全部会话
   * @param row 在线用户行
   */
  async function kickAllSessionsRow(row: OnlineUserPageRow) {
    const userId = row.userId;
    if (!userId) {
      return;
    }

    kickingUserId.value = userId;
    try {
      await kickAllForUser(userId);
    } finally {
      kickingUserId.value = null;
    }
  }

  return {
    kickingUserId,
    openViewSessionsDialog,
    kickAllSessionsRow,
  };
}

export default useOnlineUserTableAction;
