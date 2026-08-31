import { AUTH_RECOVERY_RULE_IDS } from '@/core/auth/recovery/ruleIds';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { messageMock } = vi.hoisted(() => ({
  messageMock: vi.fn(),
}));

vi.mock('@/services/feedback/message', () => ({
  message: messageMock,
}));

vi.mock('@/app/plugins/i18n', () => ({
  transformI18n: (key: string) => {
    const messages: Record<string, string> = {
      'tips.tokenExpiredRefreshRetry': '访问令牌过期或失效，若尝试刷新失败，请重新登录后重试',
      'tips.permissionMismatchRefreshRetry': '权限已更新，若刷新失败，请重新登录后重试',
    };
    return messages[key] ?? key;
  },
}));

describe('runAuthRecoverySideEffect', () => {
  beforeEach(() => {
    messageMock.mockReset();
  });

  it('shows warning toast when token expired rule matches', async () => {
    const { runAuthRecoverySideEffect } = await import('@/core/auth/recovery/sideEffects');

    runAuthRecoverySideEffect(AUTH_RECOVERY_RULE_IDS.TOKEN_EXPIRED_REFRESH);

    expect(messageMock).toHaveBeenCalledTimes(1);
    expect(messageMock).toHaveBeenCalledWith(
      '访问令牌过期或失效，若尝试刷新失败，请重新登录后重试',
      expect.objectContaining({ type: 'warning', grouping: true, showClose: true })
    );
  });

  it('shows warning toast on permission mismatch', async () => {
    const { runAuthRecoverySideEffect } = await import('@/core/auth/recovery/sideEffects');

    runAuthRecoverySideEffect(AUTH_RECOVERY_RULE_IDS.PERMISSION_MISMATCH_REFRESH);

    expect(messageMock).toHaveBeenCalledTimes(1);
    expect(messageMock).toHaveBeenCalledWith(
      '权限已更新，若刷新失败，请重新登录后重试',
      expect.objectContaining({ type: 'warning', grouping: true, showClose: true })
    );
  });

  it('does nothing for rules without configured side effects', async () => {
    const { runAuthRecoverySideEffect } = await import('@/core/auth/recovery/sideEffects');

    runAuthRecoverySideEffect(AUTH_RECOVERY_RULE_IDS.UNKNOWN_401_LOGOUT);

    expect(messageMock).not.toHaveBeenCalled();
  });
});
