import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DevLocalStorageAccessTokenStore, MemoryAccessTokenStore } from '@/core/session/token/accessTokenReadWriter';

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

describe('MemoryAccessTokenStore', () => {
  it('returns empty until set, then get/has reflect value', () => {
    const store = new MemoryAccessTokenStore();
    expect(store.has()).toBe(false);
    expect(store.get()).toBe('');
    store.set({ accessToken: 't1', expires: 1 });
    expect(store.has()).toBe(true);
    expect(store.get()).toBe('t1');
    store.clear();
    expect(store.has()).toBe(false);
    expect(store.get()).toBe('');
  });
});

describe('DevLocalStorageAccessTokenStore', () => {
  const key = 'authorized-token';

  beforeEach(() => {
    mocks.mockGetItem.mockReset();
    mocks.mockSetItem.mockReset();
    mocks.mockRemoveItem.mockReset();
    mocks.cookiesGet.mockReset();
    mocks.cookiesRemove.mockReset();
  });

  it('persists to localStorage on set and reads back on get/has', () => {
    mocks.mockGetItem.mockReturnValue({ accessToken: 'dev-at', expires: 99 });
    const store = new DevLocalStorageAccessTokenStore(key);
    expect(store.get()).toBe('dev-at');
    expect(store.has()).toBe(true);
    store.set({ accessToken: 'next', expires: 100 });
    expect(mocks.mockSetItem).toHaveBeenCalledWith(key, { accessToken: 'next', expires: 100 });
  });

  it('migrates legacy cookie payload into localStorage once', () => {
    mocks.mockGetItem.mockReturnValue(null);
    mocks.cookiesGet.mockReturnValue(JSON.stringify({ accessToken: 'from-cookie', expires: 42 }));
    const store = new DevLocalStorageAccessTokenStore(key);
    expect(store.get()).toBe('from-cookie');
    expect(mocks.mockSetItem).toHaveBeenCalledWith(key, { accessToken: 'from-cookie', expires: 42 });
    expect(mocks.cookiesRemove).toHaveBeenCalledWith(key);
  });

  it('clear removes localStorage entry and cookie key', () => {
    const store = new DevLocalStorageAccessTokenStore(key);
    store.clear();
    expect(mocks.mockRemoveItem).toHaveBeenCalledWith(key);
    expect(mocks.cookiesRemove).toHaveBeenCalledWith(key);
  });
});
