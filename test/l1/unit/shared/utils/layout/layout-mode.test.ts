import { describe, expect, it } from 'vitest';
import { LAYOUT_DEFAULT_MODE } from '@/core/config/ui-config';
import {
  LAYOUT_MODES,
  resolveLayoutCapabilities,
  toLayoutMode,
  type LayoutMode,
} from '@/shared/utils/layout/layout-mode';

describe('layoutMode', () => {
  it('LAYOUT_MODES 覆盖三态', () => {
    expect(LAYOUT_MODES).toEqual(['vertical', 'horizontal', 'mix']);
  });

  it('toLayoutMode 校验与回落', () => {
    expect(toLayoutMode('mix')).toBe('mix');
    expect(toLayoutMode('vertical')).toBe('vertical');
    expect(toLayoutMode('unknown')).toBe(LAYOUT_DEFAULT_MODE);
    expect(toLayoutMode(undefined)).toBe(LAYOUT_DEFAULT_MODE);
    expect(toLayoutMode(null)).toBe(LAYOUT_DEFAULT_MODE);
  });

  it.each([
    [
      'vertical',
      {
        showSidebar: true,
        showHorizontalNavbar: false,
        showMixTopMenu: false,
        showNavbarBreadcrumb: true,
        showToolbar: true,
        useMixSidebar: false,
        mobileMaskUsesSidebar: true,
      },
    ],
    [
      'horizontal',
      {
        showSidebar: false,
        showHorizontalNavbar: true,
        showMixTopMenu: false,
        showNavbarBreadcrumb: true,
        showToolbar: false,
        useMixSidebar: false,
        mobileMaskUsesSidebar: false,
      },
    ],
    [
      'mix',
      {
        showSidebar: true,
        showHorizontalNavbar: false,
        showMixTopMenu: true,
        showNavbarBreadcrumb: false,
        showToolbar: false,
        useMixSidebar: true,
        mobileMaskUsesSidebar: false,
      },
    ],
  ] as const)('resolveLayoutCapabilities(%s)', (mode: LayoutMode, expected) => {
    expect(resolveLayoutCapabilities(mode)).toEqual({ mode, ...expected });
  });
});
