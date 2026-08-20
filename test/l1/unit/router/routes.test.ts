import { constantMenus, constantRoutes, remainingPaths } from '@/router/routes';
import { describe, expect, it } from 'vitest';

describe('router static tables', () => {
  it('loads remaining paths and menus without circular module init', () => {
    expect(remainingPaths).toContain('/login');
    expect(constantMenus.length).toBeGreaterThan(0);
    expect(constantRoutes.length).toBeGreaterThan(0);
  });
});
