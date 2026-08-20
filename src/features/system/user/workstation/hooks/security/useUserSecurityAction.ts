import { kickAllUserSessions } from '@/api/auth/session';
import { refreshUserAuthorization } from '@/features/system/api/user/user';
import type { KickAllForUserOptions } from '@/features/system/_shared/types';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { useI18n } from 'vue-i18n';

/**
 * 用户工作台账号安全操作：踢下线、刷新授权
 * @returns 安全操作方法
 */
function useUserSecurityAction() {
  const { t } = useI18n();

  /**
   * 踢出指定用户的全部会话
   * @param userId 用户 ID
   * @param kickOptions 单次调用配置
   */
  async function kickAllForUser(userId: string, kickOptions?: KickAllForUserOptions) {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await kickAllUserSessions(userId);
      message(t(kickOptions?.successI18nKey ?? 'users.kick.success'), { type: 'success' });
      await kickOptions?.onSuccess?.();
    } catch (error: unknown) {
      errorMessage(error);
    }
  }

  /**
   * 刷新指定用户的授权画像缓存
   * @param userId 目标用户主键
   * @returns 是否实际触发了刷新
   */
  async function refreshUserAuth(userId: string): Promise<boolean> {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return false;
    }

    try {
      await refreshUserAuthorization([userId]);
      message(t('users.authRefresh.success'), { type: 'success' });
      return true;
    } catch (error: unknown) {
      errorMessage(error);
      return false;
    }
  }

  return {
    kickAllForUser,
    refreshUserAuth,
  };
}

export default useUserSecurityAction;
