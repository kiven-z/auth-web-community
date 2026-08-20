import { describe, expect, it } from 'vitest';
import { resolveLayContentMainWidth, resolveLayContentSectionStyle } from '@/layout/utils/content-style';

describe('resolveLayContentMainWidth', () => {
  it('uses pixel width for numeric stretch', () => {
    expect(resolveLayContentMainWidth(1200)).toBe('1200px');
  });

  it('uses fixed 1440px when stretch is truthy non-number', () => {
    expect(resolveLayContentMainWidth(true)).toBe('1440px');
  });

  it('uses full width when stretch is falsy', () => {
    expect(resolveLayContentMainWidth(false)).toBe('100%');
    expect(resolveLayContentMainWidth(undefined)).toBe('100%');
  });
});

describe('resolveLayContentSectionStyle', () => {
  it('applies scroll-mode min-height and zero padding when header is not fixed', () => {
    expect(
      resolveLayContentSectionStyle({
        hideTabs: true,
        showModel: 'chrome',
        fixedHeader: false,
      })
    ).toEqual(['padding-top: 0;min-height: calc(100vh - 48px);']);

    expect(
      resolveLayContentSectionStyle({
        hideTabs: false,
        showModel: 'smart',
        fixedHeader: false,
      })
    ).toEqual(['padding-top: 0;min-height: calc(100vh - 86px);']);
  });

  it('uses 48px padding when tabs are hidden and header is fixed', () => {
    expect(
      resolveLayContentSectionStyle({
        hideTabs: true,
        showModel: 'chrome',
        fixedHeader: true,
      })
    ).toEqual(['padding-top: 48px;']);
  });

  it('uses chrome / default tab padding when header is fixed', () => {
    expect(
      resolveLayContentSectionStyle({
        hideTabs: false,
        showModel: 'chrome',
        fixedHeader: true,
      })
    ).toEqual(['padding-top: 85px;']);

    expect(
      resolveLayContentSectionStyle({
        hideTabs: false,
        showModel: 'smart',
        fixedHeader: true,
      })
    ).toEqual(['padding-top: 81px;']);
  });
});
