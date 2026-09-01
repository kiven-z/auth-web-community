import { SESSION_PREFERENCES_KEY } from '@/core/config/keys-config';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockSetItem, mockGetItem } = vi.hoisted(() => ({
  mockSetItem: vi.fn(),
  mockGetItem: vi.fn(),
}));

vi.mock('@/core/storage/storage-local', () => ({
  storageLocal: () => ({
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: vi.fn(),
  }),
}));

describe('rememberPreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItem.mockReturnValue(null);
  });

  it('writes loginDay from readMeDay when remembered', async () => {
    const { applyRememberPreferencesFromResponse } = await import('@/core/session/remember/remember-preferences');

    applyRememberPreferencesFromResponse(true, 14);

    expect(mockSetItem).toHaveBeenCalledWith(SESSION_PREFERENCES_KEY, {
      isRemembered: true,
      loginDay: 14,
    });
  });

  it('writes loginDay 0 when not remembered', async () => {
    const { applyRememberPreferencesFromResponse } = await import('@/core/session/remember/remember-preferences');

    applyRememberPreferencesFromResponse(false, 14);

    expect(mockSetItem).toHaveBeenCalledWith(SESSION_PREFERENCES_KEY, {
      isRemembered: false,
      loginDay: 0,
    });
  });
});
