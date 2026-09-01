import { attachRequestAuthInterceptor } from '@/core/http/interceptors/request-auth';
import axios, { type AxiosAdapter, type AxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getTokenMock, hasAccessTokenMock, isLoggedInMock, ensureAccessTokenReadyMock } = vi.hoisted(() => ({
  getTokenMock: vi.fn(),
  hasAccessTokenMock: vi.fn(),
  isLoggedInMock: vi.fn(),
  ensureAccessTokenReadyMock: vi.fn(),
}));

vi.mock('@/core/session/token/session-token', () => ({
  getToken: getTokenMock,
  hasAccessToken: hasAccessTokenMock,
  formatToken: (token: string) => `Bearer ${token}`,
}));

vi.mock('@/core/session/session-auth', () => ({
  isLoggedIn: isLoggedInMock,
}));

vi.mock('@/core/session/token/access-token-ready', () => ({
  ensureAccessTokenReady: ensureAccessTokenReadyMock,
}));

function resolvedAdapter(assertFn: (config: AxiosRequestConfig) => void): AxiosAdapter {
  return async (config: AxiosRequestConfig) => {
    assertFn(config);
    return {
      data: { ok: true },
      status: 200,
      statusText: 'ok',
      headers: {},
      config: config as any,
    } as any;
  };
}

function buildClient() {
  const instance = axios.create();
  attachRequestAuthInterceptor(instance);
  return instance;
}

describe('requestAuth interceptor', () => {
  beforeEach(() => {
    getTokenMock.mockReset();
    hasAccessTokenMock.mockReset();
    isLoggedInMock.mockReset();
    ensureAccessTokenReadyMock.mockReset();
    hasAccessTokenMock.mockReturnValue(true);
    isLoggedInMock.mockReturnValue(false);
    ensureAccessTokenReadyMock.mockResolvedValue(true);
  });

  it('skips Authorization for refresh-token requests', async () => {
    getTokenMock.mockReturnValue({
      accessToken: 'expired-access-token',
    });
    const client = buildClient();

    await client.request({
      url: 'auth/refresh-token',
      method: 'post',
      adapter: resolvedAdapter((config) => {
        expect((config.headers as any)?.Authorization).toBeUndefined();
      }),
    });
    expect(ensureAccessTokenReadyMock).not.toHaveBeenCalled();
  });

  it('skips Authorization for login username requests', async () => {
    getTokenMock.mockReturnValue({
      accessToken: 'any-token',
    });
    const client = buildClient();

    await client.request({
      url: 'auth/login/username',
      method: 'post',
      adapter: resolvedAdapter((config) => {
        expect((config.headers as any)?.Authorization).toBeUndefined();
      }),
    });
  });

  it('awaits accessToken restore before attaching Authorization on cold boot', async () => {
    isLoggedInMock.mockReturnValue(true);
    hasAccessTokenMock.mockReturnValue(false);
    ensureAccessTokenReadyMock.mockImplementation(async () => {
      getTokenMock.mockReturnValue({ accessToken: 'restored-token' });
      return true;
    });
    getTokenMock.mockReturnValue({});

    const client = buildClient();

    await client.request({
      url: 'system/me/preferences',
      method: 'get',
      adapter: resolvedAdapter((config) => {
        expect((config.headers as any)?.Authorization).toBe('Bearer restored-token');
      }),
    });

    expect(ensureAccessTokenReadyMock).toHaveBeenCalledTimes(1);
  });

  it('does not restore when already has accessToken', async () => {
    isLoggedInMock.mockReturnValue(true);
    hasAccessTokenMock.mockReturnValue(true);
    getTokenMock.mockReturnValue({ accessToken: 'memory-token' });

    const client = buildClient();

    await client.request({
      url: 'system/me/preferences',
      method: 'get',
      adapter: resolvedAdapter((config) => {
        expect((config.headers as any)?.Authorization).toBe('Bearer memory-token');
      }),
    });

    expect(ensureAccessTokenReadyMock).not.toHaveBeenCalled();
  });
});
