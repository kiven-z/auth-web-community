import { describe, expect, it } from 'vitest';
import { resolveContentSectionPaddingTop } from '@/layout/utils/content-style';

describe('resolveContentSectionPaddingTop', () => {
  it('uses 48px padding when tabs are hidden', () => {
    expect(
      resolveContentSectionPaddingTop({
        hideTabs: true,
        showModel: 'chrome',
      })
    ).toBe('48px');
  });

  it('uses chrome / default tab padding', () => {
    expect(
      resolveContentSectionPaddingTop({
        hideTabs: false,
        showModel: 'chrome',
      })
    ).toBe('85px');

    expect(
      resolveContentSectionPaddingTop({
        hideTabs: false,
        showModel: 'smart',
      })
    ).toBe('81px');
  });

  it('uses tags-only padding in content fullscreen', () => {
    expect(
      resolveContentSectionPaddingTop({
        hideTabs: false,
        showModel: 'smart',
        contentFullscreen: true,
      })
    ).toBe('37px');

    expect(
      resolveContentSectionPaddingTop({
        hideTabs: false,
        showModel: 'chrome',
        contentFullscreen: true,
      })
    ).toBe('37px');
  });

  it('uses zero padding when content fullscreen and tabs hidden', () => {
    expect(
      resolveContentSectionPaddingTop({
        hideTabs: true,
        showModel: 'smart',
        contentFullscreen: true,
      })
    ).toBe('0px');
  });
});
