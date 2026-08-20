import { executeAuthRecovery } from '@/core/auth/recovery/executor';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { replayRequestWithRefreshedTokenMock } = vi.hoisted(() => ({
  replayRequestWithRefreshedTokenMock: vi.fn(),
}));

vi.mock('@/core/auth/tokenRefreshCoordinator', () => ({
  replayRequestWithRefreshedToken: replayRequestWithRefreshedTokenMock,
}));

vi.mock('@/auth/config/auth/auth-recovery-effects', () => ({
  runAuthRecoverySideEffect: vi.fn(),
}));

describe('executeAuthRecovery', () => {
  beforeEach(() => {
    replayRequestWithRefreshedTokenMock.mockReset();
  });

  it('replays request when refresh strategy matches', async () => {
    replayRequestWithRefreshedTokenMock.mockResolvedValue({ data: { ok: true } });
    const requestConfig: any = { url: 'system/user/page', headers: {} };

    const result = await executeAuthRecovery({
      instance: { request: vi.fn() } as any,
      requestConfig,
      context: {
        status: 401,
        errorCode: 'TOKEN_EXPIRED',
        requestUrl: 'system/user/page',
        isNoAuthPath: false,
        retryCount: 0,
      },
    });

    expect(result.handled).toBe(true);
    expect(result.action).toBe('refresh_and_retry');
    expect(result.replayResult).toEqual({ data: { ok: true } });
    expect(requestConfig._authRecoveryRetryCount).toBe(1);
  });

  it('replays request when session missing matches refresh strategy', async () => {
    replayRequestWithRefreshedTokenMock.mockResolvedValue({ data: { ok: true } });
    const requestConfig: any = { url: 'system/user/page', headers: {} };

    const result = await executeAuthRecovery({
      instance: { request: vi.fn() } as any,
      requestConfig,
      context: {
        status: 401,
        errorCode: 'SESSION_MISSING',
        requestUrl: 'system/user/page',
        isNoAuthPath: false,
        retryCount: 0,
      },
    });

    expect(result.handled).toBe(true);
    expect(result.action).toBe('refresh_and_retry');
    expect(result.replayResult).toEqual({ data: { ok: true } });
  });

  it('requests logout when refresh replay fails', async () => {
    replayRequestWithRefreshedTokenMock.mockRejectedValue(new Error('refresh failed'));

    const result = await executeAuthRecovery({
      instance: { request: vi.fn() } as any,
      requestConfig: { url: 'system/user/page' } as any,
      context: {
        status: 401,
        errorCode: 'TOKEN_EXPIRED',
        requestUrl: 'system/user/page',
        isNoAuthPath: false,
        retryCount: 0,
      },
    });

    expect(result.handled).toBe(true);
    expect(result.shouldLogout).toBe(true);
    expect(result.replayError).toBeInstanceOf(Error);
  });

  it('returns pass-through when request config is missing', async () => {
    const result = await executeAuthRecovery({
      instance: { request: vi.fn() } as any,
      requestConfig: undefined,
      context: {
        status: 401,
        errorCode: 'TOKEN_EXPIRED',
        requestUrl: 'system/user/page',
        isNoAuthPath: false,
        retryCount: 0,
      },
    });

    expect(result.handled).toBe(false);
    expect(result.action).toBe('pass_through');
  });
});
