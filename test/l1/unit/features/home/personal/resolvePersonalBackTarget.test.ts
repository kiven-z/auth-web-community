import { describe, expect, it } from 'vitest';
import { resolvePersonalBackTarget } from '@/features/home/personal/hooks/resolvePersonalBackTarget';

describe('resolvePersonalBackTarget', () => {
  it('prefers history path when absolute', () => {
    expect(resolvePersonalBackTarget('/welcome')).toBe('/welcome');
  });

  it('falls back to home otherwise', () => {
    expect(resolvePersonalBackTarget(undefined)).toBe('/');
    expect(resolvePersonalBackTarget('nope')).toBe('/');
  });
});
