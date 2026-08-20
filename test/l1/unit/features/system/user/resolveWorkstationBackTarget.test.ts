import { describe, expect, it } from 'vitest';
import { resolveWorkstationBackTarget } from '@/features/system/user/workstation/hooks/shell/resolveWorkstationBackTarget';

describe('resolveWorkstationBackTarget', () => {
  it('prefers history path when absolute', () => {
    expect(resolveWorkstationBackTarget('/system/user', true)).toBe('/system/user');
    expect(resolveWorkstationBackTarget('/system/user', false)).toBe('/system/user');
  });

  it('falls back to SystemUser when route exists', () => {
    expect(resolveWorkstationBackTarget(undefined, true)).toEqual({ name: 'SystemUser' });
    expect(resolveWorkstationBackTarget('relative', true)).toEqual({ name: 'SystemUser' });
  });

  it('falls back to home when SystemUser is missing', () => {
    expect(resolveWorkstationBackTarget(null, false)).toBe('/');
  });
});
