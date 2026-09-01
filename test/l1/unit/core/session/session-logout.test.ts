import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('sessionLogout', () => {
  beforeEach(async () => {
    vi.resetModules();
    const { resetSessionLogout } = await import('@/core/session/session-logout');
    resetSessionLogout();
  });

  it('runs registered logout handler', async () => {
    const handler = vi.fn();
    const { registerSessionLogout, runSessionLogout } = await import('@/core/session/session-logout');

    registerSessionLogout(handler);
    await runSessionLogout();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does nothing when logout handler is not registered', async () => {
    const { runSessionLogout } = await import('@/core/session/session-logout');

    await expect(runSessionLogout()).resolves.toBeUndefined();
  });
});
