import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('auth-session-effects', () => {
  beforeEach(async () => {
    vi.resetModules();
    const { resetSessionLogout } = await import('@/auth/config/auth/auth-session-effects');
    resetSessionLogout();
  });

  it('runs registered logout handler', async () => {
    const handler = vi.fn();
    const { registerSessionLogout, runSessionLogout } = await import('@/auth/config/auth/auth-session-effects');

    registerSessionLogout(handler);
    await runSessionLogout();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does nothing when logout handler is not registered', async () => {
    const { runSessionLogout } = await import('@/auth/config/auth/auth-session-effects');

    await expect(runSessionLogout()).resolves.toBeUndefined();
  });
});
