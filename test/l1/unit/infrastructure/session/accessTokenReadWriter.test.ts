import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetItem: vi.fn(),
  mockSetItem: vi.fn(),
  mockRemoveItem: vi.fn(),
  cookiesGet: vi.fn(),
  cookiesRemove: vi.fn(),
}));

vi.mock('@/core/storage/storageLocal', () => ({
  storageLocal: () => ({
    getItem: mocks.mockGetItem,
    setItem: mocks.mockSetItem,
    removeItem: mocks.mockRemoveItem,
  }),
}));

vi.mock('js-cookie', () => ({
  default: {
    get: mocks.cookiesGet,
    remove: mocks.cookiesRemove,
  },
}));

describe('getAccessTokenStore (DEV → localStorage)', () => {
  const key = 'authorized-token';

  beforeEach(() => {
    vi.resetModules();
    mocks.mockGetItem.mockReset();
    mocks.mockSetItem.mockReset();
    mocks.mockRemoveItem.mockReset();
    mocks.cookiesGet.mockReset();
    mocks.cookiesRemove.mockReset();
  });

  it('persists to localStorage on set and reads back on get/has', async () => {
    mocks.mockGetItem.mockReturnValue({ accessToken: 'dev-at', expires: 99 });
    const { getAccessTokenStore } = await import('@/core/session/token/accessTokenReadWriter');
    const store = getAccessTokenStore();
    expect(store.get()).toBe('dev-at');
    expect(store.has()).toBe(true);
    store.set({ accessToken: 'next', expires: 100 });
    expect(mocks.mockSetItem).toHaveBeenCalledWith(key, { accessToken: 'next', expires: 100 });
  });

  it('migrates legacy cookie payload into localStorage once', async () => {
    mocks.mockGetItem.mockReturnValue(null);
    mocks.cookiesGet.mockReturnValue(JSON.stringify({ accessToken: 'from-cookie', expires: 42 }));
    const { getAccessTokenStore } = await import('@/core/session/token/accessTokenReadWriter');
    const store = getAccessTokenStore();
    expect(store.get()).toBe('from-cookie');
    expect(mocks.mockSetItem).toHaveBeenCalledWith(key, { accessToken: 'from-cookie', expires: 42 });
    expect(mocks.cookiesRemove).toHaveBeenCalledWith(key);
  });

  it('clear removes localStorage entry and cookie key', async () => {
    const { getAccessTokenStore } = await import('@/core/session/token/accessTokenReadWriter');
    const store = getAccessTokenStore();
    store.clear();
    expect(mocks.mockRemoveItem).toHaveBeenCalledWith(key);
    expect(mocks.cookiesRemove).toHaveBeenCalledWith(key);
  });

  it('returns the same singleton within one module load', async () => {
    const { getAccessTokenStore } = await import('@/core/session/token/accessTokenReadWriter');
    expect(getAccessTokenStore()).toBe(getAccessTokenStore());
  });
});
