import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetToken, mockFormatToken, mockRefreshAccessToken } = vi.hoisted(() => ({
  mockGetToken: vi.fn(),
  mockFormatToken: vi.fn((token: string) => `Bearer ${token}`),
  mockRefreshAccessToken: vi.fn(),
}));

vi.mock('@/core/session/token/sessionToken', () => ({
  getToken: mockGetToken,
  formatToken: mockFormatToken,
}));

vi.mock('@/core/auth/refreshAccessToken', () => ({
  refreshAccessToken: mockRefreshAccessToken,
}));

describe('tokenRefreshCoordinator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs refresh in single-flight mode under concurrency', async () => {
    let refreshed = false;
    mockGetToken.mockImplementation(() => {
      if (!refreshed) {
        return {};
      }
      return { accessToken: 'access-token-1' };
    });
    mockRefreshAccessToken.mockImplementation(async () => {
      refreshed = true;
    });

    const { refreshAccessTokenSingleFlight } = await import('@/core/auth/tokenRefreshCoordinator');
    const [token1, token2] = await Promise.all([refreshAccessTokenSingleFlight(), refreshAccessTokenSingleFlight()]);

    expect(token1).toBe('access-token-1');
    expect(token2).toBe('access-token-1');
    expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
  });

  it('throws when refreshed token payload misses access token', async () => {
    mockGetToken.mockReturnValue({});
    mockRefreshAccessToken.mockResolvedValue(undefined);

    const { refreshAccessTokenSingleFlight } = await import('@/core/auth/tokenRefreshCoordinator');

    await expect(refreshAccessTokenSingleFlight()).rejects.toThrow('Access token is missing after refresh.');
  });

  it('injects refreshed bearer token when replaying request and headers are empty', async () => {
    let refreshed = false;
    mockGetToken.mockImplementation(() => {
      if (!refreshed) {
        return {};
      }
      return { accessToken: 'access-token-3' };
    });
    mockRefreshAccessToken.mockImplementation(async () => {
      refreshed = true;
    });
    const request = vi.fn().mockResolvedValue({ data: { ok: true } });
    const { replayRequestWithRefreshedToken } = await import('@/core/auth/tokenRefreshCoordinator');
    const config: any = { url: 'system/user/page' };

    const result = await replayRequestWithRefreshedToken({ request } as any, config);

    expect(mockFormatToken).toHaveBeenCalledWith('access-token-3');
    expect(config.headers.Authorization).toBe('Bearer access-token-3');
    expect(request).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: { ok: true } });
  });
});
