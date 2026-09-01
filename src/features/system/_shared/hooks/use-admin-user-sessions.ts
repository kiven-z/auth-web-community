import { kickUserSession, listUserSessions, type UserSessionIndex } from '@/api/auth/session';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { ref, type MaybeRefOrGetter, toValue } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 管理员查看 / 踢出指定用户的活跃会话
 * @param userId 目标用户 ID
 * @returns 会话列表状态与加载、踢出方法
 */
export function useAdminUserSessions(userId: MaybeRefOrGetter<string>) {
  const { t } = useI18n();
  const loading = ref(false);
  const kickingSessionId = ref<string | null>(null);
  const sessions = ref<UserSessionIndex[]>([]);

  /**
   * 拉取活跃会话列表
   */
  async function loadSessions() {
    const id = toValue(userId);
    if (!id) {
      sessions.value = [];
      return;
    }

    loading.value = true;
    try {
      sessions.value = await listUserSessions(id);
    } catch (error: unknown) {
      errorMessage(error);
      sessions.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 踢出单条会话并刷新列表
   * @param sessionId 会话 ID
   */
  async function kickSession(sessionId: string) {
    const id = toValue(userId);
    if (!id) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    kickingSessionId.value = sessionId;
    try {
      await kickUserSession(id, sessionId);
      message(t('users.session.kickSuccess'), { type: 'success' });
      await loadSessions();
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      kickingSessionId.value = null;
    }
  }

  return {
    loading,
    sessions,
    kickingSessionId,
    loadSessions,
    kickSession,
  };
}
