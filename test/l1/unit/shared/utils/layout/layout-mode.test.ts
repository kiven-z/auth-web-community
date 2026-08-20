import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LAYOUT_MODE,
  isLayoutMode,
  LAYOUT_MODES,
  resolveLayoutCapabilities,
  toLayoutMode,
  type LayoutMode,
} from '@/shared/utils/layout/layout-mode';

describe('layout-mode', () => {
  it('LAYOUT_MODES 覆盖三态', () => {
    expect(LAYOUT_MODES).toEqual(['vertical', 'horizontal', 'mix']);
  });

  it('isLayoutMode / toLayoutMode 校验与回落', () => {
    expect(isLayoutMode('vertical')).toBe(true);
    expect(isLayoutMode('side')).toBe(false);
    expect(isLayoutMode(null)).toBe(false);
    expect(toLayoutMode('mix')).toBe('mix');
    expect(toLayoutMode('unknown')).toBe(DEFAULT_LAYOUT_MODE);
    expect(toLayoutMode(undefined)).toBe(DEFAULT_LAYOUT_MODE);
  });

  it.each([
    [
      'vertical',
      {
        showSideNav: true,
        showHorizontalNav: false,
        showMixTopMenu: false,
        showNavbarBreadcrumb: true,
        showNavbarToolbar: true,
        useMixSideMenu: false,
        mobileMaskUsesSideNav: true,
      },
    ],
    [
      'horizontal',
      {
        showSideNav: false,
        showHorizontalNav: true,
        showMixTopMenu: false,
        showNavbarBreadcrumb: true,
        showNavbarToolbar: false,
        useMixSideMenu: false,
        mobileMaskUsesSideNav: false,
      },
    ],
    [
      'mix',
      {
        showSideNav: true,
        showHorizontalNav: false,
        showMixTopMenu: true,
        showNavbarBreadcrumb: false,
        showNavbarToolbar: false,
        useMixSideMenu: true,
        mobileMaskUsesSideNav: false,
      },
    ],
  ] as const)('resolveLayoutCapabilities(%s)', (mode: LayoutMode, expected) => {
    expect(resolveLayoutCapabilities(mode)).toEqual({ mode, ...expected });
  });
});
