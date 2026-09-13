import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetItem: vi.fn(),
  mockSetItem: vi.fn(),
  mockRemoveItem: vi.fn(),
}));

vi.mock('@/core/storage/storage-local', () => ({
  storageLocal: () => ({
    getItem: mocks.mockGetItem,
    setItem: mocks.mockSetItem,
    removeItem: mocks.mockRemoveItem,
  }),
}));

describe('getAccessTokenStore (DEV → localStorage)', () => {
  const key = 'authorized-token';

  beforeEach(() => {
    vi.resetModules();
    mocks.mockGetItem.mockReset();
    mocks.mockSetItem.mockReset();
    mocks.mockRemoveItem.mockReset();
  });

  it('persists to localStorage on set and reads back on get/has', async () => {
    mocks.mockGetItem.mockReturnValue({ accessToken: 'dev-at', expires: 99 });
    const { getAccessTokenStore } = await import('@/core/session/token/access-token-read-writer');
    const store = getAccessTokenStore();
    expect(store.get()).toBe('dev-at');
    expect(store.has()).toBe(true);
    store.set({ accessToken: 'next', expires: 100 });
    expect(mocks.mockSetItem).toHaveBeenCalledWith(key, { accessToken: 'next', expires: 100 });
  });

  it('clear removes localStorage entry', async () => {
    const { getAccessTokenStore } = await import('@/core/session/token/access-token-read-writer');
    const store = getAccessTokenStore();
    store.clear();
    expect(mocks.mockRemoveItem).toHaveBeenCalledWith(key);
  });

  it('returns empty when localStorage has no token', async () => {
    mocks.mockGetItem.mockReturnValue(null);
    const { getAccessTokenStore } = await import('@/core/session/token/access-token-read-writer');
    const store = getAccessTokenStore();
    expect(store.get()).toBe('');
    expect(store.has()).toBe(false);
  });

  it('returns the same singleton within one module load', async () => {
    const { getAccessTokenStore } = await import('@/core/session/token/access-token-read-writer');
    expect(getAccessTokenStore()).toBe(getAccessTokenStore());
  });
});
