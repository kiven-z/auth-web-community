import type { UserLoginResponse } from '@/api/auth/models/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockSetToken, mockApplyRemember, mockHydrateSideEffects } = vi.hoisted(() => ({
  mockSetToken: vi.fn(),
  mockApplyRemember: vi.fn(),
  mockHydrateSideEffects: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/core/session/token/sessionToken', () => ({
  setToken: mockSetToken,
}));

vi.mock('@/core/session/remember/rememberPreferences', () => ({
  applyRememberPreferencesFromResponse: mockApplyRemember,
}));

vi.mock('@/core/session/sessionBootstrap', () => ({
  hydrateAuthenticatedSessionSideEffects: mockHydrateSideEffects,
}));

describe('establishSessionFromLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHydrateSideEffects.mockResolvedValue(undefined);
  });

  it('applies remember preferences, setToken auth-only, then awaits session side-effects', async () => {
    const loginResponse: UserLoginResponse = {
      id: '1',
      username: 'alice',
      roles: ['ROLE_USER'],
      permissions: ['sys:user:query'],
      accessToken: 'access-1',
      expires: '2026/05/20 12:00:00',
      readMeDay: 14,
    };

    const { establishSessionFromLogin } = await import('@/core/session/loginSession');
    const result = await establishSessionFromLogin(async () => loginResponse, { isRemembered: true });

    expect(result).toBe(loginResponse);
    expect(mockApplyRemember).toHaveBeenCalledWith(true, 14);
    expect(mockSetToken).toHaveBeenCalledWith({
      accessToken: 'access-1',
      expires: '2026/05/20 12:00:00',
      username: 'alice',
      roles: ['ROLE_USER'],
      permissions: ['sys:user:query'],
      userId: '1',
    });
    expect(mockHydrateSideEffects).toHaveBeenCalledTimes(1);
    expect(mockApplyRemember.mock.invocationCallOrder[0]).toBeLessThan(mockSetToken.mock.invocationCallOrder[0]);
    expect(mockSetToken.mock.invocationCallOrder[0]).toBeLessThan(mockHydrateSideEffects.mock.invocationCallOrder[0]);
  });
});
