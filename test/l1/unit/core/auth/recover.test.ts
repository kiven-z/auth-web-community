import { recoverAuthFailure } from '@/core/auth/recover';
import type { AuthHttpRequestConfig } from '@/core/http/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { replayRequestWithRefreshedTokenMock, messageMock } = vi.hoisted(() => ({
  replayRequestWithRefreshedTokenMock: vi.fn(),
  messageMock: vi.fn(),
}));

vi.mock('@/core/auth/access-token-refresh', () => ({
  replayRequestWithRefreshedToken: replayRequestWithRefreshedTokenMock,
}));

vi.mock('@/services/feedback/message', () => ({
  message: messageMock,
}));

vi.mock('@/app/plugins/i18n', () => ({
  transformI18n: (key: string) => key,
}));

const instance = { request: vi.fn() } as any;

describe('recoverAuthFailure', () => {
  beforeEach(() => {
    replayRequestWithRefreshedTokenMock.mockReset();
    messageMock.mockReset();
  });

  it('replays when token expired', async () => {
    replayRequestWithRefreshedTokenMock.mockResolvedValue({ data: { ok: true } });
    const requestConfig: AuthHttpRequestConfig = { url: 'system/user/page', headers: {} };

    const result = await recoverAuthFailure({
      instance,
      requestConfig,
      status: 401,
      errorCode: 'TOKEN_EXPIRED',
    });

    expect(result).toEqual({ kind: 'replay', replayResult: { data: { ok: true } } });
    expect(requestConfig._authRecoveryRetryCount).toBe(1);
    expect(messageMock).toHaveBeenCalledWith(
      'tips.tokenExpiredRefreshRetry',
      expect.objectContaining({ type: 'warning', grouping: true })
    );
  });

  it('replays when session missing', async () => {
    replayRequestWithRefreshedTokenMock.mockResolvedValue({ data: { ok: true } });

    const result = await recoverAuthFailure({
      instance,
      requestConfig: { url: 'system/user/page' },
      status: 401,
      errorCode: 'SESSION_MISSING',
    });

    expect(result.kind).toBe('replay');
  });

  it('logs out when expired refresh replay fails', async () => {
    replayRequestWithRefreshedTokenMock.mockRejectedValue(new Error('refresh failed'));

    const result = await recoverAuthFailure({
      instance,
      requestConfig: { url: 'system/user/page' },
      status: 401,
      errorCode: 'TOKEN_EXPIRED',
    });

    expect(result.kind).toBe('logout');
    expect(result).toMatchObject({ replayError: expect.any(Error) });
  });

  it('logs out when expired replay is already exhausted', async () => {
    const result = await recoverAuthFailure({
      instance,
      requestConfig: { url: 'system/user/page', _authRecoveryRetryCount: 1 },
      status: 401,
      errorCode: 'TOKEN_EXPIRED',
    });

    expect(result).toEqual({ kind: 'logout' });
    expect(replayRequestWithRefreshedTokenMock).not.toHaveBeenCalled();
    expect(messageMock).not.toHaveBeenCalled();
  });

  it('logs out on other 401', async () => {
    const result = await recoverAuthFailure({
      instance,
      requestConfig: { url: 'system/user/page' },
      status: 401,
      errorCode: 'TOKEN_INVALID',
    });

    expect(result).toEqual({ kind: 'logout' });
    expect(replayRequestWithRefreshedTokenMock).not.toHaveBeenCalled();
  });

  it('replays on permission version mismatch', async () => {
    replayRequestWithRefreshedTokenMock.mockResolvedValue({ data: { ok: true } });

    const result = await recoverAuthFailure({
      instance,
      requestConfig: { url: 'system/user/page' },
      status: 409,
      errorCode: 'PERMISSION_VERSION_MISMATCH',
    });

    expect(result).toEqual({ kind: 'replay', replayResult: { data: { ok: true } } });
    expect(messageMock).toHaveBeenCalledWith(
      'tips.permissionMismatchRefreshRetry',
      expect.objectContaining({ type: 'warning', grouping: true })
    );
  });

  it('passes through when permission mismatch refresh fails', async () => {
    replayRequestWithRefreshedTokenMock.mockRejectedValue(new Error('refresh failed'));

    const result = await recoverAuthFailure({
      instance,
      requestConfig: { url: 'system/user/page' },
      status: 409,
      errorCode: 'PERMISSION_VERSION_MISMATCH',
    });

    expect(result).toEqual({ kind: 'pass_through' });
  });

  it('passes through when permission mismatch replay is exhausted', async () => {
    const result = await recoverAuthFailure({
      instance,
      requestConfig: { url: 'system/user/page', _authRecoveryRetryCount: 1 },
      status: 409,
      errorCode: 'PERMISSION_VERSION_MISMATCH',
    });

    expect(result).toEqual({ kind: 'pass_through' });
    expect(replayRequestWithRefreshedTokenMock).not.toHaveBeenCalled();
    expect(messageMock).not.toHaveBeenCalled();
  });

  it('passes through skipAuth and missing config', async () => {
    const skipped = await recoverAuthFailure({
      instance,
      requestConfig: { url: 'auth/login/username', skipAuth: true },
      status: 401,
      errorCode: 'TOKEN_EXPIRED',
    });
    expect(skipped).toEqual({ kind: 'pass_through' });

    const missing = await recoverAuthFailure({
      instance,
      requestConfig: undefined,
      status: 401,
      errorCode: 'TOKEN_EXPIRED',
    });
    expect(missing).toEqual({ kind: 'pass_through' });
    expect(replayRequestWithRefreshedTokenMock).not.toHaveBeenCalled();
  });

  it('passes through non-auth statuses', async () => {
    const result = await recoverAuthFailure({
      instance,
      requestConfig: { url: 'system/user/page' },
      status: 502,
    });

    expect(result).toEqual({ kind: 'pass_through' });
  });
});
