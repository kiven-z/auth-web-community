import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetItem: vi.fn(),
  cookiesGet: vi.fn(),
}));

vi.mock('@/core/storage/storageLocal', () => ({
  storageLocal: () => ({
    getItem: mocks.mockGetItem,
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }),
}));

vi.mock('js-cookie', () => ({
  default: {
    get: mocks.cookiesGet,
  },
}));

describe('sessionAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('returns true for isLoggedIn when cookie and profile both exist', async () => {
    mocks.cookiesGet.mockReturnValue('true');
    mocks.mockGetItem.mockReturnValue({ username: 'alice', roles: ['admin'] });

    const { isLoggedIn } = await import('@/core/session/sessionAuth');
    expect(isLoggedIn()).toBe(true);
  });

  it('returns false for isLoggedIn when profile is missing', async () => {
    mocks.cookiesGet.mockReturnValue('true');
    mocks.mockGetItem.mockReturnValue(null);

    const { isLoggedIn } = await import('@/core/session/sessionAuth');
    expect(isLoggedIn()).toBe(false);
  });
});
