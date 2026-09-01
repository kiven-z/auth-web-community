import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('userProfileSync', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('invokes registered handler when syncing profile', async () => {
    const handler = vi.fn();
    const { registerUserProfileSync, syncUserProfileToStore } = await import('@/core/session/profile/user-profile-sync');

    registerUserProfileSync(handler);
    const profile = {
      avatar: '',
      username: 'alice',
      nickname: 'Alice',
      primaryDeptId: '10',
      primaryDeptName: '研发部',
      roles: ['admin'],
      permissions: ['sys:user:view'],
      userId: '1',
    };
    syncUserProfileToStore(profile);

    expect(handler).toHaveBeenCalledWith(profile);
  });

  it('does nothing when no handler is registered', async () => {
    const { syncUserProfileToStore } = await import('@/core/session/profile/user-profile-sync');

    expect(() =>
      syncUserProfileToStore({
        avatar: '',
        username: 'bob',
        nickname: 'Bob',
        primaryDeptId: '',
        primaryDeptName: '',
        roles: [],
        permissions: [],
        userId: '2',
      })
    ).not.toThrow();
  });
});
