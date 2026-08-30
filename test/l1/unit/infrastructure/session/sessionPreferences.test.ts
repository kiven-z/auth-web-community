import { SESSION_PREFERENCES_KEY } from '@/core/config/keysConfig';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetItem: vi.fn(),
  mockSetItem: vi.fn(),
  mockRemoveItem: vi.fn(),
}));

vi.mock('@/core/storage/storageLocal', () => ({
  storageLocal: () => ({
    getItem: mocks.mockGetItem,
    setItem: mocks.mockSetItem,
    removeItem: mocks.mockRemoveItem,
  }),
}));

describe('sessionPreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('returns defaults when preferences are not stored', async () => {
    mocks.mockGetItem.mockReturnValue(null);
    const { readSessionPreferences } = await import('@/core/session/remember/sessionPreferences');

    expect(readSessionPreferences()).toEqual({ isRemembered: false, loginDay: 7 });
  });

  it('merges partial updates when writing preferences', async () => {
    mocks.mockGetItem.mockReturnValue({ isRemembered: false, loginDay: 7 });
    const { writeSessionPreferences } = await import('@/core/session/remember/sessionPreferences');

    writeSessionPreferences({ isRemembered: true, loginDay: 30 });

    expect(mocks.mockSetItem).toHaveBeenCalledWith(SESSION_PREFERENCES_KEY, {
      isRemembered: true,
      loginDay: 30,
    });
  });
});
