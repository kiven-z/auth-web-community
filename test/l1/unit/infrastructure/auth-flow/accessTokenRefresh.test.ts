import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockGetToken,
  mockSetToken,
  mockFormatToken,
  mockRefreshTokenApi,
  mockReadSessionPreferences,
  mockApplyRememberPreferencesFromResponse,
} = vi.hoisted(() => ({
  mockGetToken: vi.fn(),
  mockSetToken: vi.fn(),
  mockFormatToken: vi.fn((token: string) => `Bearer ${token}`),
  mockRefreshTokenApi: vi.fn(),
  mockReadSessionPreferences: vi.fn(() => ({ isRemembered: false, loginDay: 7 })),
  mockApplyRememberPreferencesFromResponse: vi.fn(),
}));

vi.mock('@/core/session/token/sessionToken', () => ({
  getToken: mockGetToken,
  setToken: mockSetToken,
  formatToken: mockFormatToken,
}));

vi.mock('@/api/auth/login', () => ({
  refreshTokenApi: mockRefreshTokenApi,
}));

vi.mock('@/core/session/remember/sessionPreferences', () => ({
  readSessionPreferences: mockReadSessionPreferences,
}));

vi.mock('@/core/session/remember/rememberPreferences', () => ({
  applyRememberPreferencesFromResponse: mockApplyRememberPreferencesFromResponse,
}));

describe('accessTokenRefresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReadSessionPreferences.mockReturnValue({ isRemembered: false, loginDay: 7 });
  });

  it('runs refresh in single-flight mode under concurrency', async () => {
    mockRefreshTokenApi.mockResolvedValue({
      accessToken: 'access-token-1',
      expires: 1,
      username: 'u',
      id: '1',
      roles: [],
      permissions: [],
    });
    mockGetToken.mockReturnValue({ accessToken: 'access-token-1' });

    const { refreshAccessTokenSingleFlight } = await import('@/core/auth/accessTokenRefresh');
    const [token1, token2] = await Promise.all([refreshAccessTokenSingleFlight(), refreshAccessTokenSingleFlight()]);

    expect(token1).toBe('access-token-1');
    expect(token2).toBe('access-token-1');
    expect(mockRefreshTokenApi).toHaveBeenCalledTimes(1);
    expect(mockSetToken).toHaveBeenCalledTimes(1);
  });

  it('throws when refreshed token payload misses access token', async () => {
    mockRefreshTokenApi.mockResolvedValue({
      accessToken: 'access-token-2',
      expires: 1,
      username: 'u',
      id: '1',
      roles: [],
      permissions: [],
    });
    mockGetToken.mockReturnValue({});

    const { refreshAccessTokenSingleFlight } = await import('@/core/auth/accessTokenRefresh');

    await expect(refreshAccessTokenSingleFlight()).rejects.toThrow('Access token is missing after refresh.');
  });

  it('injects refreshed bearer token when replaying request and headers are empty', async () => {
    mockRefreshTokenApi.mockResolvedValue({
      accessToken: 'access-token-3',
      expires: 1,
      username: 'u',
      id: '1',
      roles: [],
      permissions: [],
    });
    mockGetToken.mockReturnValue({ accessToken: 'access-token-3' });
    const request = vi.fn().mockResolvedValue({ data: { ok: true } });
    const { replayRequestWithRefreshedToken } = await import('@/core/auth/accessTokenRefresh');
    const config: any = { url: 'system/user/page' };

    const result = await replayRequestWithRefreshedToken({ request } as any, config);

    expect(mockFormatToken).toHaveBeenCalledWith('access-token-3');
    expect(config.headers.Authorization).toBe('Bearer access-token-3');
    expect(request).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: { ok: true } });
  });
});
