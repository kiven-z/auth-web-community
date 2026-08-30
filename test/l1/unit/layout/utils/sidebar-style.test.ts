import { describe, expect, it } from 'vitest';
import { resolveSubMenuIconMargin } from '@/layout/utils/sidebar-style';

describe('resolveSubMenuIconMargin', () => {
  it('keeps horizontal inset for horizontal mode', () => {
    expect(resolveSubMenuIconMargin('horizontal', true)).toBe('0 5px 0 0');
    expect(resolveSubMenuIconMargin('horizontal', false)).toBe('0 5px 0 0');
  });

  it('centers icon when collapsed in vertical/mix', () => {
    expect(resolveSubMenuIconMargin('vertical', true)).toBe('0 auto');
    expect(resolveSubMenuIconMargin('mix', true)).toBe('0 auto');
  });

  it('keeps horizontal inset when expanded in vertical/mix', () => {
    expect(resolveSubMenuIconMargin('vertical', false)).toBe('0 5px 0 0');
    expect(resolveSubMenuIconMargin('mix', false)).toBe('0 5px 0 0');
  });
});
