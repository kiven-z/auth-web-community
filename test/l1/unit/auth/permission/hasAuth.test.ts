import { hasAuth } from '@/auth/permission/hasAuth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { permissionsRef } = vi.hoisted(() => ({
  permissionsRef: { value: [] as string[] },
}));

vi.mock('@/store/modules/auth/user', () => ({
  useUserStore: () => ({
    get permissions() {
      return permissionsRef.value;
    },
  }),
}));

describe('hasAuth', () => {
  beforeEach(() => {
    permissionsRef.value = [];
  });

  it('returns false when required is empty or user has no permissions', () => {
    expect(hasAuth('')).toBe(false);
    expect(hasAuth([])).toBe(false);
    permissionsRef.value = [];
    expect(hasAuth('sys:user:query')).toBe(false);
  });

  it('matches a single permission code', () => {
    permissionsRef.value = ['sys:user:query'];
    expect(hasAuth('sys:user:query')).toBe(true);
    expect(hasAuth('sys:user:update')).toBe(false);
  });

  it('uses AND by default for permission arrays', () => {
    permissionsRef.value = ['sys:user:query'];
    expect(hasAuth(['sys:user:query', 'sys:user:update'])).toBe(false);
    permissionsRef.value = ['sys:user:*'];
    expect(hasAuth(['sys:user:query', 'sys:user:update'])).toBe(true);
  });

  it('uses OR when mode is any', () => {
    permissionsRef.value = ['sys:user:query'];
    expect(hasAuth(['sys:user:query', 'sys:user:update'], 'any')).toBe(true);
    expect(hasAuth(['sys:role:query', 'sys:user:update'], 'any')).toBe(false);
  });
});
