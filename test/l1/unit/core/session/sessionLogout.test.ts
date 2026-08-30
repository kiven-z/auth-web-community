import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('sessionLogout', () => {
  beforeEach(async () => {
    vi.resetModules();
    const { resetSessionLogout } = await import('@/core/session/sessionLogout');
    resetSessionLogout();
  });

  it('runs registered logout handler', async () => {
    const handler = vi.fn();
    const { registerSessionLogout, runSessionLogout } = await import('@/core/session/sessionLogout');

    registerSessionLogout(handler);
    await runSessionLogout();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does nothing when logout handler is not registered', async () => {
    const { runSessionLogout } = await import('@/core/session/sessionLogout');

    await expect(runSessionLogout()).resolves.toBeUndefined();
  });
});
